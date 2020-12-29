import { SceneService, Rotation } from 'servkit-example-scene-decl';
import { anno, ServAPIArgs } from 'servkit';

@anno.impl()
export class SceneServiceImpl extends SceneService {
    async startAutoRotaion() {
        //
    }

    async stopAutoRotaion() {
        //
    }

    async updateRotaion(args: ServAPIArgs<Rotation>) {
        //
    }
}