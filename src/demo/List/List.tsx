import * as React from "react";

import container, { Props } from "./ListContainer";

class List extends React.Component<Props, {}> {
  public render(): JSX.Element {
    // console.log(this.props); // tslint:disable-line
    return (
      <div>{JSON.stringify(this.props, null, 2)}</div>
    );
  }
}

export default container(List);