import * as THREE from 'three';

export default class Cylinder {

    baseWidth = 2;

    geometryType = 2;

    objects = [];

    objects = [];

    width = 4;

    constructor(options, mapInstance) {
        this.options = options;
        this.mapInstance = mapInstance;
    }

    setType(type) {
        this.geometryType = type;
    }

    setWidth(width) {
        this.width = width;
    }

    render() {
        const { mapInstance, options, geometryType } = this;
        const vector = mapInstance.toMapVector3(options.lnglat.toPixel(mapInstance.zoom));
        let countVaule = 0;
        let width = options.width || this.width;

        options.data.forEach((item) => {
            countVaule += item.value;
        });

        options.data.forEach((item, key) => {
            options.data[key].precent = item.value / countVaule;
        });

        let preHeightCount = 0;

        options.data.forEach((item, index) => {
            let _height = Math.floor(options.height * item.precent);
            let geometry = null;

            if (geometryType === 1) {
                geometry = new THREE.CylinderBufferGeometry(width, width, _height, width * 5);
            }
            else {
                geometry = new THREE.BoxBufferGeometry(width, _height, width, width * 5);
            }

            const material = new THREE.MeshPhongMaterial({
                color: item.color,
                specular: 0x7777ff,
                shininess: 30
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(vector.x, preHeightCount + _height / 2, vector.z);
            preHeightCount += _height;

            this.objects.push(cylinder);
            mapInstance.scene.add(cylinder);
            mapInstance.render();
        });
    }

    update() {
        const { mapInstance, options } = this;
        const vector = mapInstance.toMapVector3(options.lnglat.toPixel(mapInstance.zoom));

        this.objects.forEach((obj) => {
            obj.position.set(vector.x, obj.position.y, vector.z);
        });
    }

    hover() {

    }
}
