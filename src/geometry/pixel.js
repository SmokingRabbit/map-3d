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
}
