import * as THREE from 'three';
import Stats from 'stats.js';
import { LngLat } from '@/geo';
import { Pixel } from '@/geometry';
import { TileUtils, Tile } from '@/layer/tile';
import { CameraControl, ViewportControl } from '@/control';
import { Cylinder } from '@/layer/cylinder';


export default class Map {

    // 缩放级别
    zoom = 11;

    minZoom = 3;

    maxZoom = 18;

    zoomTransition = false;

    // 视角中心
    viewCenter = null;

    tiles = [];

    sceneObjs = [];

    offset = new Pixel(0, 0, 0);

    cameraTarget = new THREE.Vector3(0, 0, 0);

    options = {
        debug: false,
        // 背景颜色
        bgColor: 0x000000,
        // 雾化颜色
        fogColor: 0x2b2b2b,
        // 雾化比例点
        fogPercent: 0.00145,
        // 相机可视角
        cameraFov: 70,
        // 相机最近照射点
        cameraNear: 5,
        // 相机最远照射点
        cameraFar: 6000,
        // 光源颜色
        lightColor: 0xffffff,
        // 地板颜色
        floorColor: 0x666666,
        // 缩放动画
        zoomAnimation: true
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

        this.initDebugHelper();

        this.initRenderer();

        this.initCameraControl();

        this.initViewportControl();

        this.initFloor();

        this.render();

        this.resizeListner();
    }

    initSceen() {
        const { bgColor, fogColor, fogPercent } = this.options;
        const { width, height } = this.getMapSize();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(bgColor);
        this.scene.fog = new THREE.FogExp2(fogColor, fogPercent);

        new THREE.TextureLoader().load('./texture/sky.png', (texture) => {
            const skyGeometry = new THREE.CubeGeometry(width, width, height);
            const skyMaterial =new THREE.MeshBasicMaterial({
                dithering: true,
                transparent: true,
                side: THREE.BackSide,
                map: texture
            });

            const skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
            this.scene.add(skyBox);
        });
    }

    initCamera() {
        const { cameraFov, cameraNear, cameraFar } = this.options;
        const { clientWidth, clientHeight } = this;
        const { width, height } = this.getMapSize();

        this.camera = new THREE.PerspectiveCamera(cameraFov, clientWidth / clientHeight, cameraNear, cameraFar);
        // this.camera.position.set(140, 260, 140);
        this.camera.position.set(0, 300, 300);
        this.camera.lookAt(this.cameraTarget);
    }

    initLight() {
        const { lightColor, floorColor } = this.options;
        const light = new THREE.HemisphereLight(lightColor, floorColor, 1);
        this.scene.add(light);

        const pointLight = new THREE.PointLight(lightColor, 1, 1000);
        pointLight.position.set(100, 100, 300);
        this.scene.add(pointLight);
    }

    initDebugHelper() {
        if (!this.options.debug) {
            return ;
        }

        const { width } = this.getMapSize();
        const axesHelper = new THREE.AxesHelper(width);
        this.scene.add(axesHelper);

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
    	this.stats.domElement.style.bottom = '0px';
    	this.stats.domElement.style.zIndex = 100;
    	this.renderEle.appendChild(this.stats.domElement);
    }

    initFloor() {
        const { floorColor } = this.options;
        const { width, height } = this.getMapSize();
        const floorGeometry = new THREE.BoxBufferGeometry(width, 0, height);
        const floorMaterial = new THREE.MeshBasicMaterial({
            color: floorColor,
            side: THREE.DoubleSide
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
            preserveDrawingBuffer: true,
            antialias: true
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

    initCameraControl() {
        let control = new CameraControl(this);
    }

    initViewportControl() {
        let control = new ViewportControl(this);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        if (this.options.debug) {
            this.stats.update();
        }
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
            width: tileSize * 8,
            height: tileSize * 8
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
        if (this.zoom <= this.minZoom) {
            return ;
        }

        if (this.options.zoomAnimation) {
            this.zoomTransition = true;
        }

        this.zoom -= 1;
        this.update();
    }

    zoomOut() {
        if (this.zoom >= this.maxZoom) {
            return ;
        }

        if (this.options.zoomAnimation) {
            this.zoomTransition = true;
        }

        this.zoom += 1;
        this.update();
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
        const tileCenterPixel = TileUtils.getTilePoint(centerPixel);
        const mapSize = this.getMapSize();
        const queue = TileUtils.getTileQueue(tileCenterPixel, mapSize, this.getZoom(), tileOffset);
        const _tiles = [];

        this.offset = centerPixel;

        TileUtils.clearTransition(true);

        queue.forEach((tilePoint) => {
            let resaveIndex = -1;
            let hasTitle = false;

            this.tiles.every((tileInstance, index) => {
                if (tileInstance.coords.x === tilePoint.x
                    && tileInstance.coords.y === tilePoint.y
                    && tileInstance.coords.z === tilePoint.z
                ) {
                    _tiles.push(tileInstance);
                    resaveIndex = index;
                    hasTitle = true;
                    tileInstance.update(tilePoint);
                    return false;
                }
                return true;
            });

            if (resaveIndex > -1) {
                this.tiles.splice(resaveIndex, 1);
            }

            if (!hasTitle) {
                let tileInstance = new Tile(tilePoint);
                _tiles.push(tileInstance);
                tileInstance.createTile((tileMesh) => {
                    this.scene.add(tileMesh);
                    TileUtils.transition(tileMesh, this.render.bind(this));
                });
            }
        });

        this.sceneObjs.forEach((obj) => {
            obj.update();
        });

        this.tiles.forEach((tileInstance) => {
            this.scene.remove(tileInstance.getTile());
            tileInstance.destroy();
        });

        this.tiles = _tiles;
        this.zoomTransition = false;
        this.render();
    }

    toMapVector3(pixel) {
        return new THREE.Vector3(pixel.x - this.offset.x, 0, this.offset.y - pixel.y);
    }

    addCylinder(data) {
        const cylinderInstance = new Cylinder(data, this);
        cylinderInstance.render();
        this.sceneObjs.push(cylinderInstance);
    }
}
