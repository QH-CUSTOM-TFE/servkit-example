import './index.scss';
import { Application } from './Application';
import { sappSDK, ESappSDKLifeCycleEvent } from 'servkit';
import { CommonService } from 'servkit-example-main-decl';
import { mockConfig } from './mock/sdkmock';

sappSDK
.setConfig({
    useTerminalId: 'com.servkit.example.serv',
    mock: mockConfig,
})
.on(ESappSDKLifeCycleEvent.BEFORE_START, async () => {
    console.log('小程序生命周期 beforeStart');
})
.on(ESappSDKLifeCycleEvent.ON_CREATE, async () => {
    const app = new Application();
    app.init();
    app.run();

    console.log('小程序生命周期 onCreate');
    const service = await sappSDK.service(CommonService);
    service.message('调用小程序生命周期 onCreate');
})
.on(ESappSDKLifeCycleEvent.ON_SHOW, async () => {
    console.log('小程序生命周期 onShow');
    const service = await sappSDK.service(CommonService);
    service.message('调用小程序生命周期 onShow');
})
.on(ESappSDKLifeCycleEvent.ON_HIDE, async () => {
    console.log('小程序生命周期 onHide');
    const service = await sappSDK.service(CommonService);
    service.message('调用小程序生命周期 onHide');
})
.on(ESappSDKLifeCycleEvent.ON_CLOSE, async () => {
    console.log('小程序生命周期 onClose');
    const service = await sappSDK.service(CommonService);
    service.message('调用小程序生命周期 onClose');
})
.on(ESappSDKLifeCycleEvent.AFTER_START, async () => {
    console.log('小程序生命周期 afterStart');
})
.start();

