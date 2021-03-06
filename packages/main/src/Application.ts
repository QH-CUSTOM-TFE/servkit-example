import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineReducers, applyMiddleware, createStore, Store } from 'redux';
import AXR, { action } from './AXR';
import createSagaMiddleware from 'redux-saga';
import { all, spawn } from 'redux-saga/effects';
import { Provider } from 'react-redux';
import { Component } from './Component';
import { ApplicationState } from './ApplicationState';
import { DeferredUtil } from 'servkit';

let sInstance: Application;

export class Application {
    private store: Store<ApplicationState>;
    sceneContainerDeferred = DeferredUtil.create<React.RefObject<HTMLDivElement>>();
    
    constructor() {
        if (sInstance) {
            throw new Error('Application instance has created');
        }

        sInstance = this;
    }

    public init() {
        this.initRedux();
        action.start.started.dispatch();
    }

    public run() {
        this.render();
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
        let element = document.getElementById('root');
        if (!element) {
            element = document.createElement('div');
            element.style.position = 'absolute';
            element.style.left = '0';
            element.style.top = '0';
            element.style.width = '800px';
            element.style.height = '600px';
            element.style.zIndex = '100000';
            
            document.body.appendChild(element);
        }
        ReactDOM.render(
            React.createElement(
                Provider, 
                {
                    store: this.store,
                },
                React.createElement(Component)
            ),
            element
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