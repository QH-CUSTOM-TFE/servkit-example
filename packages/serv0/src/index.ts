import './index.scss';
import { Application } from './Application';
import { sappSDK } from 'servkit';
import { CommonService } from 'servkit-example-main-decl';
import { SceneService } from 'servkit-example-scene-decl';
import { mockConfig } from './mock/sdkmock';

sappSDK
.setConfig({
    useTerminalId: 'com.servkit.example.serv',
    onCreate: async () => {
        const app = new Application();
        app.init();
        app.run();

        console.log('小程序生命周期 onCreate');
        const service = await sappSDK.service(CommonService);
        service.message('调用小程序生命周期 onCreate');
    },
    onShow: async (sdk, params) => {
        console.log('小程序生命周期 onShow');
        const service = await sappSDK.service(CommonService);
        service.message('调用小程序生命周期 onShow');

        if (!params.force) {
            const yes = await service.confirm('确认显示小程序?');
            return {
                dontShow: !yes,
            };
        }
    },
    onHide: async (sdk, params) => {
        console.log('小程序生命周期 onHide');
        const service = await sappSDK.service(CommonService);
        service.message('调用小程序生命周期 onHide');

        if (!params.force) {
            const yes = await service.confirm('确认隐藏小程序?');
            return {
                dontHide: !yes,
            };
        }
    },
    onClose: async () => {
        console.log('小程序生命周期 onClose');
        const services = await sappSDK.service({ scene: SceneService, common: CommonService });
        const yes = await services.common.confirm('确认关闭小程序?');
        if (!yes) {
            return {
                dontClose: !yes,
            };
        }
        
        await services.scene.updateRotaion({ x: 0.5, y: 0.5, z: 0 });
        await services.scene.stopAutoRotaion();
        await services.common.message('调用小程序生命周期 onClose; 重置模型的旋转数据');
    },
    mock: mockConfig,
})
.start();

