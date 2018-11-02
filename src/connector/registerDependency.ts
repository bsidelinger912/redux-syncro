import { ConnectorState } from "../redux/reducer";
import { Dependency, DependencyRef, DependencyVariant, Status } from "./types";

interface Options<Args> {
  args: Args;
}

// TODO: is T generic providing any value???
function getVariantFromState<T extends {}>(dependencyKey: string, state: ConnectorState): DependencyVariant<T> {
  const variant = state.connectorState[dependencyKey] as DependencyVariant<T>;

  return variant || { status: Status.Unknown };
};

export default function <Args, Response>(dependencyRef: DependencyRef<Args, Response>, options: Options<Args>, state: ConnectorState): Dependency<Args, Response> {
  // how do we get a string from a method?????????????
  const methodString = "foo";

  const dependencyKey = `${methodString}:${JSON.stringify(options.args)}`;
  const currentState = getVariantFromState<Response>(dependencyKey, state);

  return {
    currentState,
    dependencyKey,
    dependencyRef,
    isDependency: true,
    options,
  };
}