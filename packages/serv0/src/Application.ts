import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from './Component';

let sInstance: Application;

export class Application {
    constructor() {
        if (sInstance) {
            throw new Error('Application instance has created');
        }

        sInstance = this;
    }

    public init() {
        //
    }

    public run() {
        this.render();
    }

    protected render() {
        const element = document.getElementById('root');
        ReactDOM.render(
            React.createElement(Component),
            element
        );
    }
};

export const app = (): Application => {
    return sInstance;
}