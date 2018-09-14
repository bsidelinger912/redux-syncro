/* import {
  ActionTypes, apiPending, apiRefreshing, apiSuccess, apiError, apiPolling, clearApiEntry, apiPageLoaded,
} from "./actions";

const dependencyKey = "computeApi.listInstances:{compartmentId:123}";

describe("Global Action Creators", () => {
  it("should have a apiPending action creator", () => {
    const action = apiPending(dependencyKey);
    expect(action.type).toEqual(ActionTypes.PENDING);
    expect(action.payload.dependencyKey).toEqual(dependencyKey);
  });

  it("should have an apiRefreshing action creator", () => {
    const action = apiRefreshing(dependencyKey);
    expect(action.type).toEqual(ActionTypes.REFRESHING);
    expect(action.payload.dependencyKey).toEqual(dependencyKey);
  });

  it("should have an apiPolling action creator", () => {
    const action = apiPolling(dependencyKey);
    expect(action.type).toEqual(ActionTypes.POLLING);
    expect(action.payload.dependencyKey).toEqual(dependencyKey);
  });

  it("should have an apiPageLoaded action creator", () => {
    const payload = {
      data: { foo: "bar" }, response: { headers: {}, status: 200, statusText: "ok", ok: true },
    };
    const action = apiPageLoaded(dependencyKey, payload);
    expect(action.type).toEqual(ActionTypes.PAGE_LOADED);
    expect(action.payload.dependencyKey).toEqual(dependencyKey);
    expect(action.payload.response).toEqual(payload);
  });

  it("should have an apiSuccess action creator", () => {
    const payload = {
      data: { foo: "bar" }, response: { headers: {}, status: 200, statusText: "ok", ok: true },
    };
    const action = apiSuccess(dependencyKey, payload);
    expect(action.type).toEqual(ActionTypes.SUCCESS);
    expect(action.payload.dependencyKey).toEqual(dependencyKey);
    expect(action.payload.response).toEqual(payload);
  });

  it("should have an apiError action creator", () => {
    const action = apiError(dependencyKey, { status: 500, body: { message: "aaah" } });
    expect(action.type).toEqual(ActionTypes.ERROR);
    expect(action.payload.dependencyKey).toEqual(dependencyKey);
    expect(action.payload.error).toEqual({ status: 500, body: { message: "aaah" } });
  });

  it("should have a clearApiEntry action creator", () => {
    const action = clearApiEntry(dependencyKey);
    expect(action.type).toEqual(ActionTypes.CLEAR);
    expect(action.payload.dependencyKey).toEqual(dependencyKey);
  });
});
*/