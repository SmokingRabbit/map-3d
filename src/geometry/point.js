import Pixel from './pixel';
import Map from '@/map/map';
import { Mercator, LngLat } from '@/geo';

// 物理坐标
export default class Point {

	constructor(x, y, z) {
		if (typeof x !== 'number' || typeof y !== 'number' || (z && typeof z !== 'number')) {
            throw new Error('Point仅支持number类型');
        }

        this.x = x;
        this.y = y;
		this.z = z || 0;
	}

	toPixel(zoom) {
		let x = this.x * Math.pow(2, zoom - 18);
		let y = this.y * Math.pow(2, zoom - 18);

		return new Pixel(Math.floor(x), Math.floor(y));
	}

	toMapVector3(mapInstance) {
        if (!(mapInstance instanceof Map)) {
            throw new Error('toMapPoint 需要map 实例');
        }

        return mapInstance.toMapVector3(this.toPixel());
    }

	toLngLat(zoom) {
        const { lat, lng } = Mercator.pointToLngLat(this);
        return new LngLat(lng, lat);
    }
}
