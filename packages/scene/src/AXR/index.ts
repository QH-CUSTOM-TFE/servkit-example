import { actionCreator, reducersCreator, sagaCreator, axr, axrCombine } from "./setup";
import { sappMGR } from 'servkit';
import sceneAxr from './scene/scene';
import { SceneService } from 'servkit-example-scene-decl';
import { SceneServiceImpl } from '../service/SceneServiceImpl';

const start = actionCreator.async<void>('start');
const startSaga = sagaCreator(start.started, () => {
    sappMGR.addServices([{
        decl: SceneService,
        impl: SceneServiceImpl,
    }]);
});

export const action = {
    start
};

const defaultAxr =  axr(action,
    [
        startSaga
    ],
    {
    }
);

export default axrCombine(sceneAxr, defaultAxr);
