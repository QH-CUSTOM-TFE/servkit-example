import * as React from 'react';
import './App.scss';


import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import { ServAppState } from '../../AXR/app';

interface Props {
    data: ServAppState;
}

interface State {
    showButton: boolean;
    hideButton: boolean;
}

export class App extends React.Component<Props, State> {
    private elContent = React.createRef<HTMLDivElement>();
    state = {
        showButton: false,
        hideButton: false,
    }

    render() {
        return (
            <div className="app-container">
                <div className="app-container-header">
                    { this.props.data.app.info.name }
                    <div className="app-container-header-operations">
                        { this.state.showButton && <Icon type="plus-circle" onClick={() => this.onClickShow()} /> }
                        { this.state.hideButton && <Icon type="minus-circle" onClick={() => this.onClickHide()} /> }
                        <Icon type="close-circle" onClick={() => this.onClickClose()} />
                    </div>
                </div>
                <div className="app-container-content" ref={this.elContent}>
                </div>
            </div>
        )
    }

    componentDidMount() {
        if (!this.elContent.current) {
            this.props.data.app.close();
        } else {
            this.props.data.app.getController().setLayoutOptions({
                container: this.elContent.current,
                className: 'app-container-content-iframe',
            })
            this.props.data.app.start().then(() => {
                this.setState({
                    showButton: false,
                    hideButton: true,
                })
            });
        }
    }

    onClickShow() {
        this.props.data.app.show().then(() => {
            this.setState({
                showButton: false,
                hideButton: true,
            })
        });
    }

    onClickHide() {
        this.props.data.app.hide().then(() => {
            this.setState({
                showButton: true,
                hideButton: false,
            })
        });
    }

    onClickClose() {
        this.props.data.app.close();
    }
};
