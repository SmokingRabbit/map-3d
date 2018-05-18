import * as THREE from 'three';
import TileUtils from './tileUtils';

export default class Tile {

    url = 'http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20180512&scale=2&ak=E4805d16520de693a3fe707cdc962045&customid=dark'
    // url = 'http://online2.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler={scaler}&udt=20180512';
    // url = 'http://api2.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20180512&scale={scale}&ak=E4805d16520de693a3fe707cdc962045&customid=grayscale';

    tile = null;

    coords = null;

    isDestory = false;

    constructor(coords) {
        this.setCoords(coords);
    }

    setUrl(url) {
        this.url = url;
    }

    getTile() {
        return this.tile;
    }

    getCoords() {
        return this.coords;
    }

    setCoords(coords) {
        this.coords = coords;
    }

    destroy() {
        this.isDestory = true;
    }

    createTile(done) {
        const url = this.getTilUrl(this.url, this.coords);
        const loader = new THREE.TextureLoader();
        const tileSize = TileUtils.getSize();
        const { _x, _y, _z } = this.coords;

        const tileGeometry = new THREE.BoxBufferGeometry(tileSize, 0, tileSize);
        const tileMaterial = new THREE.MeshBasicMaterial({
            dithering: true,
            side: THREE.FrontSide,
            transparent: true,
            opacity: 0,
            color: 0xffffff
        });

        const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
        tileMesh.receiveShadow = true;
        tileMesh.receiveShadow = true;
        tileMesh.position.set(_x, _y, _z);
        this.tile = tileMesh;

        loader.load(url, (texture) => {
            if (this.isDestory) {
                return ;
            }
            this.tile.material.map = texture;

            if (typeof done === 'function') {
                done(tileMesh);
            }
        });
    }

    update(coords, scale = 1) {
        this.setCoords(coords);
        const { _x, _y, _z } = coords;

        this.tile.position.set(_x * scale, _y, _z * scale);
        this.tile.material.opacity = 1;
        this.tile.scale.set(scale, 1, scale);
    }

    getTilUrl(str, data) {
        data = Object.assign(data, {
            scale: window.devicePixelRatio,
            scaler: window.devicePixelRatio
        });

        return str.replace(/\{ *([\w_-]+) *\}/g, function (str, key) {
    		var value = data[key];

    		if (value === undefined) {
    			throw new Error('No value provided for variable ' + str);

    		} else if (typeof value === 'function') {
    			value = value(data);
    		}
    		return value;
    	});
    }
}
