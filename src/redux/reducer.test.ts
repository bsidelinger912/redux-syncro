/* import { Status } from "../functions/variant";

import { ApiActionTypes } from "../actions/actionTypes";
import { reducer } from "./reducer";

const dependencyKey = "computeApi.listInstances:{compartmentId:123}";
const stateWithData = {
  [dependencyKey]: {
    status: Status.Success,
    result: { data: { foo: "bar" }, response: { headers: {}, status: 200, statusText: "ok", ok: true } },
  },
};

describe("Global Reducer", () => {
  it("should handle pending state", () => {
    const newState = reducer({}, {
      type: ApiActionTypes.PENDING,
      payload: { dependencyKey },
    });

    expect(newState[dependencyKey].status).toEqual(Status.Pending);
  });

  it("should handle refreshing state", () => {
    const newState = reducer(stateWithData, {
      type: ApiActionTypes.REFRESHING,
      payload: { dependencyKey },
    });

    expect(newState[dependencyKey].status).toEqual(Status.Refreshing);
    expect(newState[dependencyKey].result).toEqual(stateWithData[dependencyKey].result);
  });

  it("should handle refreshing state", () => {
    const newState = reducer(stateWithData, {
      type: ApiActionTypes.POLLING,
      payload: { dependencyKey },
    });

    expect(newState[dependencyKey].status).toEqual(Status.Polling);
    expect(newState[dependencyKey].result).toEqual(stateWithData[dependencyKey].result);
  });

  it("should handle page loaded state", () => {
    const response = { data: { fooz: "baz" }, response: { headers: {} } };
    const newState = reducer(stateWithData, {
      type: ApiActionTypes.PAGE_LOADED,
      payload: { dependencyKey, response },
    });

    expect(newState[dependencyKey].status).toEqual(stateWithData[dependencyKey].status);
    expect(newState[dependencyKey].result).toEqual(response);
  });

  it("should handle success state", () => {
    const response = { data: { fooz: "baz" }, response: { headers: {} } };
    const newState = reducer(stateWithData, {
      type: ApiActionTypes.SUCCESS,
      payload: { dependencyKey, response },
    });

    expect(newState[dependencyKey].status).toEqual(Status.Success);
    expect(newState[dependencyKey].result).toEqual(response);
  });

  it("should handle error state", () => {
    const newState = reducer(stateWithData, {
      type: ApiActionTypes.ERROR,
      payload: { dependencyKey, error: { message: "nooooo" } },
    });

    expect(newState[dependencyKey].status).toEqual(Status.Error);
    expect(newState[dependencyKey].error).toEqual({ message: "nooooo" });
  });

  it("should handle clearing of entry", () => {
    const newState = reducer(stateWithData, {
      type: ApiActionTypes.CLEAR,
      payload: { dependencyKey },
    });

    expect(typeof newState[dependencyKey]).toEqual("undefined");
  });
});
*/