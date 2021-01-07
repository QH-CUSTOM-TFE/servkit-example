import { SappSDKMockConfig } from 'servkit';
import { CommonService } from 'servkit-example-main-decl';
import { SceneService } from 'servkit-example-scene-decl';
import { CommonServiceImpl } from './service/CommonServiceImpl';
import { SceneServiceImpl } from './service/SceneServiceImpl';

export const mockConfig: SappSDKMockConfig = {
    resolveServiceServerConfig: async () => {
        return {
            service: {
                services: [
                    {
                        decl: CommonService,
                        impl: CommonServiceImpl
                    },
                    {
                        decl: SceneService,
                        impl: SceneServiceImpl
                    },
                ]
            }
        };
    }
};
