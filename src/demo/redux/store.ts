import { combineReducers, compose, createStore } from "redux";

import connectorReducers, { ConnectorState } from "../../redux/reducer";
import demoReducer, { DemoState } from './demoReducer';

// TODO: connector state should probably not be accessible *****************
export interface AppState extends ConnectorState {
  demoState: DemoState;
}

const store = createStore(
  combineReducers({ ...connectorReducers, demoState: demoReducer }),
  compose(
    (window as any).devToolsExtension
      ? (window as any).devToolsExtension({ name: "connector demo", instanceId: "connector demo" })
      : (f: any) => f,
  ),
)

export default store;