<template>
    <div style="color: rgb(127, 182, 250);">
        <DrawPopup ref='drawPopup'></DrawPopup>
    </div>
</template>
<script>
    import DrawPopup from './DrawPopup.vue'
    let SOURCE_ID, PATH_SOURCE, MOVE_SOURCE, WARNING_SOURCE, BUFFER_SOURCE;
    let PATH_END_P, PATH_STOP_P, PATH_Line_L1, PATH_Line_L2,
        MOVE_P, MOVE_L,
        WARNING_P, WARNING_L,
        BUFFER_A;
    let allLayer = [];
    export default {
        props: ['toolId'],
        components: { DrawPopup },
        data() {
            return {
                map: null,
                geojson: {},
                fs: [],
                pathGeojson: {},// 计划路线图层
                pfs: [],
                moveGeojson: {},// 走过的路线图层
                mfs: [],
                warningGeojson: {},// 警报线图层
                wfs: [],
                bufferGeojson: {},// 缓冲区图层
                bfs: []
            }
        },
        methods: {
            initLayer(map) {
                this.map = map;
                this.$refs.drawPopup.initLayer(map);
                // 加载图标
                this._loadImg('img/mapimg/start.png', 'startPoint');
                this._loadImg('img/mapimg/end.png', 'endPoint');
                this.map.addImage('stopPoint', this._drawStopPoint(), {
                    pixelRatio: 1
                });
                this.map.addImage('warningPoint', this._drawWarningPoint(), {
                    pixelRatio: 4
                });
                this.map.addImage('warningLine', this._drawWarningLine(), {
                    pixelRatio: 4
                });
                this.map.addImage('warningPoint_yellow', this._drawWarningPoint('243, 236, 135'), {
                    pixelRatio: 4
                });
                this.map.addImage('warningLine_yellow', this._drawWarningLine('243, 236, 135'), {
                    pixelRatio: 4
                });
                // 初始化数据
                this.pathGeojson = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                this.pfs = this.pathGeojson.features;

                this.moveGeojson = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                this.mfs = this.moveGeojson.features;

                this.warningGeojson = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                this.wfs = this.warningGeojson.features;
                this.bufferGeojson = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                this.bfs = this.bufferGeojson.features;
                //增加到地图中
                this.map.addSource(PATH_SOURCE, {
                    'type': 'geojson',
                    'data': this.pathGeojson
                });
                this.map.addSource(MOVE_SOURCE, {
                    'type': 'geojson',
                    'data': this.moveGeojson
                });
                this.map.addSource(WARNING_SOURCE, {
                    'type': 'geojson',
                    'data': this.warningGeojson
                });
                this.map.addSource(BUFFER_SOURCE, {
                    'type': 'geojson',
                    'data': this.bufferGeojson
                });
                // 增加对应的图层

                // 增加经停点
                this.map.addLayer({
                    id: PATH_STOP_P,
                    type: 'symbol',
                    source: PATH_SOURCE,
                    paint: {
                        'icon-halo-width': 50,
                        'icon-halo-blur': 50,
                        'icon-halo-color': 'rgba(0,0,255,1)'
                    },
                    layout: {
                        "icon-image": 'stopPoint',
                        'icon-size': 0.1,

                    },
                    filter: ['all', ['==', 'type', 'stopPoint']]
                });
                // 增加路线
                this.map.addLayer({
                    id: PATH_Line_L1,
                    type: 'line',
                    source: PATH_SOURCE,
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': 'rgb(177, 157, 42)',
                        'line-width': 4,
                        'line-dasharray': [10, 0]
                    },
                    filter: ['all', ['==', 'type', 'pathLine1']]
                });
                this.map.addLayer({
                    id: PATH_Line_L2,
                    type: 'line',
                    source: PATH_SOURCE,
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': 'rgb(31, 36, 135)',
                        'line-width': 4,
                        'line-dasharray': [4, 4]
                    },
                    filter: ['all', ['==', 'type', 'pathLine2']]
                });

                // 增加经过路线图层
                this.map.addLayer({
                    id: MOVE_L,
                    type: 'line',
                    // "minzoom": 13.5,
                    source: MOVE_SOURCE,
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': 'rgb(10, 87, 180)',
                        'line-width': 4
                    },
                    filter: ['all', ['==', 'type', 'moveLine']]
                });

                // 增加警报点
                this.map.addLayer({
                    id: WARNING_P,
                    type: 'symbol',
                    source: WARNING_SOURCE,
                    paint: {

                    },
                    layout: {
                        "icon-image": ['get', 'pcolor'],
                        'icon-size': 0.2,
                    },
                    filter: ['all', ['==', 'type', 'warningPoint']]
                });
                // 增加警报线
                this.map.addLayer({
                    id: WARNING_L,
                    type: 'line',
                    source: WARNING_SOURCE,
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': 'rgba(255,0,0,1)',
                        'line-width': 2,
                        'line-pattern': ['get', 'pcolor']
                    },
                    filter: ['all', ['==', 'type', 'warningLine']]
                });
                // 增加起止点图层
                this.map.addLayer({
                    id: PATH_END_P,
                    type: 'symbol',
                    source: PATH_SOURCE,
                    paint: {

                    },
                    "layout": {
                        "icon-image": ['get', 'iconImg'],
                        'icon-size': 0.1,
                        'text-field': ['get', 'label'],
                        'text-size': 10,
                        'icon-offset': [70, -70],
                        'text-offset': [0, 0.7]
                    },
                    filter: ['all', ['==', 'type', 'endPoint']]
                });
                //增加缓冲区图层
                this.map.addLayer({
                    id: BUFFER_A,
                    type: 'fill',
                    source: BUFFER_SOURCE,
                    paint: {
                        "fill-color": "rgba(130, 252, 219,1)",
                        "fill-opacity": 0.4
                    },
                    filter: ['all', ['==', 'type', 'buffer']]
                })

                this._setLayerEvent();
                //增加面图层
                // this.map.addLayer({
                //     'id': 'polygon',
                //     'type': 'fill',
                //     'source': SOURCE_ID,
                //     'layout': {},
                //     'paint': {
                //         'fill-color': '#088',
                //         'fill-opacity': 0.1
                //     },
                //     filter: ['all']
                // });
                // 增加标注图层
                // this.map.addLayer({
                //     id: 'label',
                //     type: 'symbol',
                //     source: SOURCE_ID,
                //     layout: {
                //         "text-padding": 1,
                //         "text-font": ["YaHei"],
                //         "text-field": ["to-string", ["get", "label"]],
                //     },
                //     paint: {
                //         "text-color": "hsl(0, 0%, 15%)",
                //         "text-halo-color": "hsla(0, 0%, 100%, 0.8)",
                //         "text-halo-width": 1,
                //         "text-halo-blur": 1
                //     }
                // });
                // this._testOperate();
            },
            _testOperate() {
                this.addPath_endPoint('yue001', [114.19768515082933, 22.65344925076326], [114.09768515082933, 22.25344925076326])
                this.addPath_stopPoint('yue001', [[114.29768515082933, 22.45344925076326]])
                this.addPath_line('yue001', [[114.19768515082933, 22.65344925076326], [114.29768515082933, 22.45344925076326], [114.09768515082933, 22.25344925076326]]);
                this.addMove_line('yue001', [114.19768515082933, 22.65344925076326]);
                this.addWarning_line('yue001', [[114.29768515082933, 22.45344925076326], [114.29768515082933, 22.25344925076326]]);
                this.addWarning_point('yue001', [114.19768515082933, 22.65344925076326]);
            },

            // 清空线
            clear() {
                this._clearMove();
                this._clearPath();
                this._clearWarning();
            },
            _clearPath() {
                this.pfs.splice(0, this.pfs.length);
            },
            _clearMove() {
                this.mfs.splice(0, this.mfs.length);
            },
            _clearWarning() {
                this.wfs.splice(0, this.wfs.length);
            },
            _drawLabel(coord, label) {
                this.fs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coord
                    },
                    'properties': {
                        visibility: 'hidden',
                        'label': label
                    }
                });
                this._updateSource();
            },
            _updateSource(sourceid, sourcegeojson) {
                if (!sourceid || !sourcegeojson) return;
                this.map.getSource(sourceid).setData(sourcegeojson);
            },
            // 增加起止点
            addPath_endPoint(id, start, end) {
                this.pfs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': start
                    },
                    properties: {
                        iconImg: 'startPoint',
                        id: id,
                        label: '起点',
                        type: 'endPoint'
                    }
                })
                this.pfs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': end
                    },
                    properties: {
                        iconImg: 'endPoint',
                        id: id,
                        label: '终点',
                        type: 'endPoint'
                    }
                })
                this._updateSource(PATH_SOURCE, this.pathGeojson)
            },
            // 增加经停点
            addPath_stopPoint(id, coords, info) {
                for (let i = 0; i < coords.length; i++) {
                    this.pfs.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': coords[i]
                        },
                        properties: {
                            id: id,
                            type: 'stopPoint',
                            time: info && info.time ? info.time[i] : '',
                            speed: info && info.speed ? info.speed[i] : ''
                        }
                    })
                }
                for (let coord of coords) {

                }
                this._updateSource(PATH_SOURCE, this.pathGeojson)
            },
            // 增加路线
            addPath_line(id, coords) {
                this.pfs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coords
                    },
                    properties: {
                        id: id,
                        type: 'pathLine1'
                    }
                });
                this.pfs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coords
                    },
                    properties: {
                        id: id,
                        type: 'pathLine2'
                    }
                });
                this._updateSource(PATH_SOURCE, this.pathGeojson)
            },

            addMove_line(id, coords) {
                this.mfs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coords
                    },
                    properties: {
                        id: id,
                        type: 'moveLine'
                    }
                });
                console.log(this.moveGeojson)
                this._updateSource(MOVE_SOURCE, this.moveGeojson);
            },
            // 增加缓冲区图层
            addBuffer_area(id, center, radiusM, points) {
                if (!points) points = 64;

                var coords = {
                    latitude: center[1],
                    longitude: center[0]
                };

                var km = radiusM / 1000;

                var ret = [];
                var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
                var distanceY = km / 110.574;

                var theta, x, y;
                for (var i = 0; i < points; i++) {
                    theta = (i / points) * (2 * Math.PI);
                    x = distanceX * Math.cos(theta);
                    y = distanceY * Math.sin(theta);
                    ret.push([coords.longitude + x, coords.latitude + y]);
                }
                ret.push(ret[0]);
                this.bfs.push({
                    'type': 'Feature',
                    'geometry': {
                        "type": "Polygon",
                        "coordinates": [ret]
                    },
                    properties: {
                        id: id,
                        type: 'buffer'
                    }
                });
                this._updateSource(BUFFER_SOURCE, this.bufferGeojson);
            },
            // 清空缓冲区
            clearBufferArea() {
                this.bfs.splice(0, this.bfs.length);
                this._updateSource(BUFFER_SOURCE, this.bufferGeojson);
            },
            clearMoveLine() {
                this.mfs.splice(0, this.mfs.length);
                this._updateSource(MOVE_SOURCE, this.moveGeojson);
            },
            addHighlight(id, coords) {
                //this.addWarning_point(id + '_highlight', coords[coords.length - 1], 'yellow')
                this.addWarning_line(id + '_highlight', coords, 'yellow')
            },
            clearHighlight(id) {
                for (let i = this.wfs.length - 1; i >= 0; i--) {
                    let f = this.wfs[i];
                    if (f.properties.id == id + '_highlight') {
                        this.wfs.splice(i, 1)
                    }
                }
                this._updateSource(WARNING_SOURCE, this.warningGeojson)
            },
            removeCar(carNumber) {
                // 移除该车牌号的所有路线以及点
                for (let i = this.pfs.length - 1; i >= 0; i--) {
                    let f = this.pfs[i];
                    if (f.properties.id == carNumber) {
                        this.pfs.splice(i, 1)
                    }
                }
                for (let i = this.mfs.length - 1; i >= 0; i--) {
                    let f = this.mfs[i];
                    if (f.properties.id == carNumber) {
                        this.mfs.splice(i, 1)
                    }
                }
                for (let i = this.wfs.length - 1; i >= 0; i--) {
                    let f = this.wfs[i];
                    if (f.properties.id == carNumber) {
                        this.wfs.splice(i, 1)
                    }
                }
                this._updateSource(MOVE_SOURCE, this.moveGeojson);
                this._updateSource(PATH_SOURCE, this.pathGeojson)
                this._updateSource(WARNING_SOURCE, this.warningGeojson)
            },
            // 增加走过的路线
            updateMove_line(id, coord) {
                for (let mf of this.mfs) {
                    if (mf.properties.id == id) {
                        Array.isArray(coord) ? mf.geometry.coordinates = coord : mf.geometry.coordinates.push(coord);
                        this._updateSource(MOVE_SOURCE, this.moveGeojson);
                        return;
                    }
                }
            },
            // 增加预警点
            addWarning_point(id, coord, color) {
                this.wfs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coord
                    },
                    properties: {
                        id: id,
                        type: 'warningPoint',
                        pcolor: color == 'yellow' ? 'warningPoint_yellow' : 'warningPoint'
                    }
                });
                this._updateSource(WARNING_SOURCE, this.warningGeojson)
            },
            clearWarning_point() {
                for (let i = this.wfs.length - 1; i >= 0; i--) {
                    if (this.wfs[i].geometry.type == 'Point') {
                        this.wfs.splice(i, 1);
                    }
                }
                this.wfs.splice(0, this.wfs.length);
                this._updateSource(WARNING_SOURCE, this.warningGeojson)
            },
            // 增加预警路线
            addWarning_line(id, coords, color) {
                this.wfs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coords
                    },
                    properties: {
                        id: id,
                        type: 'warningLine',
                        pcolor: color == 'yellow' ? 'warningLine_yellow' : 'warningLine'
                    }
                });
                this._updateSource(WARNING_SOURCE, this.warningGeojson)
            },
            clearWarning_line() {
                for (let i = this.wfs.length - 1; i >= 0; i--) {
                    if (this.wfs[i].geometry.type == 'LineString') {
                        this.wfs.splice(i, 1);
                    }
                }
                this._updateSource(WARNING_SOURCE, this.warningGeojson)
            },

            _loadImg(path, name) {
                let scope = this;
                this.map.loadImage(path, function (error, image) {
                    if (error) throw error
                    if (!scope.map.hasImage(name)) {
                        scope.map.addImage(name, image);
                    };
                });
            },
            // 绘制警报线
            _drawWarningLine(color) {
                let scope = this;
                var size = 64;
                var lastt = 0;
                let change = true;
                return {
                    width: size,
                    height: size,
                    data: new Uint8Array(size * size * 4),
                    onAdd: function () {
                        var canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        this.context = canvas.getContext('2d');
                    },
                    render: function () {
                        var duration = 1000;
                        var t = (performance.now() % duration) / duration;// 从0到1
                        var context = this.context;
                        context.clearRect(0, 0, this.width, this.height);// 清除上个画布
                        change = t < lastt ? !change : change;
                        context.fillStyle = `rgba(${color ? color : '255, 0, 0'}, 1)`; //`rgba(${color ? color : '255,0,0'},${change ? t : (1 - t)}`;
                        context.fillRect(0, 0, size, size * t);
                        context.fill();// 填充闭合区域
                        this.data = context.getImageData(0, 0, this.width, this.height).data;
                        lastt = t;
                        scope.map.triggerRepaint();
                        return true;
                    }
                };
            },
            // 绘制警报点
            _drawWarningPoint(color) {
                let scope = this;
                var size = 200;
                var lastt = 0;
                let change = true;
                return {
                    width: size,
                    height: size,
                    data: new Uint8Array(size * size * 4),
                    onAdd: function () {
                        var canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        this.context = canvas.getContext('2d');
                    },
                    render: function () {
                        var duration = 1000;
                        var t = (performance.now() % duration) / duration;// 从0到1
                        var context = this.context;
                        context.clearRect(0, 0, this.width, this.height);// 清除上个画布
                        context.beginPath();
                        context.arc(
                            this.width / 2,
                            this.height / 2,
                            this.width / 2 * t,
                            0,
                            Math.PI * 2
                        );
                        context.fillStyle = `rgba(${color ? color : '255, 0, 0'}, 1)`;
                        context.fill();
                        this.data = context.getImageData(0, 0, this.width, this.height).data;
                        scope.map.triggerRepaint();
                        return true;
                    }
                };
            },
            // 绘制经停点
            _drawStopPoint() {
                let scope = this;
                var size = 100;
                var lineWidth = 20;
                let data = new Uint8Array(size * size * 4);
                var canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                let context = canvas.getContext('2d');
                context.beginPath();
                context.fillStyle = 'red';
                context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                context.fill();
                context.beginPath();
                context.fillStyle = 'yellow';
                context.arc(size / 2, size / 2, size / 2 - lineWidth + 5, 0, Math.PI * 2);
                context.fill();
                return context.getImageData(0, 0, size, size);
            },
            // 设置图层操作事件
            _setLayerEvent() {
                let scope = this;
                scope.map.on('click', WARNING_P, function (e) {
                    var features = scope.map.queryRenderedFeatures(e.point, {
                        layers: [WARNING_P]
                    });
                    scope.$refs.drawPopup.addCarInfoPopup({
                        carInfo: JSON.stringify({ carNumber: '15' }),
                        lnglat: features[0].geometry.coordinates
                    })
                });
                scope.map.on('mouseenter', PATH_STOP_P, function (e) {
                    var features = scope.map.queryRenderedFeatures(e.point, {
                        layers: [PATH_STOP_P]
                    });
                    scope.$refs.drawPopup.addStopPointPopup({
                        stopInfo: features[0].properties,
                        lnglat: features[0].geometry.coordinates
                    })
                });
                for (let layer of allLayer) {
                    scope.map.on('mousemove', layer, function (e) {
                        scope.map.getCanvas().style.cursor = 'pointer';
                    });
                    scope.map.on('mouseout', layer, function (e) {
                        scope.map.getCanvas().style.cursor = '';
                    });
                }
            }
        },
        mounted() {
            SOURCE_ID = this.toolId || 'measure_json';
            PATH_SOURCE = SOURCE_ID + '_path';
            MOVE_SOURCE = SOURCE_ID + '_move';
            WARNING_SOURCE = SOURCE_ID + '_warning';
            BUFFER_SOURCE = SOURCE_ID + '_buffer';

            PATH_END_P = PATH_SOURCE + '_endp';
            PATH_STOP_P = PATH_SOURCE + '_stopp';
            PATH_Line_L1 = PATH_SOURCE + '_line1';
            PATH_Line_L2 = PATH_SOURCE + '_line2';

            MOVE_P = MOVE_SOURCE + '_p';
            MOVE_L = MOVE_SOURCE + '_l';

            WARNING_P = WARNING_SOURCE + '_p';
            WARNING_L = WARNING_SOURCE + '_l';
            BUFFER_A = BUFFER_SOURCE + '_a'
            allLayer = [PATH_END_P, PATH_STOP_P, PATH_Line_L1, PATH_Line_L2, MOVE_P, MOVE_L, WARNING_P, WARNING_L, BUFFER_A]
        }
    };
</script>
<style>
    .mytestinfo {
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 100;

    }
</style>