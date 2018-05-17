import * as THREE from 'three';
import { Pixel } from '@/geometry';

export default class Viewport {

    isContextMenu = false;

    maxZoom = 18;

    minZoom = 3;

    panStart = new THREE.Vector2();

    panEnd = new THREE.Vector2();


    constructor(mapInstance) {
        this.mapInstance = mapInstance;

        this.bindEvent();
    }

    destory() {
        this.mapInstance.renderEle.removeEventListener('contextmenu', this.onContextMenu);
    	this.mapInstance.renderEle.removeEventListener('wheel', this.onMouseWheel);
        this.mapInstance.renderEle.removeEventListener('mousemove', this.onMouseMove);
		this.mapInstance.renderEle.removeEventListener('mouseup', this.onMouseUp);
    }

    bindEvent() {
    	this.mapInstance.renderEle.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
    	this.mapInstance.renderEle.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        this.mapInstance.renderEle.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		this.mapInstance.renderEle.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }

    onContextMenu(e) {
        this.isContextMenu = true;
        this.panStart.set(e.clientX, e.clientY);
        e.preventDefault();
    }

    onMouseWheel(e) {
        if (e.deltaY > 0) {
            this.mapInstance.zoomIn();
        }
        else {
            this.mapInstance.zoomOut();
        }
    }

    onMouseMove(e) {
        if (!this.isContextMenu) {
            return ;
        }

        const { panStart, panEnd } = this;

        panEnd.set(e.clientX, e.clientY);

        this.update();

        panStart.copy(panEnd);
    }

    onMouseUp() {
        this.isContextMenu = false;
        this.panStart.set(0, 0);
        this.panEnd.set(0, 0);
    }

    update() {
        const position = this.mapInstance.camera.position;
        const { panStart, panEnd } = this;
        const { offset, setCenter } = this.mapInstance;
        let distance = new THREE.Vector2(panEnd.x - panStart.x, panStart.y - panEnd.y);

        let sin = position.z / Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.z, 2));
        let minus = sin < 0 ? -1 : 1;

        const centerPixel = new Pixel(
            offset.x - distance.x * minus,
            offset.y - distance.y * minus,
            offset.z
        );

        this.mapInstance.setCenter(centerPixel.toLngLat(this.mapInstance.zoom));
    }
}
