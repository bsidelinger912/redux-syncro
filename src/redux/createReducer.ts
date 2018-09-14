/**
 * Allows you to create a reducer with a map of action types to functions
 */

import { ReduxAction, ReduxActionMap } from "../connector/types";

export default function createReducer<S extends {}, A extends ReduxAction<any, any>>(
  actionMap: ReduxActionMap<S, A>, 
  initialState: S
): (state: S, action: A) => S {
  
  return (state: S = initialState, action: A): S => {
    const func = actionMap[action.type];
    return func && func(state, action) || state;
  };
}
