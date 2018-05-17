import Point from './point';
import Map from '@/map/map';
import { Mercator, LngLat } from '@/geo';

// 像素坐标
export default class Pixel {

    constructor(x, y, z) {
		if (typeof x !== 'number' || typeof y !== 'number' || (z && typeof z !== 'number')) {
            throw new Error('Point仅支持number类型');
        }

        this.x = x;
        this.y = y;
		this.z = z || 0;
	}

    toPoint(zoom) {

        let x = this.x / Math.pow(2, zoom - 18);
		let y = this.y / Math.pow(2, zoom - 18);

		return new Point(Math.floor(x), Math.floor(y));
	}

	toMapVector3(mapInstance) {
        if (!(mapInstance instanceof Map)) {
            throw new Error('toMapPoint 需要map 实例');
        }

        return mapInstance.toMapVector3(this);
    }

    toLngLat(zoom) {
        const { lat, lng } = Mercator.pointToLngLat(this.toPoint(zoom));
        return new LngLat(lng, lat);
    }
}
