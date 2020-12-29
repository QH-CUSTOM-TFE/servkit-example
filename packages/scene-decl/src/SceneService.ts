import { ServService, ServEventer, anno, ServAPIArgs, ServAPIRetn, API_UNSUPPORT } from 'servkit';

export interface Rotation {
    x: number;
    y: number;
    z: number;
}

@anno.decl({
    id: 'main.service.scene',
    version: '1.0.0',
})
export class SceneService extends ServService {
    @anno.decl.event()
    onAutoRotation: ServEventer<Rotation>;

    @anno.decl.notify()
    startAutoRotaion(): ServAPIRetn {
        return API_UNSUPPORT();
    }

    @anno.decl.api()
    stopAutoRotaion(): ServAPIRetn {
        return API_UNSUPPORT();
    }

    @anno.decl.api()
    updateRotaion(args: ServAPIArgs<Rotation>): ServAPIRetn {
        return API_UNSUPPORT();
    }
}