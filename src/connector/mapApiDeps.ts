import { DependencyWithPropReference, PropsFromGetState } from "./types";

export default function (derivedState: PropsFromGetState): PropsFromGetState {
  const apiDeps: DependencyWithPropReference[] = [];
  const returnState = { ...derivedState };

  Object.keys(derivedState).forEach((key) => {
    const stateProp = derivedState[key];
    // is it a data dependency registry?
    if (typeof stateProp === "object" && stateProp.isDependency) {
      const dependency: DependencyWithPropReference = stateProp;
      dependency.propName = key;
      apiDeps.push(dependency);

      // pass actual current state in to the component
      returnState[key] = dependency.currentState;


      // the dependency definition which has a current state a function to call and some args to pass to it
      /* const dependency: DependencyWithPropReference = (stateProp as DependencyFunction<any, any>)(reduxState);
      dependency.propName = key;
      apiDeps.push(dependency);

      // pass actual current state in to the component
      derivedState[key] = dependency.currentState;

      // is it an array of dependencies?
    } else if (
      Array.isArray(stateProp)
      && (stateProp as DependencyFunction<any, any>[]).length > 0
      && typeof (stateProp as DependencyFunction<any, any>[])[0] === "function"
    ) {
      const arrayDependency = stateProp as DependencyFunction<any, any>[];
      derivedState[key] = arrayDependency.map((dep) => {
        const dependency: DependencyWithPropReference = (dep as DependencyFunction<any, any>)(reduxState);
        dependency.propName = `${key}-${JSON.stringify(dependency.options.args)}`;
        apiDeps.push(dependency);

        return dependency.currentState;
      });*/

    }
  });

  return { ...returnState, apiDeps };
}
