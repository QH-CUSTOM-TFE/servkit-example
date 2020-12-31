import './index.scss';
import { Application, app } from './Application';
import { SappSDK } from 'servkit';
import { mockConfig } from './mock/sdkmock';

SappSDK.declAsyncLoad('scene',{
    bootstrap: (sdk) => {
        sdk.setConfig({
            onCreate: async () => {
                const a = new Application(sdk);
                a.init();
                a.run();
            },
            onClose: async () => {
                app().exit();
            },
            mock: mockConfig
        }).start();
    }
});