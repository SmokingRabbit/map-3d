import Pixel from './pixel';

export default class Point {

	constructor(x, y) {
		if (typeof x !== 'number' || typeof x !== 'number') {
            throw new Error('Point仅支持number类型');
        }

        this.x = x;
        this.y = y;
	}

	toPixel(zoom) {
		let x = this.x * Math.pow(2, zoom - 18);
		let y = this.y * Math.pow(2, zoom - 18);

		return new Pixel(Math.floor(x), Math.floor(y));
	}
}
