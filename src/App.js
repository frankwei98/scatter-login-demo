import React, { Component } from 'react';
import { recover } from "eosjs-ecc";
import { getScatter, fetchIdentity } from "./scatter";
import logo from './logo.svg';
import './App.css';

const githubRepoUrl = `https://github.com/frankwei98/scatter-login-demo`

const network = {
  protocol: 'http', // Defaults to https
  blockchain: 'eos',
  host: '127.0.0.1', // ( or null if endorsed chainId )
  port: 8888, // ( or null if defaulting to 80 )
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
}

class App extends Component {
  state = { isScatterLoad: false, identity: null }
  async componentDidMount() {
    this.scatter = await getScatter()
    this.scatterB = await getScatter()
    const identity = await fetchIdentity()
    this.setState({ isScatterLoad: true, identity })
  }

  async signOut(e) {
    const { scatter } = this
    try {
      await scatter.forgetIdentity(network)
      this.setState({ identity: null })
    } catch (error) {

    }
  }

  async requestIdentity(e) {
    const { scatter } = this
    try {
      await scatter.suggestNetwork(network)
    } catch (error) {
      console.info('User canceled to suggestNetwork')
      return;
    }
    // const { scatter } = this.state
    scatter.getIdentity().then((identity) => {
      this.setState({ identity })
    }).catch(error => {
      console.error(error.message)
      //...
    });
  }

  async signData(e) {
    const { scatter } = this
    const { publicKey } = this.state.identity
    const signMsg = "Signing to Login foobar. 为 foobar 登录签名。foobar にサインインする。foobar에 로그인하십시오."

    const sign = await scatter.getArbitrarySignature(
      publicKey, 
      signMsg, 
      'Login Authentication', 
      false
    )
    const recoveredPubKey = recover(sign, signMsg)
    console.info(`recovered signer: ${recoveredPubKey} by signature: ${sign}`)
  }

  async signDataB(e) {
    const { scatterB } = this
    const { publicKey } = this.state.identity
    const signMsg = "Signing to Login foobar. 为 foobar 登录签名。foobar にサインインする。foobar에 로그인하십시오."

    const sign = await scatterB.getArbitrarySignature(
      publicKey, 
      signMsg, 
      'Login Authentication', 
      false
    )
    const recoveredPubKey = recover(sign, signMsg)
    console.info(`recovered signer: ${recoveredPubKey} by signature: ${sign}`)
  }

  render() {
    const { isScatterLoad, identity } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Scatter identity demo in React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {identity &&
          <div className="logined">
            <h3 className="title"> Your Scatter Token for this site & identity: {identity.publicKey} </h3>
            <button className="button is-danger"
              onClick={(e) => this.signOut(e)}>
              SIGN OUT
            </button>
            <button className="button"
              onClick={(e) => this.signData(e)}>
              SIGN DATA
            </button>
            <button className="button"
              onClick={(e) => this.signDataB(e)}>
              SIGN DATAB
            </button>
          </div>
        }
        {!identity && <button disabled={!isScatterLoad} className="button"
          onClick={(e) => this.requestIdentity(e)}>
          {isScatterLoad ? "SIGN IN" : "Please Install Scatter First"}
        </button>}
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
