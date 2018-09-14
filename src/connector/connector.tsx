import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import * as reduxActions from "../redux/actions";
import { ConnectorState } from "../redux/reducer";
import { ApiAction, MappedActionProps,MappedStateProps, NormalError, PropsFromBindActions, PropsFromGetState, ReduxAction, SerializableResponse } from "./types";


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
export interface Options {} // tslint:disable-line

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
    return { apiState: {}, apiDeps: [] };
  }

  function mapDispatchToProps(dispatch: Dispatch<ReduxAction<any, any>>): PropsFromBindActions {
    return { registeredActions: [] };
  }

  return (Component) => {
    type CombinedInternalProps = OwnProps & InternalProps & PropsFromGetState & PropsFromBindActions;
    // type WithChildren = Readonly<{ children?: React.ReactNode; }> & Readonly<CombinedInternalProps>;

    class ConnectorComponent extends React.Component<CombinedInternalProps, ComponentState> {
      public render(): JSX.Element {
        return (
          <Component {...this.props} />
        );
      }
    }

    // TODO: figure out typing here
    return connect(mapStateToProps, mapDispatchToProps)(ConnectorComponent as any);
  }
}

export default connector;