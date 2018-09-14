

/**
 * @description reducer to hold global state, such as active compartment
 */

import { DependencyVariant, Status } from "../connector/types";
import { ActionTypes } from "./actions";
import createReducer from "./createReducer";

import {
  Action,
  ErrorAction,
  StatusAction,
  SuccessAction,
} from "./actions";

import { ReducersMapObject } from "redux";

export interface ReducerState {
  [key: string]: DependencyVariant<any>;
}

const initialState: ReducerState = {};

export const reducer =  createReducer<ReducerState, Action>({
  [ActionTypes.PENDING]: (state: ReducerState, action: StatusAction) => {
    return { ...state, [action.payload.dependencyKey]: { status: Status.Pending } };
  },

  [ActionTypes.REFRESHING]: (state: ReducerState, action: StatusAction) => {
    const newState = { ...state[action.payload.dependencyKey], status: Status.Refreshing };
    return { ...state, [action.payload.dependencyKey]: newState };
  },

  [ActionTypes.POLLING]: (state: ReducerState, action: StatusAction) => {
    const newState = { ...state[action.payload.dependencyKey], status: Status.Polling };
    return { ...state, [action.payload.dependencyKey]: newState };
  },

  [ActionTypes.PAGE_LOADED]: (state: ReducerState, action: SuccessAction) => {
    const currentDep = state[action.payload.dependencyKey] || { status: Status.Pending };

    return {
      ...state,
      [action.payload.dependencyKey]: { ...currentDep, result: action.payload.response },
    };
  },

  [ActionTypes.SUCCESS]: (state: ReducerState, action: SuccessAction) => {
    return { ...state, [action.payload.dependencyKey]: { result: action.payload.response, status: Status.Success } };
  },

  [ActionTypes.ERROR]: (state: ReducerState, action: ErrorAction) => {
    const newState = { ...state[action.payload.dependencyKey], status: Status.Error, error: action.payload.error };
    return { ...state, [action.payload.dependencyKey]: newState };
  },

  [ActionTypes.CLEAR]: (state: ReducerState, action: StatusAction) => {
    const stateToClean = { ...state };
    delete stateToClean[action.payload.dependencyKey];
    return stateToClean;
  },

  // when we switch region, clear all the cached data
  [ActionTypes.RESET]: () => {
    return initialState;
  }
}, initialState);

export interface ConnectorState {
  // TODO: what's the name posed to be?
  connectorState: ReducerState;
}

const connectorReducers: ReducersMapObject = {
  connectorState: reducer,
};

export default connectorReducers;
