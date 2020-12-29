import * as React from 'react';
import * as THREE from 'three';
import './Scene.scss';
import { SceneState } from '../../AXR/scene/scene';
import { ApplicationState } from '../../ApplicationState';
import { connect } from 'react-redux';

interface MapProps {
    scene: SceneState;
}

const mapStateToProps = (state: ApplicationState): MapProps => {
    return {
        scene: state.scene,
    }
}

interface Props extends MapProps {

}


class SceneImpl extends React.Component<Props> {
    protected elCanvas = React.createRef<HTMLCanvasElement>();
    protected scene: THREE.Scene;
    protected mesh: THREE.Mesh;
    protected renderer: THREE.WebGLRenderer;
    protected camera: THREE.PerspectiveCamera;

    componentDidMount() {
        this.initScene();
        this.updateScene();
    }

    componentDidUpdate() {
        this.updateScene();
    }

    render() {
        return (
            <div className="scene-root">
                <canvas className="scene-canvas" ref={this.elCanvas} />
            </div>
        );
    }

    initScene() {
        if (!this.elCanvas.current) {
            return;
        }
        const camera = new THREE.PerspectiveCamera( 70, 4 / 3, 1, 1000 );
        this.camera = camera;
        camera.position.z = 400;

        const scene = new THREE.Scene();
        this.scene = scene;

        const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/crate.gif' );

        const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
        const material = new THREE.MeshBasicMaterial( { map: texture } );

        const mesh = new THREE.Mesh( geometry, material );
        this.mesh = mesh;
        scene.add( mesh );

        const renderer = new THREE.WebGLRenderer( { 
            canvas: this.elCanvas.current,
            antialias: true,
            alpha: true,
        } );
        this.renderer = renderer;
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( 400, 300 );

        this.renderScene();
    }

    renderScene() {
        const render = () => {
            if (!this.renderer) {
                return;
            }
            this.renderer.render( this.scene, this.camera );

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    updateScene() {
        const scene = this.props.scene;
        this.mesh.rotation.x = scene.rotation.x;
        this.mesh.rotation.y = scene.rotation.y;
    }
}

export const Scene = connect(mapStateToProps)(SceneImpl);