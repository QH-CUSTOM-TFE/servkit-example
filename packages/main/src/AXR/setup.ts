import { app } from "../Application";
import { axrSetOptions } from 'axr/dist/ASR';
export * from 'axr/dist/ASR';

axrSetOptions({
    getState: () => {
        return app().axrState();
    },
    dispatch: (action) => {
        return app().axrDispatch(action);
    }
});