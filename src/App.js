import React, { Component } from 'react';
import { recover } from "eosjs-ecc";
import logo from './logo.svg';
import './App.css';


const network = {
  protocol: 'http', // Defaults to https
  blockchain: 'eos',
  host: '127.0.0.1', // ( or null if endorsed chainId )
  port: 8888, // ( or null if defaulting to 80 )
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
}

class App extends Component {
  state = { isScatterLoad: false, identity: null }
  componentDidMount() {
    document.addEventListener('scatterLoaded', scatterExtension => {
      // Scatter will now be available from the window scope.
      // At this stage your app's connection to the Scatter web extension is encrypted
      // and ready for use.
      console.info('Scatter Plugin Found!')
      console.info(window.scatter.identity)
      this.scatter = window.scatter;
      const { identity } = this.scatter
      this.setState({ isScatterLoad: true, identity })
      // It is good practice to take this off the window once you have 
      // a reference to it.
      window.scatter = null
    })
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
    const sign = await scatter.requestArbitrarySignature(
      publicKey, 
      signMsg, 
      'Login Authentication', 
      false
    )
    const recoveredPubKey = recover(sign, signMsg)
    console.info(`recovered signer: ${recoveredPubKey} by signature: ${sign}`)

  }

  render() {
    const { isScatterLoad, identity  } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        { identity && 
          <div className="logined">
            <h3 className="title"> 应用代号 { identity.publicKey } </h3>
            <button
              onClick={(e) => this.signOut(e)}>
            SIGN OUT
            </button>
          <button
              onClick={(e) => this.signData(e)}>
            SIGN DATA
            </button>
        </div>
         }
        { !identity && <button disabled={!isScatterLoad}
          onClick={(e) => this.requestIdentity(e)}>
          {isScatterLoad ? "SIGN IN" : "Please Install Scatter First"}
        </button> }
        
      </div>
    );
  }
}

export default App;
