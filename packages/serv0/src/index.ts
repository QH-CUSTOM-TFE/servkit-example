import './index.scss';
import { Application } from './Application';
import { sappSDK } from 'servkit';
import { CommonService } from 'servkit-example-main-decl';
import { SceneService } from '../../main-decl/src/SceneService';

sappSDK
.setConfig({
    onCreate: async () => {
        const app = new Application();
        app.init();
        app.run();

        console.log('小程序生命周期 onCreate');
        const service = await sappSDK.service(CommonService);
        service.message('调用小程序生命周期 onCreate');
    },
    onShow: async () => {
        console.log('小程序生命周期 onShow');
        const service = await sappSDK.service(CommonService);
        service.message('调用小程序生命周期 onShow');
    },
    onHide: async () => {
        console.log('小程序生命周期 onHide');
        const service = await sappSDK.service(CommonService);
        service.message('调用小程序生命周期 onHide');
    },
    onClose: async () => {
        console.log('小程序生命周期 onClose');
        const services = await sappSDK.service({ scene: SceneService, common: CommonService });
        await services.scene.updateRotaion({ x: 0.5, y: 0.5, z: 0 });
        await services.scene.stopAutoRotaion();
        await services.common.message('调用小程序生命周期 onClose; 重置模型的旋转数据');
    }
})
.start();

