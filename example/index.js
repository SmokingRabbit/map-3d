import { Map, LngLat } from '@/';

const container = document.querySelector('#root');
const map = new Map(root);

map.setCenter(116.404, 39.915);

map.addCylinder({
    lnglat: new LngLat(116.404, 39.915),
    data: [{
        area: '上地',
        value: 40,
        color: 0xff0000
    }, {
        area: '清河',
        value: 60,
        color: 0x3385ff
    }]
});

map.addCylinder({
    lnglat: new LngLat(116.361438,40.002759),
    data: [{
        area: '清河',
        value: 100,
        color: 0x3385ff
    }, {
        area: '上地',
        value: 100,
        color: 0xdf22e1
    }, {
        area: '清河',
        value: 100,
        color: 0x2be122
    }]
});

map.addCylinder({
    lnglat: new LngLat(116.239555,39.911614),
    data: [{
        area: '清河',
        value: 90,
        color: 0x3385ff
    }, {
        area: '上地',
        value: 70,
        color: 0xf308a8
    }, {
        area: '清河',
        value: 80,
        color: 0xbc5807
    }]
});

map.addCylinder({
    lnglat: new LngLat(116.153318,40.021327),
    data: [{
        area: '清河',
        value: 30,
        color: 0xf308a8
    }, {
        area: '上地',
        value: 60,
        color: 0xff0000
    }, {
        area: '清河',
        value: 40,
        color: 0xbc5807
    }]
});

map.addCylinder({
    lnglat: new LngLat(116.300497,39.899216),
    data: [{
        area: '清河',
        value: 40,
        color: 0xcff51e
    }, {
        area: '上地',
        value: 40,
        color: 0xf308a8
    }, {
        area: '清河',
        value: 40,
        color: 0x3385ff
    }]
});


map.addCylinder({
    lnglat: new LngLat(116.435027,39.861122),
    data: [{
        area: '清河',
        value: 70,
        color: 0x3385ff
    }, {
        area: '上地',
        value: 50,
        color: 0xf308a8
    }, {
        area: '清河',
        value: 40,
        color: 0xff0000
    }]
});
