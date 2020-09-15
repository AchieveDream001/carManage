<template>
    <div class="track-map">
        <div id='trackmap'></div>
        <div class="track-map-bar">
            <!-- <div class="play-info">
                <div>
                    当前时间：{{currentState.time}}
                </div>
                <div>
                    当前速度：{{currentState.speed}}km/h
                </div>
            </div> -->
            <table>
                <tr>
                    <td style="width: 120px;">
                        <el-button style="font-size: 24px;font-weight: 100;padding: 3px;transform: translate(0,3px);"
                            type="default" :icon="isStartIcon" @click='onStart' circle size="small"></el-button>
                        <el-button title="慢放" style="font-size: 14px;padding: 8px;" type="default"
                            icon="el-icon-d-arrow-left" circle size="small"
                            @click='timeScale/=2;isStart?runTimeScale=timeScale:null'></el-button>
                        <el-button title="快放" style="font-size: 14px;padding: 8px;" type="default"
                            icon="el-icon-d-arrow-right" circle size="small"
                            @click='timeScale*=2;isStart?runTimeScale=timeScale:null'></el-button>

                    </td>
                    <td style="font-size: 10px;width: 30px;cursor: default;">
                        X{{timeScale}}
                    </td>
                    <td style="width: 130px;font-size: 13px;color: white;cursor: default;">
                        开始时间：<br>{{trackPath&&trackPath[0]&&trackPath[0].START_TIME?new Date(trackPath[0].START_TIME).toLocaleString('chinse', { hour12: false }) :''}}
                    </td>
                    <td>
                        <el-slider v-model="timeBar" :format-tooltip="formatTooltip" @change="onDragBar">
                        </el-slider>
                    </td>
                    <td style="width: 130px;font-size: 13px;color: white;cursor: default;padding-left: 5px;">
                        结束时间：<br>{{trackPath&&trackPath[0]&&trackPath[0].START_TIME?new Date(trackPath[trackPath.length-1].TIME).toLocaleString('chinse', { hour12: false }) :''}}
                    </td>
                </tr>
            </table>
        </div>
        <div class="track-map-info question_title_content">
            <table border="0">
                <tr>
                    <th colspan="4" style="font-weight: bold;font-size: 15px;">车辆行驶信息栏</th>
                </tr>
                <tr>
                    <th>车牌号：</th>
                    <td>{{trackInfo.LICENSE_PLATE}}</td>
                    <th>司机：</th>
                    <td>{{trackInfo.TAKE_UNAME}}</td>
                </tr>
                <tr>
                    <th>申请日期：</th>
                    <td>{{trackInfo.apply_date}}</td>
                    <th>目的地：</th>
                    <td>{{trackInfo.DEST_PLACE}}</td>
                </tr>
                <tr>
                    <th>当前时间：</th>
                    <td> {{currentState.time}}</td>
                    <th>当前速度：</th>
                    <td> {{currentState.speed}}km/h</td>
                </tr>
                <tr>
                    <th>定位车辆：</th>
                    <td>
                        <el-button @click="highlightRow" type="text" size="small" icon="el-icon-location-information"
                            title="定位车辆">定位
                        </el-button>
                    </td>
                    <th>车辆详情：</th>
                    <td>
                        <el-button @click="highlightPath" type="text" size="small" icon="el-icon-chat-line-round"
                            title="车辆详情">详情
                        </el-button>
                    </td>
                </tr>
            </table>
        </div>
        <DrawCarTool ref='drawCar' updateCarEvent='trackReviewCar'></DrawCarTool>
    </div>
</template>

<script>
    import DrawCarTool from '../drawTool/DrawCarTool.vue'
    export default {
        components: { DrawCarTool },
        data() {
            return {
                map: null,
                timeBar: 0,
                timeScale: 1,
                isStart: false,
                isStartIcon: 'el-icon-video-play',
                runTimeScale: 0.0000001,
                runInter: null,
                subTime: 0,
                currentState: {
                    time: 0,
                    speed: 0
                },
                trackPath: {},
                trackInfo: {}
            };
        },
        methods: {
            highlightPath() {
                if (!this.trackInfo.carNumber) return
                this.$listener.$emit('carDetail', this.trackInfo)

            },
            highlightRow() {
                if (!this.trackInfo.carNumber) return
                this.$refs.drawCar.highlightCar(this.trackInfo.carNumber)
            },
            stopRun() {
                this.currentReviewTime = 0;// 时间
                this.curTimeSlot = 0;// 时间点
                this.timeBar = 0;
                this.runTimeScale = 0.0000001;
                this.isStart = false;
                this.isStartIcon = 'el-icon-video-play';
            },
            onStart() {
                this.isStart = !this.isStart;
                this.isStartIcon = this.isStart ? 'el-icon-video-pause' : 'el-icon-video-play';
                this.runTimeScale = this.isStart ? this.timeScale : 0.0000001;
            },
            formatTooltip(val) {
                if (this.trackPath && this.trackPath[0]) {
                    let start = new Date(this.trackPath[0].TIME).getTime();
                    let currentTime = new Date(this.subTime / 100 * val + start).toLocaleString('chinse', { hour12: false });
                    this.currentState.time = currentTime;
                    return currentTime;
                } else {
                    return '';
                }
            },
            onDragBar(val) {
                if (!this.reviewPath || this.reviewPath.path.length < 1) return;
                //this.updateRun();
                // 更改子组件里的动画参数
                // 计算移动进度条后时间和时间段
                this.currentReviewTime = this.subTime / 100 * val;
                this.curTimeSlot = 0;
                for (let i = 0; i < this.reviewPath.millisecond.length - 1; i++) {
                    let oneMill = this.reviewPath.millisecond[i];
                    let twoMill = this.reviewPath.millisecond[i + 1];
                    this.curTimeSlot++;
                    if (this.currentReviewTime + this.reviewPath.millisecond[0] >= oneMill
                        && this.currentReviewTime + this.reviewPath.millisecond[0] <= twoMill) {
                        this.updateRun('true');
                        break;
                    }
                }
            },
            updateRun(isTempCar) {
                // 当进度条改变 或者 播放速度改变时 动态改变 动画播放参数
                clearInterval(this.runInter);
                let scope = this;
                let step = 100000 / this.subTime;// 得到进度条的运行间隔
                if (isTempCar) {
                    scope.$refs.drawCar.addCar({
                        carNumber: scope.trackInfo.carNumber,
                        speed: scope.reviewPath.speed[scope.curTimeSlot],
                        direction: scope.reviewPath.direction[scope.curTimeSlot],
                        coord: scope.reviewPath.path[scope.curTimeSlot]
                    })
                }
                this.runInter = setInterval(() => {
                    scope.timeBar += step;
                    if (scope.currentReviewTime + scope.reviewPath.millisecond[0] >= scope.reviewPath.millisecond[scope.curTimeSlot] - 2000
                        && scope.currentReviewTime + scope.reviewPath.millisecond[0] <= scope.reviewPath.millisecond[scope.curTimeSlot] + 2000) {
                        scope.$refs.drawCar.addCar({
                            carNumber: scope.trackInfo.carNumber,
                            speed: scope.reviewPath.speed[scope.curTimeSlot],
                            direction: scope.reviewPath.direction[scope.curTimeSlot],
                            coord: scope.reviewPath.path[scope.curTimeSlot]
                        })
                        scope.currentState.speed = scope.reviewPath.speed[scope.curTimeSlot]// 得到当前时间点的速度
                        scope.curTimeSlot += 1;
                    }
                    scope.currentReviewTime += 1000;
                }, 1000 / scope.runTimeScale);
            },
            startRun() {

            }
        },
        mounted() {
            let scope = this;
            // 初始化地图
            // 获得静态地图配置数据
            this.popup = new this.$mapboxgl.Popup({
                closeButton: false
            });
            scope.map = new scope.$mapboxgl.Map({
                // container: this.$refs.basicMapbox,
                container: "trackmap",
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
            // 加载图片icon资源
            // 为所有的地标增加鼠标事件
            map.on('load', function () {
                // 设置鼠标移动事件
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
                scope.$refs.drawCar.initCarLayer(map, {}, { showPopup: false })

            })
            this.$listener.$on('trackReviewInfo', function (trackInfo, trackPath) {
                scope.trackPath = trackPath;
                scope.trackInfo = trackInfo;
            })
            this.$listener.$on('mapResize', function () {
                if (!scope.map) return;
                setTimeout(() => {
                    scope.map.resize();
                }, 50);
            })
        },
        watch: {
            trackPath: function (nd) {
                this.reviewPath = {
                    path: [],
                    speed: [],
                    direction: [],
                    time: [],
                    millisecond: []
                };
                this.trackInfo.carNumber = this.trackInfo.LICENSE_PLATE;
                for (let d of nd) {
                    this.reviewPath.path.push([d.LNG, d.LAT]);
                    this.reviewPath.speed.push(d.SPEED);
                    this.reviewPath.direction.push(parseFloat(d.DRIECTION));
                    this.reviewPath.time.push(new Date(d.TIME).toLocaleString('chinse', { hour12: false }));
                    this.reviewPath.millisecond.push(new Date(d.TIME).getTime())
                }
                // 初始化运行参数
                this.currentReviewTime = 0;// 时间
                this.curTimeSlot = 0;// 时间点
                this.timeBar = 0;
                let start = new Date(this.trackPath[0].TIME).getTime();
                let end = new Date(this.trackPath[this.trackPath.length - 1].TIME).getTime();
                this.subTime = end - start;
                this.$refs.drawCar.addTrackReviewPath(this.reviewPath, this.trackInfo);//增加路线
                this.updateRun();// 准备运行
                this.$refs.drawCar.addCar({
                    carNumber: this.trackInfo.carNumber,
                    speed: this.reviewPath.speed[this.curTimeSlot],
                    direction: this.reviewPath.direction[this.curTimeSlot],
                    coord: this.reviewPath.path[this.curTimeSlot]
                })
                let scope = this;
                setTimeout(function () {
                    scope.$refs.drawCar.highlightCar(scope.trackInfo.carNumber)
                }, 100)
            },
            runTimeScale: function (nd) {
                if (!this.reviewPath || this.reviewPath.length < 1) return;
                this.updateRun();
            }
        }
    }
</script>
<style lang="css" scoped>
    .track-map {
        width: 100%;
        height: 100%;
    }

    #trackmap {
        width: 100%;
        height: 100%;
    }

    .track-map-info {
        position: absolute;
        right: 1px;
        top: 1px;
        font-size: 13px;
        /* color: white;
        cursor: default;
        background-color: rgb(1, 56, 147, 0.1);
        border-radius: 10px;
        padding: 5px;
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px */
    }

    .track-map-info tr {
        box-shadow: blue 0px 0px 5px;

    }

    .track-map-info th {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .play-info {
        width: fit-content;
        height: fit-content;
        font-size: 13px;
        text-align: left;
        padding: 10px;
        background-color: rgb(172, 199, 255);
        border-radius: 10px;
        color: rgb(84, 84, 84);
        text-shadow: 1px 1px rgb(236, 227, 227), -1px -1px rgb(236, 227, 227), 1px -1px rgb(236, 227, 227), -1px 1px rgb(236, 227, 227);
        font-family: "Microsoft YaHei";
        cursor: default;
    }

    .track-map-bar table {
        width: 100%;
    }

    .track-map-bar {
        position: absolute;
        width: 87%;
        bottom: 15px;
        left: 50%;
        border-radius: 10px;
        padding-left: 10px;
        padding-right: 10px;
        transform: translate(-50%, 0);

    }

    .track-map-bar table {
        border-radius: 10px;
        background-color: rgb(1, 56, 147);
        color: white;
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px
    }
    .track-map-info .el-button{
        color:blue;
         text-shadow: 1px 1px 0  white, 1px -1px 0 white,
            -1px -1px 0 white, -1px 1px 0 white;
    }

    .track-map-bar table {
        width: 100%;
    }
</style>