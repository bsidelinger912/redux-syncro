import { NormalError, ReduxAction, SerializableResponse } from "../connector/types";

export enum ActionTypes {
  PENDING = "CONNECTOR.PENDING",
  ERROR = "CONNECTOR.ERROR",
  PAGE_LOADED = "CONNECTOR.PAGE_LOADED",
  SUCCESS = "CONNECTOR.SUCCESS",
  REFRESHING = "CONNECTOR.REFRESHING",
  POLLING = "CONNECTOR.POLLING",
  CLEAR = "CONNECTOR.CLEAR",
  RESET = "CONNECTOR.RESET",
}

export type Action = StatusAction | SuccessAction | ErrorAction;

export type StatusAction = ReduxAction<ActionTypes, { dependencyKey: string }>;
export type SuccessAction = ReduxAction<
  ActionTypes,
  { dependencyKey: string, response: SerializableResponse<any> }>;
export type ErrorAction = ReduxAction<ActionTypes, { dependencyKey: string, error: NormalError }>;

export function pending(dependencyKey: string): StatusAction {
  return {
    payload: { dependencyKey },
    type: ActionTypes.PENDING,
  };
}

export function refreshing(dependencyKey: string): StatusAction {
  return {
    payload: { dependencyKey },
    type: ActionTypes.REFRESHING,
  };
}

export function polling(dependencyKey: string): StatusAction {
  return {
    payload: { dependencyKey },
    type: ActionTypes.POLLING,
  };
}

export function pageLoaded(dependencyKey: string, response: SerializableResponse<any>): SuccessAction {
  return {
    payload: { dependencyKey, response },
    type: ActionTypes.PAGE_LOADED,
  };
}

export function success(dependencyKey: string, response: SerializableResponse<any>): SuccessAction {
  return {
    payload: { dependencyKey, response },
    type: ActionTypes.SUCCESS,
  };
}

export function error(dependencyKey: string, e: NormalError): ErrorAction {
  return {
    payload: { dependencyKey, error: e },
    type: ActionTypes.ERROR,
  };
}

export function clearEntry(dependencyKey: string): StatusAction {
  return {
    payload: { dependencyKey },
    type: ActionTypes.CLEAR,
  };
}
