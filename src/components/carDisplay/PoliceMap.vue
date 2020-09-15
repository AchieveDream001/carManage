<template>
    <div style="position: absolute;height:100%;width:100%;">
        <div id="map" ref="basicMapbox"></div>
    </div>
</template>
<script>
    export default {
        name: "mapboxmap",
        components: {},
        data() {
            return {
                map: "",
                mapViewInfo: {},//地图缩放信息
                popup: null
            };
        },
        mounted() {
            let scope = this;
            this.init();
            this.$listener.$on('mapResize', function () {
                if (!scope.map) return;
                setTimeout(() => {
                    scope.map.resize();
                }, 50);
            })
        },
        methods: {
            // 初始化
            init() {
                this.$mapboxgl.accessToken = 'pk.eyJ1IjoiaGFvMTIzcSIsImEiOiJjazE0ZXdybjMwamRyM21vM2wyMHV2cmRjIn0.JFBk_-UdMEyBJraDh_tTfw';
                // 获得静态地图配置数据
                this.popup = new this.$mapboxgl.Popup({
                    closeButton: false
                });
                let scope = this;
                scope.map = new scope.$mapboxgl.Map({
                    // container: this.$refs.basicMapbox,
                    container: "map",
                    center: [114.19768515082933, 22.65344925076326],
                    zoom: 10,
                    style: {
                        version: 8,
                        glyphs: "fonts/{fontstack}/{range}.pbf",
                        "sources": {
                            "raster-tiles": {
                                "type": "raster",
                                "tiles": [scope.$config.MAP_TILE],
                                "tileSize": 256,
                            }
                        },
                        "layers": [{
                            "id": "tdt-img-tiles",
                            "type": "raster",
                            "source": "raster-tiles",
                            "minzoom": 0,
                            "maxzoom": 22
                        }]
                    }
                });
                let map = scope.map;
                //实例化导航控件
                var nav = new scope.$mapboxgl.NavigationControl({
                    //是否显示指南针，默认为true
                    showCompass: true,
                    //是否显示缩放按钮，默认为true
                    showZoom: true
                });
                map.addControl(nav, "top-left");

                var draw = new scope.$mapboxDraw({
                    displayControlsDefault: false,
                    controls: {
                        line_string: true,
                        polygon: true,
                        trash: true
                    }
                });
                map.addControl(draw, "top-left");

                // 比例尺
                var scale = new scope.$mapboxgl.ScaleControl({
                    maxWidth: 80,
                    unit: "metric"
                });
                map.addControl(scale);
                // 全图
                map.addControl(new scope.$mapboxgl.FullscreenControl(), "top-left");

                // 为所有的地标增加鼠标事件
                map.on('load', function () {
                    map.resize()
                    scope.$listener.$emit('onMapLoad', map);

                    map.on('draw.create', updateArea);
                    map.on('draw.delete', updateArea);
                    map.on('draw.update', updateArea);
                    // 增加标注层
                    let SOURCE_ID = 'celiang'
                    let geojson = {
                        'type': 'FeatureCollection',
                        'features': []
                    };
                    let fs = geojson.features;
                    map.addSource(SOURCE_ID, {
                        'type': 'geojson',
                        'data': geojson
                    });
                    map.addLayer({
                        id: 'measure_label',
                        type: 'symbol',
                        source: SOURCE_ID,
                        layout: {
                            "text-padding": 1,
                            "text-font": ["YaHei"],
                            "text-field": ["to-string", ["get", "label"]],
                        },
                        paint: {
                            "text-color": "hsl(0, 0%, 15%)",
                            "text-halo-color": "hsla(0, 0%, 100%, 0.8)",
                            "text-halo-width": 1,
                            "text-halo-blur": 1
                        }
                    });
                    function updateArea(e) {
                        var data = draw.getAll();
                        // 移除所有标注
                        fs.splice(0, fs.length);
                        for (let f of data.features) {
                            // 绘制标注
                            // 如果是线 则每隔两点绘制一标注
                            if (f.geometry.type == "LineString") {
                                for (let i = 0; i < f.geometry.coordinates.length - 1; i++) {
                                    let coord1 = f.geometry.coordinates[i];
                                    let coord2 = f.geometry.coordinates[i + 1];
                                    drawLabel([(coord1[0] + coord2[0]) / 2, (coord1[1] + coord2[1]) / 2], computeLen([coord1, coord2]) + 'km')
                                }
                            } else if (f.geometry.type == "Polygon") {
                                for (let cds of f.geometry.coordinates) {
                                    drawLabel(computeCenter(cds), computeArea(cds).toFixed(3) + 'm²')
                                }

                            }

                        }
                        map.getSource(SOURCE_ID).setData(geojson);
                    }
                    function drawLabel(coord, label = '') {
                        fs.push({
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
                    }
                    function computeLen(coords) {
                        return scope.$turf.lineDistance({
                            'type': 'Feature',
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': coords
                            }
                        }).toLocaleString();
                    }
                    function computeCenter(coords) {
                        if (coords.length < 3) return 0;
                        let points = [];
                        for (let c of coords) {
                            points.push(scope.$turf.point(c))
                        }
                        return scope.$turf.center(scope.$turf.featureCollection(points)).geometry.coordinates;
                    }
                    function computeArea(coords) {
                        if (coords.length < 3) return 0;
                        coords[coords.length] = coords[0];
                        return scope.$turf.area(scope.$turf.polygon([coords]));
                    }
                })
            }
        },
        watch: {
        }
    };
</script>
<style>
    .mapboxgl-ctrl.mapboxgl-ctrl-scale {
        height: 10px;
        background-color: transparent;
        line-height: 10%;
        text-align: center;
    }

    .mapboxgl-ctrl-top-left {
        margin-top: 100px;
    }
</style>