import React, { Component } from "react";
import { recover } from "eosjs-ecc";
import networking from "./networking.json";
import { withScatter } from "./ScatterContext";


class Child extends Component {
    state = { identity: null }
    network = networking['mainnet']
    
    async signOut(e) {
        const { scatter } = this.props
        try {
            await scatter.forgetIdentity(this.network)
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
        scatter.getIdentity(
            { accounts: [this.network] }
        ).then((identity) => {
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