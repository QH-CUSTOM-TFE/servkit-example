import { SceneService, Rotation } from 'servkit-example-scene-decl';
import { anno, ServAPIArgs } from 'servkit';
import axr from '../AXR';

@anno.impl()
export class SceneServiceImpl extends SceneService {
    async startAutoRotaion() {
        axr.action.startAutoRotation.started.dispatch();
    }

    async stopAutoRotaion() {
        axr.action.stopAutoRotation.started.dispatch();
    }

    async updateRotaion(args: ServAPIArgs<Rotation>) {
        axr.action.updateRotation.dispatch(args);
    }
}