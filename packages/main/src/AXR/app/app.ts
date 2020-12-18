import { actionCreator, reducersCreator, sagaCreator, axr } from "../setup";
import { sappMGR, Sapp, SappInfo } from 'servkit';
import { getAppInfo, getAppList } from '../../config/apps';

export interface AppsState {
    apps: ServAppState[],
    infos: SappInfo[],
    curApp?: ServAppState;
}

export interface ServAppState {
    id: string,
    app: Sapp,
}

const loadServAppInfos = actionCreator.async<SappInfo[]>('loadServAppInfos');
const loadServAppInfosSaga = sagaCreator(loadServAppInfos.started, function*(){
    const infos = getAppList();
    loadServAppInfos.done.dispatch({
        params: undefined,
        result: infos,
    });
});

const startServApp = actionCreator.async<string, Sapp>('startServApp');
const startServAppSaga = sagaCreator.every(startServApp.started, function*(id) {
    const app: Sapp = yield sappMGR.create(id, {
        dontStartOnCreate: true,
    }).catch(() => {
        return undefined;
    });

    if (!app) {
        startServApp.failed.dispatch({
            params: id,
        });
        return;
    }

    app.closed.then(() => {
        removeServApp.dispatch(app);
    }, () => {
        removeServApp.dispatch(app);
    });

    startServApp.done.dispatch({
        params: id,
        result: app,
    });
});

const removeServApp = actionCreator<Sapp>('removeServApp');

export const action = {
    startServApp,
    loadServAppInfos,
};

const apps = reducersCreator<AppsState>({
    apps: [],
    infos: [],
})
.case(startServApp.done, (state, payload) => {
    state = {
        ...state,
    }

    const app = { id: payload.params, app: payload.result };
    state.apps = [...state.apps, app];
    state.curApp = app;
    
    return state;
})
.case(loadServAppInfos.done, (state, payload) => {
    state = {
        ...state,
    }
    state.infos = [...payload.result];
    
    return state;
})
.case(removeServApp, (state, payload) => {
    state = {
        ...state,
    }

    state.apps = state.apps.filter((item) => item.app !== payload);
    if (state.curApp && state.curApp.app === payload) {
        state.curApp = undefined;
    }

    return state;
});

export default axr(action,
    [
        startServAppSaga,
        loadServAppInfosSaga,
    ],
    {
        apps,
    }
);
