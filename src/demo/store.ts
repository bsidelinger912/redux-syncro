import { combineReducers, compose, createStore } from "redux";

import connectorReducers from "../redux/reducer";

const store = createStore(
  combineReducers(connectorReducers),
  compose(
    (window as any).devToolsExtension
      ? (window as any).devToolsExtension({ name: "connector demo", instanceId: "connector demo"})
      : (f: any) => f,
  ),
)

export default store;