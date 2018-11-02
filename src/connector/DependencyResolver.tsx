/**
 * @class DependencyResolver
 * @description
 */

import * as React from "react";
import { DependencyWithPropReference, NormalError, SerializableResponse, Status } from "./types";

import { InternalProps } from "./connector";

// TODO: get rid of this
const defaultError = "An unexpected error occurred.";
const parseJSONError = "Unable to parse the error JSON body.";

// Return a normalized error object to allow easy handling,
// TODO: change this
const normalizeError = async (err: any): Promise<NormalError> => {
  if (typeof Response !== "undefined" && err instanceof Response) {
    try {
      const body = await err.json();
      return {
        body,
        status: err.status,
      };

    } catch (e) {
      return {
        body: {
          message: parseJSONError,
        },
        status: err.status,
      };
    }
  }

  return {
    body: {
      message: err.message || defaultError,
    },
    status: err.status
  };
};

function parseResponseHeaders(response: Response): Record<string, string> {
  const headers: Record<string, string> = {};
  response.headers.forEach((val: string, key: string) => {
    headers[key] = val;
  });

  return headers;
}

function serializeResponse<Data>(response: Response): SerializableResponse<Data> {
  return {
    headers: parseResponseHeaders(response),
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
  };
}

export interface Props extends InternalProps {
  apiDeps: DependencyWithPropReference[];
}

interface State {
}

class DependencyResolver extends React.Component<Props, State> {
  private refreshIntervals: Array<{ interval: number, propName: string }>;

  public componentDidMount(): void {
    this.callDeps();

    // set intervals for polling when specified
    this.props.apiDeps.forEach(this.maybeAddPolling);
  }

  public componentWillUnmount(): void {
    this.cancelAllPolling();
  }

  public render(): JSX.Element {
    return <>{this.props.children}</>;
  }

  private maybeAddPolling(apiDep: DependencyWithPropReference): void {
    if (!apiDep.options.pollingIntervalMs) {
      return;
    }

    this.refreshIntervals.push({
      interval: window.setInterval(() => this.pollDep(apiDep.propName as string), apiDep.options.pollingIntervalMs),
      propName: apiDep.propName as string,
    });
  }

  private cancelPolling(propName: string): void {
    const intervalDef = this.refreshIntervals.find(def => def.propName === propName);
    if (intervalDef) {
      window.clearInterval(intervalDef.interval);
    }
  }

  private cancelAllPolling(): void {
    this.refreshIntervals.forEach(intervalDef => window.clearInterval(intervalDef.interval));
  }

  private async callDeps(propsList?: string[], nextProps?: Props): Promise<void> {
    const { apiDeps } = nextProps || this.props;

    // filter down to deps matching props list if it's passed
    const depsToCall = propsList && propsList.length > 0
      ? apiDeps.filter(call => propsList.indexOf(call.propName as string) > -1)
      : apiDeps;

    depsToCall.forEach(this.callDep);
  }

  private async callDep(apiDep: DependencyWithPropReference): Promise<void> {
    const { apiPending, apiRefreshing } = this.props;
    const { currentState: { status }, dependencyKey } = apiDep;

    if (status !== Status.Pending && status !== Status.Refreshing) {
      if (status === Status.Success) {
        apiRefreshing(dependencyKey);
      } else {
        apiPending(dependencyKey);
      }

      this.resolveDep(apiDep);
    }
  }

  private async pollDep(propName: string): Promise<void> {
    const { apiPolling } = this.props;
    const apiDep = this.props.apiDeps.find(dep => dep.propName === propName);

    if (apiDep) {
      const { currentState: { status }, dependencyKey } = apiDep;
      if (status === Status.Success) {
        apiPolling(dependencyKey);

        this.resolveDep(apiDep);
      }
    }
  }

  private async resolveDep(apiDep: DependencyWithPropReference): Promise<void> {
    const { apiSuccess } = this.props;
    const { dependencyKey, dependencyRef, propName, options: { args } } = apiDep;

    try {
      const response = await dependencyRef(args);

      apiSuccess(dependencyKey, serializeResponse(response));
    } catch (e) {
      const error = await normalizeError(e);
      this.cancelPolling(propName as string);
      throw error;
    }
  }
}

export default DependencyResolver;