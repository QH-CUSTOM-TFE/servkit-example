import { actionCreator, sagaCreator, axr, axrCombine } from "./setup";
import { sappMGR, ESappType } from 'servkit';
import { getAppInfo } from '../config/apps';
import appAxr from './app/app';
import { CommonService } from 'servkit-example-main-decl';
import { CommonServiceImpl } from '../service/CommonServiceImpl';
import { app } from '../Application';

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
    }], {
        lazy: true,
    });

    appAxr.action.loadServAppInfos.started.dispatch();
    
    Promise.all([sappMGR.create({
        id: 'scene',
        version: '1.0.0',
        name: '场景',
        url: '',
        html: // '/build-dev/scene.html'
        `
        <html>
            <head>
                <script type="text/javascript" src="assets/scene.js?\${version}" crossorigin></script>
            </head>
        </html>
        `
        ,
        type: ESappType.ASYNC_LOAD,
        options: {
        }
    }, {
        dontStartOnCreate: true,
    }), app().sceneContainerDeferred]).then(([app, ref]) => {
        app.getController().setLayoutOptions({
            container: ref.current,
        });

        app.start();
    });
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

export default axrCombine(appAxr, defaultAxr);
