import Pixel from './pixel';

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

		return new Pixel(Math.ceil(x), Math.ceil(y));
	}
}
