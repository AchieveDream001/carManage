<template>
    <div>
    </div>
</template>
<script>
    let SOURCE_ID;
    export default {
        props: ['toolId'],
        data() {
            return {
                map: null,
                geojson: {},
                fs: []
            }
        },
        methods: {
            initLayer(map) {
                this.map = map;
                // 存放测量点数据
                this.geojson = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                this.fs = this.geojson.features;
                this.map.addSource(SOURCE_ID, {
                    'type': 'geojson',
                    'data': this.geojson
                });
                // 增加测量点图层
                this.map.addLayer({
                    id: 'measure_points',
                    type: 'circle',
                    source: SOURCE_ID,
                    paint: {
                        'circle-radius': 5,
                        'circle-color': '#000'
                    },
                    filter: ['all', ['!=', 'visibility', 'hidden'], ['in', '$type', 'Point']]
                });
                // 增加测量线图层
                this.map.addLayer({
                    id: 'measure_lines',
                    type: 'line',
                    source: SOURCE_ID,
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },

                    paint: {
                        'line-color': '#000',
                        'line-width': 2.5
                    },
                    filter: ['in', '$type', 'LineString']
                });
                //增加面图层
                this.map.addLayer({
                    'id': 'measure_polygon',
                    'type': 'fill',
                    'source': SOURCE_ID,
                    'layout': {},
                    'paint': {
                        'fill-color': '#088',
                        'fill-opacity': 0.1
                    },
                    filter: ['==', 'type', 'AreaLine']
                });
                // 增加标注图层
                this.map.addLayer({
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
            },
            drawPoint(coord) {
                this.geojson.features.push({
                    'type': 'Feature',
                    'mytype': 'Point',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': coord
                    },
                    'properties': {
                        'id': String(new Date().getTime())
                    }
                });
                this._updateSource();
            },
            drawLine(coords, hasLabel = true) {
                if (coords.length < 2) {
                    return
                };
                this.fs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coords
                    }
                });
                if (!hasLabel) {
                    this._updateSource();
                    return;
                }
                for (let i = 0; i < coords.length - 1; i++) {
                    let startp = coords[i], endp = coords[i + 1];
                    this._drawLabel([(startp[0] + endp[0]) / 2, (startp[1] + endp[1]) / 2],
                        this.computeLen([startp, endp]) + 'km');
                }
            },
            drawArea(coords, hasLabel = true) {
                // 清除之前的记录
                if (coords.length < 3) {
                    return
                }
                this.clear();
                let copyCoords = [];
                Object.assign(
                    copyCoords, coords)
                if (copyCoords[0] != copyCoords[copyCoords.length - 1]) {
                    copyCoords[copyCoords.length] = copyCoords[0]
                }
                this.fs.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': copyCoords
                    },
                    'properties': {
                        'type': 'AreaLine'
                    }
                });
                if (!hasLabel) {
                    this._updateSource();
                    return;
                }
                let copyCoords1 = [];
                Object.assign(
                    copyCoords1, coords)
                this._drawLabel(this.computeCenter(copyCoords1),
                    this.computeArea(copyCoords1) + 'm²');
            },
            computeLen(coords) {
                return this.$turf.lineDistance({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coords
                    }
                }).toLocaleString();
            },
            computeCenter(coords) {
                if (coords.length < 3) return 0;
                let points = [];
                for (let c of coords) {
                    points.push(this.$turf.point(c))
                }
                return this.$turf.center(this.$turf.featureCollection(points)).geometry.coordinates;
            },
            computeArea(coords) {
                if (coords.length < 3) return 0;
                coords[coords.length] = coords[0];
                return this.$turf.area(this.$turf.polygon([coords]));
            },
            clear() {
                this.fs.splice(0, this.fs.length);
                this._updateSource();
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
            _updateSource() {
                this.map.getSource(SOURCE_ID).setData(this.geojson);
            }
        },
        mounted() {
            SOURCE_ID = this.toolId || 'measure_json';
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