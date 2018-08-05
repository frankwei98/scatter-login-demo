import React, { Component } from "react";
import { recover } from "eosjs-ecc";

import { withScatter } from "./ScatterContext";

const network = {
    protocol: 'http', // Defaults to https
    blockchain: 'eos',
    host: '127.0.0.1', // ( or null if endorsed chainId )
    port: 8888, // ( or null if defaulting to 80 )
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
}

class Child extends Component {
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
        const { scatter } = this.props
        const { identity } = this.state
        return (
            <div className="child-consumer">
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
                {!identity &&
                    <button disabled={!scatter} className="button"
                        onClick={(e) => this.requestIdentity(e)}>
                        {this.props.scatter ? "SIGN IN" : "Please Install Scatter First"}
                    </button>
                }
            </div>
        )
    }
}

const ChildWithScatter = withScatter(Child)

export default ChildWithScatter