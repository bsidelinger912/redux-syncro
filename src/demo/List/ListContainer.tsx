import connector, { InjectedProps } from "src/connector/connector";
import { ConnectorState } from "src/redux/reducer";

interface OwnProps {

}

interface StateProps {

}

export type Props = InjectedProps & StateProps & OwnProps;

function getState(_: ConnectorState) {
  return {};
}

export default (Component: React.ComponentClass<Props>): React.ComponentClass<OwnProps> =>
  connector<OwnProps, {}, {}>(getState)(Component);


