import './index.scss';
import { Application, app } from './Application';
import { SappSDK } from 'servkit';

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
            }
        }).start();
    }
});