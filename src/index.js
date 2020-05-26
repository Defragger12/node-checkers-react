import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import registerServiceWorker from './app/registerServiceWorker';
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, createStore, compose} from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import authReducer from "./app/store/reducers/auth";
import gameReducer from "./app/store/reducers/game";
import userReducer from "./app/store/reducers/user";

const rootReducer = combineReducers({
    auth: authReducer,
    game: gameReducer,
    user: userReducer
});

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancers = composeWithDevTools(middlewareEnhancer);

const store = createStore(rootReducer, composedEnhancers);

const app = (
    <Provider store={store}>
        <App/>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
