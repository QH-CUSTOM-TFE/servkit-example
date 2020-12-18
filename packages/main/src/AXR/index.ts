import { actionCreator, reducersCreator, sagaCreator, axr, axrCombine } from "./setup";
import { sappMGR } from 'servkit';
import { getAppInfo } from '../config/apps';
import appAxr from './app/app';
import sceneAxr from './scene/scene';
import { CommonService, SceneService } from 'servkit-example-main-decl';
import { CommonServiceImpl } from '../service/CommonServiceImpl';
import { SceneServiceImpl } from '../service/SceneServiceImpl';

const start = actionCreator.async<void>('start');
const startSaga = sagaCreator(start.started, () => {
    sappMGR.setConfig({
        loadAppInfo: async (mgr, id) => {
            return getAppInfo(id);
        },
    });
    sappMGR.addServices([{
        decl: CommonService,
        impl: CommonServiceImpl,
    }, {
        decl: SceneService,
        impl: SceneServiceImpl,
    }], {
        lazy: true,
    });

    appAxr.action.loadServAppInfos.started.dispatch();
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

export default axrCombine(appAxr, sceneAxr, defaultAxr);
