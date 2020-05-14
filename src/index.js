import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './components/app';

import store from './store';
import { Service } from './services';
import { FeedsProvider } from './components/feeds-service-context';

const feedsService = new Service();

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <FeedsProvider value={feedsService}>
                <App />
            </FeedsProvider>
        </Provider>
    </Router>, 
    document.getElementById('root'));
