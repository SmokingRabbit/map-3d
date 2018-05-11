export default class Pixel {
    constructor(x, y) {
        if (typeof x !== 'number' || typeof x !== 'number') {
            throw new Error('Pixel仅支持number类型');
        }

        this.x = x;
        this.y = y;
    }
}
