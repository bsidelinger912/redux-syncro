import connector, { InjectedProps } from "src/connector/connector";
import { AppState } from "../redux/store";


interface OwnProps {

}

interface StateProps {

}

export type Props = InjectedProps & StateProps & OwnProps;

function getState(state: AppState) {
  return {
    foo: state.demoState.foo,
  };
}

export default (Component: React.ComponentClass<Props>): React.ComponentClass<OwnProps> =>
  connector<OwnProps, {}, {}>(getState)(Component);


