import './index.scss';
import { Application } from './Application';
import { sappSDK } from 'servkit';

sappSDK
.setConfig({
    onCreate: async () => {
        const app = new Application();
        app.init();
        app.run();
    },
    asyncLoadAppId: 'scene',
})
.start();