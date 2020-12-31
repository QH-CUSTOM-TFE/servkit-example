import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineReducers, applyMiddleware, createStore, Store } from 'redux';
import AXR, { action } from './AXR';
import createSagaMiddleware from 'redux-saga';
import { all, spawn } from 'redux-saga/effects';
import { Provider } from 'react-redux';
import { Component } from './Component';
import { ApplicationState } from './ApplicationState';
import { SappAsyncLoadSDK } from 'servkit';

let sInstance: Application;

export class Application {
    private store: Store<ApplicationState>;
    private element?: HTMLElement;
    sappSDK: SappAsyncLoadSDK;
    
    constructor(sappSDK: SappAsyncLoadSDK) {
        if (sInstance) {
            throw new Error('Application instance has created');
        }

        this.sappSDK = sappSDK;
        sInstance = this;
    }

    public init() {
        this.initRedux();
        action.start.started.dispatch();
    }

    public run() {
        this.render();
    }

    public exit() {
        if (this.element) {
            ReactDOM.unmountComponentAtNode(this.element)
        }
        
        this.sappSDK =  undefined;
        sInstance = undefined!;
    }

    public axrState() {
        return this.store.getState();
    }

    public axrDispatch(action) {
        // tslint:disable
        console.groupCollapsed && console.groupCollapsed('%c[action] ' + action.type, 'background-color: #EEE;');
        console.log(action);
        console.groupEnd && console.groupEnd();
        // tslint:enable

        return this.store.dispatch(action);
    }

    protected render() {
        this.element = this.sappSDK.getDefaultStartParams().container!;
        ReactDOM.render(
            React.createElement(
                Provider, 
                {
                    store: this.store,
                },
                React.createElement(Component)
            ),
            this.element
        );
    }

    

    protected initRedux() {
        const sagaMiddleware = createSagaMiddleware();
        const rootReducer = combineReducers(AXR.reducer);
        this.store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    
        const sagas = AXR.handler;
        const rootSaga = function* () {
            yield all(sagas.map(saga => spawn(saga.saga)));
        };

        sagaMiddleware.run(rootSaga as any);
    }
};

export const app = (): Application => {
    return sInstance;
}