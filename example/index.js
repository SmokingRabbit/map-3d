import { Map, LngLat } from '@/';

const container = document.querySelector('#root');
const map = new Map(root);

map.setCenter(116.404, 39.915);



function getVaule() {
    return Math.round(Math.random() * 100);
}

function getColor() {
    const colors = [0xef2e52, 0x7c041b, 0xf01cd0, 0xa30a8c, 0x6d065d, 0x7621f6, 0x2149f6, 0x0e2aa0, 0x0e2aa0, 0x0f8a92, 0x23f57c, 0x0e9f4b, 0xeff21a, 0xf2471a];

    return colors[Math.floor(Math.random() * colors.length)];
}

function getLngLat(i) {
    let x = 116.404;
    let y = 39.915;

     x += i * Math.random() * 0.001 * (Math.random() > 0.5 ? -1 : 1);
     y += i * Math.random() * 0.001 * (Math.random() > 0.5 ? -1 : 1);

    return new LngLat(x, y);
}
//
// {
//     lnglat: new LngLat(116.404, 39.915),
//     height: 100,
//     data: [{
//         value: getVaule(),
//         color: getColor()
//     }]
// }
const cylinders = [];

for (let i = 0; i < 50; i++) {
    let len = Math.round(Math.random() * 6);
    let data = [];

    for (let j = 0; j < len; j++) {
        data.push({
            value: getVaule(),
            color: getColor()
        });
    }

    cylinders.push({
        lnglat: getLngLat(i),
        height: 80 * Math.random(),
        data
    });
}
cylinders.forEach((item) => {
    map.addCylinder(item);
})
// setTimeout(() => {
//
// }, 2000);
