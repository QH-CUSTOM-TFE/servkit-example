import * as React from 'react';
import './Component.scss';

import Layout from 'antd/lib/layout';
import 'antd/lib/layout/style/css';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Divider from 'antd/lib/divider';
import 'antd/lib/divider/style/css';

const { Header, Footer, Sider, Content } = Layout;

import { SappInfo } from 'servkit';
import { connect } from 'react-redux';
import { ApplicationState } from './ApplicationState';
import axr from './AXR';
import { ServAppState } from './AXR/app';
import { App } from './component/app/App';
import { sappMGR, ESappType } from 'servkit';
import { app } from './Application';

interface MapProps {
    apps: ServAppState[];
    infos: SappInfo[];
    curApp: ServAppState;
}

const mapStateToProps = (state: ApplicationState): MapProps => {
    return {
        infos: state.apps.infos,
        apps: state.apps.apps,
        curApp: state.apps.curApp,
    }
}

interface Props extends MapProps {
    
}

class ComponentImpl extends React.Component<Props> {
    protected elScene = React.createRef<HTMLDivElement>();

    componentDidMount() {
        app().sceneContainerDeferred.resolve(this.elScene);
    }

    public render() {
        return (
            <Layout className="root">
                <Content className="content">
                    <Header className="content-header">主应用</Header>
                    {this.renderScene()}
                    {this.renderAppStore()}
                    {this.renderAppDetail()}
                </Content>
                {this.renderApps()}
            </Layout>
        )
    }

    renderScene() {
        return (
            <Content className="group-content scene-content">
                <Divider orientation="left">场景</Divider>
                <div ref={this.elScene}></div>
            </Content>
        );
    }

    renderAppStore() {
        const apps = this.props.infos;
        return (
            <Content className="group-content store-content">
                <Divider orientation="left">应用商店</Divider>
                <div className="store-content-app-list">
                {
                    apps.map((item) => {
                        return (
                            <Button key={item.id} onClick={() => this.onClickApp(item) }>
                                {item.name}
                            </Button>
                        )
                    })
                }
                </div>
            </Content>
        );
    }

    renderAppDetail() {
        const app = this.props.curApp;
        if (!app) {
            return null;
        }

        const info = app.app.info;

        return (
            <Content className="group-content detail-content">
                <Divider orientation="left">应用 {info.name}</Divider>
            </Content>
        );
    }

    renderApps() {
        const apps = this.props.apps;
        if (apps.length === 0) {
            return null;
        }
        
        return (
            <Sider theme="light" width="400px" className="side-container">
                {
                    apps.map((item) => {
                        return (
                            <App key={item.id} data={item}/>
                        );
                    })
                }
           </Sider>
        );
    }

    onClickApp(info: SappInfo) {
        axr.action.startServApp.started.dispatch(info.id)
    }
};

export const Component = connect(mapStateToProps)(ComponentImpl);
