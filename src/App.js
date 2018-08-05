import React, { Component } from 'react';
import Child from "./childComponent";
import logo from './logo.svg';
import './App.css';

const githubRepoUrl = `https://github.com/frankwei98/scatter-login-demo`


class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Scatter identity demo in React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Child a="foobar" />
        <footer style={{textAlign: 'center'}}>
          © Frank Wei
          <br/>
          <a href={githubRepoUrl}> Check out scatter-login-demo on GitHub </a>
        </footer>
      </div>
    );
  }
}

export default App;
