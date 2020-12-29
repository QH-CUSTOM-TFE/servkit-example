import { actionCreator, reducersCreator, sagaCreator, axr } from "../setup";
import { sappMGR } from 'servkit';
import { SceneService } from "servkit-example-scene-decl";
import { throttle } from 'lodash';


export interface Rotation {
    x: number;
    y: number;
    z: number;
}

export interface SceneState {
    rotation: Rotation;
    autoRotate: boolean;
}

const emitAutoRotation = throttle((rotation: Rotation) => {
    const service = sappMGR.getServiceUnsafe(SceneService);
    service.onAutoRotation.emit(rotation);
}, 500)


const updateRotation = actionCreator<Rotation>('updateRotation');

const startAutoRotation = actionCreator.async('startAutoRotation');
const startAutoRotationSaga = sagaCreator.every(startAutoRotation.started, function*(payload, getState) {
    const state = getState();
    if (state.scene.autoRotate) {
        return;
    }

    const animate = () => {
        const state = getState();
        if (!state.scene.autoRotate) {
            return;
        }
        const rotation = { ...state.scene.rotation };
        rotation.x += 0.005;
        rotation.y += 0.01;
        updateRotation.dispatch(rotation);

        emitAutoRotation(rotation);

        requestAnimationFrame(animate);
    };

    startAutoRotation.done.dispatch({
        params: undefined,
        result: undefined,
    });

    animate();
});

const stopAutoRotation = actionCreator.async('stopAutoRotation');
const stopAutoRotationSaga = sagaCreator.every(stopAutoRotation.started, function*() {
    stopAutoRotation.done.dispatch({
        params: undefined,
        result: undefined,
    });
});

export const action = {
    updateRotation,
    startAutoRotation,
    stopAutoRotation,
};

const scene = reducersCreator<SceneState>({
    rotation: { x: 0.5, y: 0.5, z: 0 },
    autoRotate: false,
})
.case(updateRotation, (state, payload) => {
    state = {
        ...state,
    }

    state.rotation = payload;
    
    return state;
})
.case(startAutoRotation.done, (state, payload) => {
    state = {
        ...state,
    }
    state.autoRotate = true;
    
    return state;
})
.case(stopAutoRotation.done, (state, payload) => {
    state = {
        ...state,
    }

    state.autoRotate = false;

    return state;
});

export default axr(action,
    [
        startAutoRotationSaga,
        stopAutoRotationSaga,
    ],
    {
        scene,
    }
);
