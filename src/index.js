import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ScatterProvider } from './ScatterContext';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <ScatterProvider>
        {/* DataProvider's state(data) will project to child's props */}
        {providerState => <App {...providerState} another="foobar" />}
    </ScatterProvider>
, document.getElementById('root'));
registerServiceWorker();
