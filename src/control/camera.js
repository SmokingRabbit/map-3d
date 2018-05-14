import * as THREE from 'three';

export default class CamerControl {

    isMouseDown = false;

    isContextMenu = false;

    rotateStart = new THREE.Vector2();

    rotateEnd = new THREE.Vector2();

    rotateDelta = new THREE.Vector2();

    sphericalDelta = new THREE.Spherical();

    spherical = new THREE.Spherical();

    rotateSpeed = 1.0;

    scale = 1;

    minAzimuthAngle = -Infinity;

    maxAzimuthAngle = Infinity;

    offset = new THREE.Vector3();

    constructor(mapInstance) {
        this.mapInstance = mapInstance;


        this.quat = new THREE.Quaternion().setFromUnitVectors(this.mapInstance.camera.up, new THREE.Vector3(0, 1, 0));
        this.quatInverse = this.quat.clone().inverse();
        this.bindEvent();
    }

    bindEvent() {
        this.mapInstance.renderEle.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
    	this.mapInstance.renderEle.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    	this.mapInstance.renderEle.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        this.mapInstance.renderEle.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		this.mapInstance.renderEle.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }

    onContextMenu(e) {
        this.isContextMenu = true;
        e.preventDefault();
    }

    onMouseDown(e) {
        this.rotateStart.set(e.clientX, e.clientY);
        this.isMouseDown = true;
    }

    onMouseWheel(e) {

    }

    onMouseMove(e) {
        if (!this.isMouseDown) {
            return false;
        }

        if (this.isContextMenu) {
            return ;
        }

        const { rotateEnd, rotateStart, rotateDelta, rotateSpeed } = this;

        rotateEnd.set(e.clientX, e.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        this.rotateLeft(2 * Math.PI * rotateDelta.x / this.mapInstance.clientWidth * rotateSpeed);

        rotateStart.copy(rotateEnd);

        this.update();
    }

    onMouseUp() {
        this.isContextMenu = false;
        this.isMouseDown = false;
    }

    rotateLeft(angle) {
        this.sphericalDelta.theta -= angle;
    }

    update() {
        let position = this.mapInstance.camera.position;
        const { offset, quat, quatInverse, spherical, sphericalDelta } = this;

        offset.copy(position).sub(this.target);
        offset.applyQuaternion(quat);

        spherical.setFromVector3(offset);
        spherical.theta += sphericalDelta.theta;
        spherical.phi += sphericalDelta.phi;
        spherical.makeSafe();
        spherical.radius *= this.scale;

        offset.setFromSpherical(spherical);
        offset.applyQuaternion(quatInverse);

        position.copy(this.target).add(offset);

        this.mapInstance.camera.lookAt(this.target);
        this.mapInstance.render();

        sphericalDelta.set(0, 0, 0);
    }
};
