import { Dispatch } from "redux";

import { ReducerState } from "../redux/reducer";

// Stuff for our redux setup
// From redux
export interface ReduxAction<T, P> {
  type: T;
  payload: P;
}

export interface ReduxActionMap<S extends {}, A extends ReduxAction<any, any>> {
  [key: string]: (state: S, action: A) => S;
}

// Dependency stuff
export enum Status {
  Unknown = "Unknown",
  Success = "Success",
  Error = "Error",
  Pending = "Pending",
  Refreshing = "Refreshing",
  Polling = "Polling",
}

export interface NormalError {
  status: number;
  body: {
    message: string;
    code?: string;
  };
}

export interface SerializableResponse<T> {
  headers: object;
  ok: boolean;
  status: number;
  statusText: string;
  body?: T;
}

export interface DependencyVariant<T> {
  status: Status;
  result?: SerializableResponse<T>;
  error?: NormalError;
}

export interface DependencyOptions<Args> {
  pollingIntervalMs?: number;
  args: Args;
}

export type DependencyRef<Args, Resp> = (args: Args) => Promise<Response>;

export interface Dependency<Args, Resp extends {}> {
  currentState: DependencyVariant<Resp>;
  dependencyKey: string;
  dependencyRef: DependencyRef<Args, Resp>;
  isDependency: boolean;
  options: DependencyOptions<Args>
}

// TODO: use new conditional typing
export type MappedStateProps<StateProps> = {
  [P in keyof StateProps]: StateProps[P] | Dependency<any, any> | Array<Dependency<any, any>>;
}

// action stuff
export type ActionRef<Args, Resp> = (args: Args) => Promise<Response>;
export interface ActionOptions {
  refreshProps?: string[];
}

export interface ApiAction<Args, Resp extends {}> {
  method: ActionRef<Args, Resp>;
  options: ActionOptions;
}

export type MappedActionProps<AP> = {
  [P in keyof AP]: AP[P] | ApiAction<any, any> | Dispatch<ReduxAction<any, any>>;
};

// stuff internal to connector
// the connector adds prop name to be able to refresh certain dependencies from the wrapped component
export interface DependencyWithPropReference extends Dependency<any, any> {
  propName?: string;
}

export interface ApiActionWithPropName extends ApiAction<any, any> {
  propName?: string;
}

// TODO: look closer at this
export interface PropsFromGetState {
  // [key: string]: DependencyVariant<any> | Array<DependencyVariant<any>> | DependencyWithPropReference[]
  // | Dependency<any, any> | Array<Dependency<any, any>> | string | number | boolean | ReducerState;
  [key: string]: any;
  connectorState: ReducerState;
  apiDeps: DependencyWithPropReference[];
}

export interface PropsFromBindActions {
  [key: string]: Function | ApiAction<any, any> | ApiActionWithPropName[]; // tslint:disable-line
  registeredActions: ApiActionWithPropName[];
}

