import { app } from "../Application";
import { ApplicationState } from '../ApplicationState';
import {
    createASRContext,
} from 'axr/dist/ASR';

const context = createASRContext();
context.axrSetOptions({
    getState: () => {
        return app().axrState();
    },
    dispatch: (action: any) => {
        return app().axrDispatch(action);
    }
});

const { axr, axrCombine, axrPartial } = context;
const actionCreator = context.actionCreatorFactory('MAIN');
const reducersCreator = context.reducersCreator;
const reducersPartial = context.reducersPartial;
const sagaCreator = context.sagaCreator;

export {
    actionCreator,
    sagaCreator,
    reducersCreator,
    reducersPartial,
    axr,
    axrCombine,
    axrPartial,
};


context.axrSetOptions({
    getState: () => {
        return app().axrState();
    },
    dispatch: (action) => {
        return app().axrDispatch(action);
    }
});