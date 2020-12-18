import * as React from 'react';
import './Component.scss';

import Layout from 'antd/lib/layout';
import 'antd/lib/layout/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Divider from 'antd/lib/divider';
import 'antd/lib/divider/style/css';
import InputNumber from 'antd/lib/input-number';
import 'antd/lib/input-number/style/css';

import { connect } from 'react-redux';
import { sappSDK } from 'servkit';
import { CommonService, SceneService, Rotation } from 'servkit-example-main-decl';


interface State {
    rotation: Rotation;
    unlisten?: (() => void);
}

export class Component extends React.Component<{}> {
    state: State = {
        rotation: { x: 0, y: 0, z: 0 },
    }

    public render() {
        return (
            <Layout className="root">
                { this.renderOpertions() }
            </Layout>
        )
    }

    renderOpertions() {
        const state = this.state;
        const rotation = state.rotation;
        return (
            <div className="group-content">
                <Divider orientation="left">通知操作</Divider>
                <Button onClick={this.onClickMessage}>Message</Button>
                <Button onClick={this.onClickConfirm}>Confirm</Button>
                <Divider orientation="left">自动旋转</Divider>
                <Button onClick={this.onClickStartAutoRotaion}>开启</Button>
                <Button onClick={this.onClickStopAutoRotation}>关闭</Button>
                { !state.unlisten && <Button onClick={this.onClickListenAutoRotation}>监听变化</Button> }
                { !!state.unlisten && <Button onClick={this.onClickUnlistenAutoRotation}>取消监听</Button> }
                <Divider orientation="left">旋转数据</Divider>
                <div className="group-data-row">X<InputNumber value={rotation.x} min={0} max={360} step={1} onChange={this.onXChange}></InputNumber></div>
                <div className="group-data-row">Y<InputNumber value={rotation.y} min={0} max={360} step={1} onChange={this.onYChange}></InputNumber></div>
                <div className="group-data-row">Z<InputNumber value={rotation.z} min={0} max={360} step={1} onChange={this.onZChange}></InputNumber></div>
                <Button disabled={!!state.unlisten} onClick={this.onClickUpdate}>更新</Button>
            </div>
        )
    }

    onClickMessage = () => {
        sappSDK.service(CommonService).then((service) => {
            service.message('Hello Servkit');
        });
    }

    onClickConfirm = () => {
        sappSDK.service(CommonService).then((service) => {
            service.confirm('Hello Servkit').then(() => {
                service.message('Yes clicked');
            }, () => {
                service.message('No clicked');
            });
        });
    }

    onClickListenAutoRotation = () => {
        sappSDK.service(SceneService).then((service) => {
            const unlisten = service.onAutoRotation.on((rotation) => {
                this.setState({
                    rotation: {
                        x: rotation.x / Math.PI * 180,
                        y: rotation.y / Math.PI * 180,
                        z: rotation.z / Math.PI * 180,
                    },
                });
            });

            this.setState({
                unlisten,
            });
        });
    }

    onClickUnlistenAutoRotation = () => {
        if (this.state.unlisten) {
            this.state.unlisten();
            this.setState({
                unlisten: undefined,
            });
        }
    }

    onClickStartAutoRotaion = () => {
        sappSDK.service(SceneService).then((service) => {
            service.startAutoRotaion();
        }); 
    }

    onClickStopAutoRotation = () => {
        sappSDK.service({ scene: SceneService, common: CommonService }).then((services) => {
            services.common.confirm('确定关闭自动旋转').then(() => {
                services.scene.stopAutoRotaion();
            });
        }); 
    }

    onXChange = (x: number) => {
        this.setState({
            rotation: {...this.state.rotation, x},
        });
    }

    onYChange = (y: number) => {
        this.setState({
            rotation: {...this.state.rotation, y},
        });
    }

    onZChange = (z: number) => {
        this.setState({
            rotation: {...this.state.rotation, z},
        });
    }

    onClickUpdate = () => {
        const rotation = { ...this.state.rotation };
        rotation.x = rotation.x / 180 * Math.PI;
        rotation.y = rotation.y / 180 * Math.PI;
        rotation.z = rotation.z / 180 * Math.PI;

        sappSDK.service(SceneService).then((service) => {
            service.updateRotaion(rotation);
        });
    }
};
