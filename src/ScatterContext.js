import React, { Component } from 'react';

const ScatterContext = React.createContext(null);

export const { Consumer } = ScatterContext

export const withScatter = (Component) => (props) => (
    <ScatterConsumer>
        {
            scatter => <Component {...props} scatter={scatter} />
        }
    </ScatterConsumer>
)

export class ScatterProvider extends Component {
    // We do all those scatter dirty job here
    state = { scatter: null }

    componentWillMount() {
        // Listen to Scatter Loading
        document.addEventListener('scatterLoaded', () => {
            const scatter = window.scatter
            this.setState({ scatter })
            // It is good practice to take this off the window 
            // once you have a reference to it. @GetScatter Team
            window.scatter = null
        })
    }

    render() {
        return (
            <ScatterContext.Provider value={this.state.scatter}>
                {this.props.children(this.state)}
            </ScatterContext.Provider>
        )
    }
}


export class ScatterConsumer extends Component {
    render() {
        return (
            <Consumer>
                {
                    scatter => this.props.children(scatter)
                }
            </Consumer>
        )
    }
}


