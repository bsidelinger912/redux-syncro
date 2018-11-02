import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import mapApiDeps from "./mapApiDeps";

import * as reduxActions from "../redux/actions";
import { ConnectorState } from "../redux/reducer";
import { ApiAction, MappedActionProps, MappedStateProps, NormalError, PropsFromBindActions, PropsFromGetState, ReduxAction, SerializableResponse } from "./types";

import DependencyResolver from "./DependencyResolver";

interface ComponentState {
  reduxActions: Record<string, ApiAction<any, any>>;
}

export interface InjectedProps {
  refresh: (propsList?: string[]) => void;
}

export interface InternalProps {
  apiPending: (dependencyId: string) => reduxActions.StatusAction;
  apiRefreshing: (dependencyId: string) => reduxActions.StatusAction;
  apiPolling: (dependencyId: string) => reduxActions.StatusAction;
  apiPageLoaded: (dependencyId: string, response: SerializableResponse<any>) => reduxActions.SuccessAction;
  apiSuccess: (dependencyId: string, response: SerializableResponse<any>) => reduxActions.SuccessAction;
  apiError: (dependencyId: string, error: NormalError) => reduxActions.ErrorAction;
  clearApiEntry: (dependencyId: string) => reduxActions.StatusAction;
}

// TODO: how much of react-redux to support here?
export interface Options { } // tslint:disable-line

// removableProps should match keys of Internal Props, plus anything in PropsFromBindActions
const removableProps = [
  "apiPending", "apiRefreshing", "apiPageLoaded", "apiSuccess", "apiError",
  "apiPolling", "clearApiEntry", "apiDeps",
];

export function cleanProps<FullProps, FinalProps>(props: FullProps): FinalProps {
  const newProps: Record<string, any> = {};

  Object.keys(props).forEach((key) => {
    if (removableProps.indexOf(key) < 0) {
      newProps[key] = (props as Record<string, any>)[key];
    }
  });

  return newProps as FinalProps;
}

type ConnectorHOC<OwnProps, FinalProps> = (
  Component: React.ComponentClass<FinalProps> | React.StatelessComponent<FinalProps>
) => React.ComponentClass<OwnProps>;

function connector<
  OwnProps extends {},
  StateProps extends {},
  ActionProps extends {},
  FinalProps = Partial<OwnProps & InjectedProps & StateProps & ActionProps>
  >(
    getState?: (state: ConnectorState, ownProps?: OwnProps) => MappedStateProps<StateProps>,
    bindActions?: (dispatch: Dispatch<any>, ownProps?: OwnProps) => MappedActionProps<ActionProps>,
    processProps?: (props: OwnProps & InjectedProps & StateProps & ActionProps) => FinalProps,
    options?: Options,
): ConnectorHOC<OwnProps, FinalProps> {
  // map state to props and such defined here
  function mapStateToProps(state: ConnectorState, ownProps: OwnProps): PropsFromGetState {
    const { connectorState } = state;

    if (!getState) {
      return { connectorState, apiDeps: [] };
    }

    const derivedState = getState(state) as object as PropsFromGetState;

    return mapApiDeps(derivedState);
  }

  function mapDispatchToProps(dispatch: Dispatch<ReduxAction<any, any>>): PropsFromBindActions {
    return {} as any; //  registeredActions: [] };
  }

  return (Component) => {
    type CombinedInternalProps = OwnProps & InternalProps & PropsFromGetState & PropsFromBindActions;
    type WithChildren = Readonly<{ children?: React.ReactNode; }> & Readonly<CombinedInternalProps>;

    class ConnectorComponent extends React.Component<CombinedInternalProps, ComponentState> {
      public render(): JSX.Element {
        const cleanedProps = cleanProps<WithChildren, OwnProps>(this.props);

        return (
          <DependencyResolver {...this.props}>
            <Component {...cleanedProps} />
          </DependencyResolver>
        );
      }
    }

    // TODO: figure out typing here
    return connect(mapStateToProps, mapDispatchToProps)(ConnectorComponent as any);
  }
}

export default connector;