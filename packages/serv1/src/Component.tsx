import * as React from 'react';
import './Component.scss';

import Layout from 'antd/lib/layout';
import 'antd/lib/layout/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Divider from 'antd/lib/divider';
import 'antd/lib/divider/style/css';

import { sappSDK } from 'servkit';
import { CommonService } from 'servkit-example-main-decl';
import { SceneService, Rotation } from 'servkit-example-scene-decl';

export class Component extends React.Component<{}> {
    public render() {
        return (
            <Layout className="root">
                { this.renderOpertions() }
            </Layout>
        )
    }

    renderOpertions() {
        const state = this.state;
        return (
            <div className="group-content">
                <Divider orientation="left">通知操作</Divider>
                <Button onClick={this.onClickMessage}>Message</Button>
                <Button onClick={this.onClickConfirm}>Confirm</Button>
                <Divider orientation="left">跳转</Divider>
                <div><a href="serv0.html">跳转到主页面</a></div>
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
            service.confirm('Hello Servkit').then((yes) => {
                if (yes) {
                    service.message('Yes clicked');
                } else {
                    service.message('No clicked');
                }
            });
        });
    }
};
