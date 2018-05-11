import { Point } from '@/geometry';

export default {

    // 获取瓦片坐标
    getPoint(pixel) {
        let x = Math.ceil(pixel.x / 256) - 1;
        let y = Math.ceil(pixel.y / 256) - 1;

        return new Point(x, y);
    },

    getSize() {
        return 256;
    },

    minZoom: 3,

    getBounds(centerPoint, mapSize, zoom) {
        const { minZoom } = this;
        const tileSize = this.getSize();
        const xMax = Math.pow(1, zoom - minZoom) + Math.pow(2, zoom - minZoom);
        const yMax = 2 * Math.pow(2, zoom - minZoom)

        console.log(xMax, yMax)
    }
}
