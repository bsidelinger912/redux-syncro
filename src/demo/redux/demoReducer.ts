export interface DemoState {
  foo: string;
}

const initialState: DemoState = { foo: "bar" };

export default function (state: DemoState = initialState, action: any): DemoState {
  return state;
}
