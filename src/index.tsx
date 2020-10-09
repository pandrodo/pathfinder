import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './normalize.css';
import './index.css';
import App from './components/App';
import configureStore from "./store";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);