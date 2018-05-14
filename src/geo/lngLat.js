import Mercator from './mercator';
import Map from '@/map/map';
import { Point, Pixel } from '@/geometry';

export default class LngLat {

    constructor(lng ,lat) {
        if (typeof lng !== 'number' || typeof lat !== 'number') {
            throw new Error('LngLat仅支持number类型');
        }

        this.lng = lng;
        this.lat = lat;
    }

    clone() {
        return new LngLat(this.lng, this.lat);
    }

    toPoint() {
        const { x, y } = Mercator.lngLatToPoint(this);

        return new Point(x, y);
    }

    toPixel(zoom) {
        return this.toPoint().toPixel(zoom);
    }

    toMapVector3(mapInstance) {
        if (!(mapInstance instanceof Map)) {
            throw new Error('toMapPoint 需要map 实例');
        }

        return mapInstance.toMapVector3(this.toPoint().toPixel());
    }
}
