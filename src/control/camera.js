import * as THREE from 'three';

export default class CamerControl {

    isContextMenu = false;

    isMouseDown = false;

    rotateStart = new THREE.Vector2();

    rotateEnd = new THREE.Vector2();

    rotateDelta = new THREE.Vector2();

    sphericalDelta = new THREE.Spherical();

    spherical = new THREE.Spherical();

    rotateSpeed = 1.0;

    minAzimuthAngle = -Infinity;

    maxAzimuthAngle = Infinity;

    offset = new THREE.Vector3();

    constructor(mapInstance) {
        this.mapInstance = mapInstance;

        this.quat = new THREE.Quaternion().setFromUnitVectors(this.mapInstance.camera.up, new THREE.Vector3(0, 1, 0));
        this.quatInverse = this.quat.clone().inverse();
        this.bindEvent();
    }

    destory() {
        this.mapInstance.renderEle.removeEventListener('contextmenu', this.onContextMenu);
        this.mapInstance.renderEle.removeEventListener('mousedown', this.onMouseDown);
        this.mapInstance.renderEle.removeEventListener('mousemove', this.onMouseMove);
		this.mapInstance.renderEle.removeEventListener('mouseup', this.onMouseUp);
    }

    bindEvent() {
        this.mapInstance.renderEle.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
    	this.mapInstance.renderEle.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        this.mapInstance.renderEle.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		this.mapInstance.renderEle.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }

    onContextMenu() {
        this.isContextMenu = true;
    }

    onMouseDown(e) {
        this.rotateStart.set(e.clientX, e.clientY);
        this.isMouseDown = true;
    }

    onMouseMove(e) {
        if (!this.isMouseDown || this.isContextMenu) {
            return ;
        }

        const { rotateEnd, rotateStart, rotateDelta, rotateSpeed } = this;

        rotateEnd.set(e.clientX, e.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        this.rotateLeft(2 * Math.PI * rotateDelta.x / this.mapInstance.clientWidth * rotateSpeed);
        this.rotateUp( 2 * Math.PI * rotateDelta.y / this.mapInstance.clientHeight * rotateSpeed );

        rotateStart.copy(rotateEnd);

        this.update();
    }

    onMouseUp() {
        this.isMouseDown = false;
        this.isContextMenu = false;
    }

    rotateLeft(angle) {
        this.sphericalDelta.theta -= angle;
    }

    rotateUp(angle) {
        this.sphericalDelta.phi -= angle;
    }

    update() {
        const position = this.mapInstance.camera.position;
        const { offset, quat, quatInverse, spherical, sphericalDelta } = this;

        offset.copy(position).sub(this.mapInstance.cameraTarget);

        offset.applyQuaternion(quat);

        spherical.setFromVector3(offset);
        spherical.theta += sphericalDelta.theta;
        spherical.phi += sphericalDelta.phi;
        spherical.makeSafe();

        offset.setFromSpherical(spherical);
        offset.applyQuaternion(quatInverse);

        position.copy(this.mapInstance.cameraTarget).add(offset);

        if (position.y <= 0) {
            position.y = 5;
        }

        this.mapInstance.camera.lookAt(this.mapInstance.cameraTarget);
        this.mapInstance.render();

        sphericalDelta.set(0, 0, 0);
    }
};
