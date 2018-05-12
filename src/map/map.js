import * as THREE from 'three';
import LngLat from '@/geo/lngLat';
import { TileUtils, Tile } from '@/layer/tile';

export default class Map {

    // 缩放级别
    zoom = 12;

    // 宽度
    width = 0;

    // 高度
    height = 0;

    // 视角中心
    viewCenter = null;

    _tiles = [];

    options = {
        debug: true,
        // 背景颜色
        bgColor: 0x000000,
        // 雾化颜色
        fogColor: 0x2b2b2b,
        // 雾化比例点
        fogPercent: 0.015,
        // 相机可视角
        cameraFov: 70,
        // 相机最近照射点
        cameraNear: 5,
        // 相机最远照射点
        cameraFar: 6000,
        // 光源颜色
        lightColor: 0xffffff,
        // 地板plane颜色
        floorColor: 0x222222
    };

    constructor(ele) {
        if (!(ele instanceof HTMLElement)) {
            throw new Error('unkonw html element');
        }
        else {
            this.renderEle = ele;
        }

        this.init();
    }

    init() {
        this.getSize();

        this.initSceen();

        this.initCamera();

        this.initLight();

        this.initAxes();

        this.initFloor();

        this.initRenderer();

        this.render();

        this.resizeListner();
    }

    initSceen() {
        const { bgColor, fogColor, fogPercent } = this.options;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(bgColor);
        // this.scene.fog = new THREE.FogExp2(fogColor, fogPercent);
    }

    initCamera() {
        const { cameraFov, cameraNear, cameraFar } = this.options;
        const { clientWidth, clientHeight } = this;
        const { width, height } = this.getMapSize();

        this.camera = new THREE.PerspectiveCamera(cameraFov, clientWidth / clientHeight, cameraNear, cameraFar);
        this.camera.position.set(0, 260, 145);
        // this.camera.position.set(0, 300, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    initLight() {
        const { lightColor, floorColor } = this.options;
        const light = new THREE.HemisphereLight(lightColor, floorColor, 1);
        this.scene.add(light);
    }

    initAxes() {
        if (this.options.debug) {
            const { width } = this.getMapSize();
            const axesHelper = new THREE.AxesHelper(width);
            this.scene.add(axesHelper);
        }
    }

    initFloor() {
        const { floorColor } = this.options;
        const { width, height } = this.getMapSize();
        const floorGeometry = new THREE.BoxBufferGeometry(width, 0, height);
        const floorMaterial = new THREE.MeshBasicMaterial({
            color: floorColor,
            dithering: true
        });
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

        floorMesh.position.set(0, -2, 0);
        floorMesh.receiveShadow = true;
        floorMesh.name = 'floor';

        this.scene.add(floorMesh);
    }

    initRenderer() {
        const { clientWidth, clientHeight } = this;
        const { bgColor, mapWidth, mapHeight } = this.options;

        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(clientWidth, clientHeight);
        this.renderer.setClearColor(bgColor);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.renderEle.appendChild(this.renderer.domElement);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resizeListner() {
        window.addEventListener('resize', () => {
            this.getSize();
            this.camera.aspect = this.clientWidth / this.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.clientWidth, this.clientHeight);
            this.render();
        });
    }

    setOptions(options) {
        this.options = Object.assign({}, this.options, options);
    }

    getSize() {
        this.clientWidth = this.renderEle.offsetWidth;
        this.clientHeight = this.renderEle.clientHeight;

        return {
            width: this.clientWidth,
            height: this.clientHeight
        }
    }

    getMapSize() {
        const tileSize = TileUtils.getSize();

        // 不能小于6
        return {
            width: tileSize * 12,
            height: tileSize * 6
        }
    }

    getZoom() {
        return this.zoom;
    }

    setZoom(zoom) {
        this.zoom = zoom;
        this.update();
    }

    zoomIn() {

    }

    zoomOut() {

    }

    getContainer() {
        return this.renderEle;
    }

    getCenter() {
        return this.viewCenter;
    }

    setCenter(lng, lat) {
        if (lng instanceof LngLat) {
            this.viewCenter = lng;
        }
        else {
            this.viewCenter = new LngLat(lng, lat);
        }
        this.update();
    }


    update(lngLat) {
        lngLat = lngLat || this.getCenter();
        // 获取坐标
        const centerMercator = lngLat.toPoint();
        // 获取像素
        const centerPixel = centerMercator.toPixel(this.getZoom());
        // 获取瓦片偏移
        const tileOffset = TileUtils.getTileCenterOffset(centerPixel);
        // 获取中心瓦片坐标
        const tileCenterPoint = TileUtils.getTilePoint(centerPixel);
        const queue = TileUtils.getTileBounds(tileCenterPoint, this.getMapSize(), this.getZoom(), tileOffset);

        queue.forEach((tilePoint) => {
            let t = new Tile(tilePoint)
            t.createTile((tileMesh) => {
                this.scene.add(tileMesh);
                this.render();
            });
        });
    }
}
