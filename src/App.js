import React, { Component } from 'react';
import { recover } from "eosjs-ecc";
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
  state = { identity: null }

  

  async signOut(e) {
    const { scatter } = this.props
    try {
      await scatter.forgetIdentity(network)
      this.setState({ identity: null })
    } catch (error) {

    }
  }

  async requestIdentity(e) {
    const { scatter } = this.props
    // try {
    //   await scatter.suggestNetwork(network)
    // } catch (error) {
    //   console.info('User canceled to suggestNetwork')
    //   return;
    // }
    // const { scatter } = this.state
    scatter.getIdentity().then((identity) => {
      this.setState({ identity })
    }).catch(error => {
      console.error(error.message)
      //...
    });
  }

  async signData(e) {
    const { scatter } = this.props
    const { publicKey } = this.state.identity
    const signMsg = "By Signing, you will bind your Scatter identity with your account 1145141919XXOO"

    const sign = await scatter.getArbitrarySignature(
      publicKey, 
      signMsg, 
      'Login Authentication', 
      false
    )
    const recoveredPubKey = recover(sign, signMsg)
    console.info(`recovered signer: ${recoveredPubKey} by signature: ${sign}`)
  }

  render() {
    const { identity } = this.state
    const { scatter } = this.props
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
            <h1 className="title"> Your Scatter identity for this site is: </h1>
            <h2 className="subtitle"> {identity.publicKey} </h2>
            <button className="button is-danger"
              onClick={(e) => this.signOut(e)}>
              SIGN OUT
            </button>
            <button className="button"
              onClick={(e) => this.signData(e)}>
              SIGN MEMO with Scatter
            </button>
          </div>
        }
        {!identity && <button disabled={!scatter} className="button"
          onClick={(e) => this.requestIdentity(e)}>
          {this.props.scatter ? "SIGN IN" : "Please Install Scatter First"}
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
