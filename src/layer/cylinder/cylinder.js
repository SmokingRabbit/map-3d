import * as THREE from 'three';

export default class Cylinder {

    constructor(data, mapInstance) {
        let height = 100;

        const objects = [];
        let countVaule = 0;
        let vector = mapInstance.toMapVector3(data.lnglat.toPixel(mapInstance.zoom));

        data.data.forEach((item) => {
            countVaule += item.value;
        });

        data.data.forEach((item, key) => {
            data.data[key].precent = item.value / countVaule;
        });

        let preHeightCount = 0;

        data.data.forEach((item, index) => {
            let _height = Math.floor(height * item.precent);
            const geometry = new THREE.CylinderBufferGeometry(2, 2, _height, 40);
            // const geometry = new THREE.BoxBufferGeometry(8, height, 8, 20, 20, 20);
            const material = new THREE.MeshPhongMaterial({
                color: item.color,
                specular: 0x7777ff,
                shininess: 30
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(vector.x, preHeightCount + _height / 2, vector.z);
            preHeightCount += _height;

            objects.push(cylinder);
            mapInstance.scene.add(cylinder);
            mapInstance.render();
        });
    }
}
