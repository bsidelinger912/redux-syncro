

import * as React from 'react';
import { Provider } from 'react-redux';

import './App.css';

import store from "./redux/store";

import List from './List/List';

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">React Redux Connector</h1>
          </header>
          <div>
            <h2>Here's a list example</h2>
            <List />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
