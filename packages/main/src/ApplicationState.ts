import { AppsState } from './AXR/app';
import { SceneState } from './AXR/scene/scene';

export interface ApplicationState {
    apps: AppsState;
    scene: SceneState;
}