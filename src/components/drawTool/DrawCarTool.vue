<template>
    <div>
        <DrawPathTool ref='drawPath' toolId="drawEchart"></DrawPathTool>
        <DrawPopup ref='drawPopup'></DrawPopup>
    </div>
</template>

<script>
    import DrawPathTool from './DrawPathTool.vue';
    import DrawPopup from './DrawPopup.vue';
    const SOURCE_ID = 'car_geojson';
    export default {
        components: { DrawPathTool, DrawPopup },
        props: ['updateCarEvent', 'drawType'],
        data() {
            return {
                map: null,
                allCars: {},// 按车牌号存放图上车辆的信息
                animation: {},// 按车牌号存放图上车辆的动画数据 如果车辆有动画数据的话
                geojson: {
                    'type': 'FeatureCollection',
                    'features': []
                },
                track: null,
                currentZoom: 'highlightZoom',
                trackReal: '',
                isFilter: false,
                isNeedUpdate: true
            };
        },
        methods: {
            initCarLayer(map, pathOption, popupOption) {// 初始化车辆图层资源
                let scope = this;
                scope.$refs.drawPath.initLayer(map, pathOption);
                scope.$refs.drawPopup.initLayer(map, popupOption);
                scope.map = map;
                // 存放车辆数据
                scope.map.addSource(SOURCE_ID, {
                    'type': 'geojson',
                    'data': scope.geojson,
                    "cluster": true,
                    "clusterMaxZoom": 14, // Max zoom to cluster points on
                    "clusterRadius": 30, // Radius of each cluster when clustering points (defaults to 50)
                });
                // 增加车辆图标
                scope.map.loadImage('policeCarImg/policecar00.jpg', function (error, image) {
                    if (error) throw error
                    // 先判断是否加载了该 id 的图片资源，没有则加载
                    if (!scope.map.hasImage('car001')) {
                        scope.map.addImage('car001', image)
                    }
                })
                scope.map.loadImage('policeCarImg/renhuoche.jpg', function (error, image) {
                    if (error) throw error
                    // 先判断是否加载了该 id 的图片资源，没有则加载
                    if (!scope.map.hasImage('renhuoche')) {
                        scope.map.addImage('renhuoche', image)
                    }
                })
                scope.map.loadImage('policeCarImg/yueyeche.jpg', function (error, image) {
                    if (error) throw error
                    // 先判断是否加载了该 id 的图片资源，没有则加载
                    if (!scope.map.hasImage('yueyeche')) {
                        scope.map.addImage('yueyeche', image)
                    }
                })
                scope.map.loadImage('policeCarImg/mianbaoche.jpg', function (error, image) {
                    if (error) throw error
                    // 先判断是否加载了该 id 的图片资源，没有则加载
                    if (!scope.map.hasImage('mianbaoche')) {
                        scope.map.addImage('mianbaoche', image)
                    }
                })
                scope.map.loadImage('policeCarImg/lvxingche.jpg', function (error, image) {
                    if (error) throw error
                    // 先判断是否加载了该 id 的图片资源，没有则加载
                    if (!scope.map.hasImage('lvxingche')) {
                        scope.map.addImage('lvxingche', image)
                    }
                })
                // 增加车辆标注图层
                scope.map.addLayer({
                    id: 'car_img',
                    type: 'symbol',
                    source: SOURCE_ID,
                    layout: {
                        "text-padding": 1,
                        "text-font": ["YaHei"],
                        "text-field": ["to-string", ["get", "label"]],
                        'text-size': 13,
                        'text-offset': [0, -2],
                        // 增加图片
                        'icon-image': ['get', 'carImg'],
                        // 缩放
                        'icon-size': 0.4,
                        // 旋转角度
                        'icon-rotate': ["get", "direction"],// 初始方向正北，以顺时针方向旋转角度
                        // 偏移量
                        'icon-offset': [0, 2],
                        // 跟随地图转动，推拉（3d效果那种）Mapbox 中叫 bearing 和 pitch
                        'icon-rotation-alignment': 'map',
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true
                    },
                    paint: {
                        "text-color": "hsl(0, 0%, 15%)",
                        "text-halo-color": "hsla(0, 0%, 100%, 0.8)",
                        "text-halo-width": 1,
                        "text-halo-blur": 1
                    },
                    filter: ['all', ['in', 'layertype', 'car'], ['!=', 'carVisible', 'hide']]
                });
                // 增加汇聚图层
                scope.map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: SOURCE_ID,
                    filter: ['has', 'point_count'],
                    paint: {
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#ffaf60",
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            0,
                            '#f1f075',
                            100,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            10,
                            10,
                            15,
                            20,
                            20
                        ]
                    }
                });
                scope.map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: SOURCE_ID,
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['YaHei'],
                        'text-size': 12
                    }
                });
                scope.map.on('click', 'clusters', function (e) {
                    var features = scope.map.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    });
                    var clusterId = features[0].properties.cluster_id;
                    scope.map.getSource(SOURCE_ID).getClusterExpansionZoom(
                        clusterId,
                        function (err, zoom) {
                            if (err) return;

                            map.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                            });
                        }
                    );
                });
                scope.map.on('click', 'car_img', function (e) {
                    var features = scope.map.queryRenderedFeatures(e.point, {
                        layers: ['car_img']
                    });
                    // scope.map.easeTo({
                    //     center: features[0].geometry.coordinates,
                    //     zoom: 17
                    // });
                    scope.$refs.drawPopup.addCarInfoPopup({
                        carInfo: features[0].properties.carInfo,
                        lnglat: features[0].geometry.coordinates
                    })
                });
                scope.map.on('mouseover', 'car_img', function (e) {
                    scope.map.getCanvas().style.cursor = 'pointer';
                });
                scope.map.on('mouseout', 'car_img', function (e) {
                    scope.map.getCanvas().style.cursor = '';
                });
            },
            addCar(data) {
                if (!this.map) return;
                // 如果车辆自带路线 则根据路线移动
                // 如果只有车辆及其位置数据 则更新车辆位置
                if (Array.isArray(data)) {
                    for (let car of data) {
                        if (car.animation && car.animation.path) {
                            this._animateCar(car)
                        } else {
                            this._updateCarState(car)
                        }
                    }
                } else {
                    data.animation ? this._animateCar(data) : this._updateCarState(data)
                }
            },
            removeCar(carNumber) {//移除车辆的所有信息
                if (!this.map) return;
                if (Array.isArray(carNumber)) {
                    for (let car of carNumber) {
                        this._removeCar(car)
                    }
                } else {
                    this._removeCar(carNumber)
                }
            },
            _removeCar(carNumber) {
                // 移除车辆数据
                for (let carNb in this.allCars) {
                    if (carNb == carNumber) {
                        clearInterval(this.animation[carNb]);
                        delete this.allCars[carNb];
                        delete this.animation[carNb]
                        break;
                    }
                }
                // 移除车辆图标图层
                for (let i = 0; i < this.fs.length; i++) {
                    let f = this.fs[i];
                    if (f.carNumber == carNumber) {
                        this.fs.splice(i, 1)
                    }
                }
                this._updateGeojson();
                // 移除车辆路线图层
                this.$refs.drawPath.removeCar(carNumber);
            },
            // 车辆过滤
            showAllCar() {
                this.isFilter = false;
                this.geojson.features = this.fs;
                this._updateGeojson();
            },
            // 显示过滤车辆
            showFilterCar(data) {
                this.isFilter = true;
                let tempfs = []
                for (let f of this.fs) {
                    if (!data.includes(f.carNumber)) {
                        // f.properties.carVisible = 'hide';
                    } else {
                        // f.properties.carVisible = 'visible';
                        tempfs.push(f)
                    }
                }
                this.geojson.features = tempfs;
                this._updateGeojson();
            },
            setCameraBound(minLngLat, maxLngLat) {
                this.map.fitBounds([minLngLat, maxLngLat]);
            },
            setPathZoom(carNumber, pcenter, pcarPath) {
                let center, carPath;
                if (!carNumber) {
                    center = pcenter;
                    carPath = pcarPath;
                } else {
                    this.currentZoom = 'pathZoom'
                    // 得到当前车辆中心点

                    for (let i = 0; i < this.fs.length; i++) {
                        if (this.fs[i].carNumber == carNumber) {
                            // 更新车辆位置
                            center = this.fs[i].geometry.coordinates;
                            break;
                        }
                    }
                    // 得到当前车辆的路径范围
                    carPath = this.allCars[carNumber].carInfo.carPath;
                }

                if (!carPath || carPath.length <= 0) return;
                let maxLng = -999, maxLat = -999, minLng = 999, minLat = 999;
                let maxLngSub = -999, maxLatSub = -999;
                for (let cp of carPath) {
                    maxLngSub = Math.max(maxLngSub, Math.abs(cp[0] - center[0]))
                    maxLatSub = Math.max(maxLatSub, Math.abs(cp[1] - center[1]))
                    // maxLng = Math.max(maxLng, cp[0])
                    // maxLat = Math.max(maxLat, cp[1])
                    // minLng = Math.min(minLng, cp[0])
                    // minLat = Math.min(minLat, cp[1])
                }
                // this.map.fitBounds([[minLng - 0.02, minLat - 0.02], [maxLng + 0.02, maxLat + 0.02]]);
                this.map.fitBounds([[center[0] - maxLngSub - 0.01, center[1] - maxLngSub - 0.01], [center[0] + maxLngSub + 0.01, center[1] + maxLngSub + 0.01]]);
            },
            highlightCar(carNumber, zoom = this.$config.HIGHLIGHT_ZOOM) {
                this.currentZoom = 'highlightZoom'
                // 定位到该车辆
                for (let i = 0; i < this.fs.length; i++) {
                    if (this.fs[i].carNumber == carNumber) {
                        // 更新车辆位置
                        if (this.fs[i].geometry.type == 'Point') {
                            zoom ? this.map.easeTo({
                                center: this.fs[i].geometry.coordinates,
                                zoom: zoom
                            }) : this.map.easeTo({
                                center: this.fs[i].geometry.coordinates
                            })
                        }
                    }
                }
            },
            // 移除车辆实时轨迹
            clearRealTrack() {
                this.$refs.drawPath.clearMoveLine();
                this.trackReal = '';
            },
            // 展示车辆实时轨迹
            showRealTrack(carNumber) {
                let scope = this;
                // 先清空所有车辆轨迹
                this.clearRealTrack();
                if (!scope.allCars[carNumber]) return
                // 得到车辆轨迹
                scope.$axios.get(scope.$config.GET_CAR_PATH, {
                    params: {
                        date: scope.allCars[carNumber].carInfo.Time,
                        applyId: scope.allCars[carNumber].carInfo.ID,
                        LICENSE_PLATE: carNumber
                    }
                }).then(val => {
                    scope.trackReal = carNumber;
                    // 先增加车辆轨迹 再实时更新车辆轨迹
                    scope.allCars[carNumber].carInfo.carPath = val.data
                    scope.$refs.drawPath.addMove_line(carNumber, scope.allCars[carNumber].carInfo.carPath);
                    scope.setPathZoom(carNumber)
                })
            },
            clearWarningPoint() {// 清除车辆预警点
                this.$refs.drawPath.clearWarning_point();
            },
            // 增加缓冲区
            addBufferArea(coord, distance) {
                // 先清空缓冲区
                this.$refs.drawPath.clearBufferArea();
                this.$refs.drawPath.addBuffer_area('buffer', coord, distance)
            },
            addWarningPoint(coord, label = '') {// 增加车辆预警点
                this.$refs.drawPath.addWarning_point('warning', coord)
            },
            clearWarningLine() {
                //清空预警线
                this.$refs.drawPath.clearWarning_line();
            },
            addWarningLine(id, coord) {
                // 绘制预警线
                this.$refs.drawPath.addWarning_line(id, coord);
            },
            // 增加预警提示信息
            clearWarningPopup() {
                this.$refs.drawPopup.clear();
            },
            addWarningPopup(carInfo) {
                this.$refs.drawPopup.multWarningPopup(carInfo)
            },
            // 车辆轨迹回放
            trackReviewCar(reviewPath, reviewInfo) {
                // 再移动车辆
                this.currentReviewTime = 0;// 时间
                this.curTimeSlot = 0;// 时间点
                this.curTimeScale = 1;
                this.trackReviewInter = setInterval(() => {
                    // 如果已运行时间 加 起始时间 等于下一个时间点+-10范围  则运行车辆
                    if (this.currentReviewTime + reviewPath.millisecond[0] >= reviewPath.millisecond[this.curTimeSlot] - 100
                        && this.currentReviewTime + reviewPath.millisecond[0] <= reviewPath.millisecond[this.curTimeSlot] + 100) {
                        this.addCar({
                            carNumber: reviewInfo.carNumber,
                            speed: reviewPath.speed[this.curTimeSlot],
                            direction: reviewPath.direction[this.curTimeSlot],
                            coord: reviewPath.path[this.curTimeSlot]
                        })
                        this.curTimeSlot += 1;
                    }
                    this.currentReviewTime += 50;
                }, 50 / this.curTimeScale);
            },
            addTrackReviewPath(reviewPath, reviewInfo) {
                // 先移除上一个轨迹回放路径
                this.clearCar();
                // 先绘制路径
                this.$refs.drawPath.addPath_endPoint(reviewInfo.carNumber, reviewPath.path[0], reviewPath.path[reviewPath.path.length - 1])
                this.$refs.drawPath.addPath_stopPoint(reviewInfo.carNumber, getStopInfo([], reviewPath.path), {
                    time: getStopInfo([], reviewPath.time),
                    speed: getStopInfo([], reviewPath.speed)
                })
                this.$refs.drawPath.addPath_line(reviewInfo.carNumber, reviewPath.path);
                function getStopInfo(obj, info) {
                    Object.assign(obj, info);
                    obj.shift(); obj.pop();
                    return obj;
                }
            },
            trackCar(carNumber, zoom = this.$config.TRACK_ZOOM) {
                this.stopTrack(carNumber);
                //跟踪车辆
                let targetCar, scope = this;
                for (let i = 0; i < this.fs.length; i++) {
                    if (this.fs[i].carNumber == carNumber) {
                        // 更新车辆位置
                        if (this.fs[i].geometry.type == 'Point') {
                            targetCar = this.fs[i];
                            if (this.currentZoom == 'pathZoom') {
                                this.setPathZoom(this.trackCarNumber)
                            } else {
                                this.highlightCar(this.trackCarNumber)
                            }
                        }
                    }
                }
                // 定位到该车辆
                this.trackCarNumber = targetCar.carNumber;
                this.track = setInterval(() => {
                    // 定位到该车辆
                    let pos = [targetCar.geometry.coordinates[0], targetCar.geometry.coordinates[1]]
                    if (this.currentZoom == 'pathZoom') {
                        this.setPathZoom(this.trackCarNumber)
                    } else {
                        this.highlightCar(this.trackCarNumber)
                    }

                    // 绘制路线闪烁 先取消上一个绘制
                    //this.$refs.drawPath.clearHighlight(targetCar.carNumber);
                    //this.$refs.drawPath.addHighlight(targetCar.carNumber, this.allCars[targetCar.carNumber].carPath)
                    // this.$refs.drawPath.addWarning_point(targetCar.carNumber, pos)
                    // console.log(this.allCars[targetCar.carNumber].carPath)
                    // this.$refs.drawPath.addWarning_line()
                }, 100);
            },
            stopTrack(carNumber) {
                this.track ? clearInterval(this.track) : null;
                this.$refs.drawPath.clearHighlight(this.trackCarNumber);
            },
            cancelTrack() {
                clearInterval(this.track);
            },
            clearCar() {
                clearInterval(this.trackReviewInter);
                this.cancelTrack();
                this.$refs.drawPopup.clear();
                for (let carNb in this.allCars) {
                    clearInterval(this.animation[carNb]);
                }
                this.allCars = {};
                this.animation = {};
                this.fs.splice(0, this.fs.length);
                this._updateGeojson();
                this.$refs.drawPath.clear();
            },
            stopAnimation(carNumber) {
                clearInterval(this.animation[carNumber]);
            },
            _updateCarState(carInfo) {
                let cod = carInfo.coord, cnb = carInfo.carNumber;
                if (!cnb || !cod) return;
                if (!this.allCars[cnb]) {// 如果第一次增加该车辆 则增加车辆和车辆路线到地图中  并记录增加车辆的信息
                    this._addCarToMap(cod, cnb, carInfo.direction ? carInfo.direction : 0, carInfo);
                    this.allCars[cnb] = {
                        carInfo: carInfo,
                        carPath: carInfo.carPath ? carInfo.carPath : [[cod[0], cod[1]]]
                    }
                    // this.$refs.drawPath.addMove_line(carInfo.carNumber, carInfo.carPath ?
                    //     carInfo.carPath : [cod, [cod[0] + 0.0000001, cod[1] + 0.000001]]);
                    if (carInfo.animation) {
                        // 增加车辆路线图层
                        let p = carInfo.animation.path;
                        let stop_p = []; Object.assign(stop_p, p);
                        stop_p.shift(); stop_p.pop();
                        this.$refs.drawPath.addPath_endPoint(carInfo.carNumber, p[0], p[p.length - 1])
                        this.$refs.drawPath.addPath_stopPoint(carInfo.carNumber, stop_p)
                        this.$refs.drawPath.addPath_line(carInfo.carNumber, p);
                        this.$refs.drawPath.addWarning_line(carInfo.carNumber, [p[1], p[2]]);
                        this.$refs.drawPath.addWarning_point(carInfo.carNumber, p[1]);
                    }
                } else {
                    // carInfo.animation ?
                    //     this.allCars[cnb].carPath = carInfo.animation.path :
                    //     this.allCars[cnb].carPath.push([cod[0], cod[1]]);
                    carInfo.carPath ?
                        this.allCars[cnb].carPath = carInfo.carPath :
                        this.allCars[cnb].carPath.push([cod[0], cod[1]]);
                    this.allCars[cnb].carInfo = Object.assign(this.allCars[cnb].carInfo, carInfo);
                    // 更新车辆位置
                    this._updateCar(cnb);
                }
                // 判断车辆编号是否相同 如果相同则更换位置 否则增加车辆
            },
            _addCarToMap(coord, carNumber, direction = 0, carInfo = {}) {
                let carImg = 'car001';
                if (carInfo && carInfo.VEHICLE_CLASS) {
                    switch (carInfo.VEHICLE_CLASS) {
                        case 1:
                            carImg = 'car001'
                            break;
                        case 2:
                            carImg = 'yueyeche'
                            break;
                        case 3:
                            carImg = 'mianbaoche'
                            break;
                        case 4:
                            carImg = 'renhuoche'
                            break;
                        case 5:
                            carImg = 'lvxingche'
                            break;
                    }
                }
                this.fs.push({
                    carNumber: carNumber,
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [coord[0], coord[1]]
                    },
                    'properties': {
                        'label': carNumber,
                        'layertype': 'car',
                        'direction': direction,
                        'carInfo': carInfo,
                        'carVisible': 'visible',
                        'carImg': carImg
                    }
                });
                if (this.isNeedUpdate) {
                    this._updateGeojson();
                }
                if (this.updateCarEvent) {
                    this.$listener.$emit(this.updateCarEvent + '_add', carInfo)
                }
            },
            // animation格式为{path:[点串],speed:[速度]}
            _animateCar(carInfo) {
                // 停掉之前的动画
                if (this.animation[carInfo.carNumber]) {
                    clearInterval(this.animation[carInfo.carNumber])
                }
                let p = carInfo.animation.path, v = carInfo.animation.speed;
                let sumTime = [], lngV = [], latV = [], direction = [];//时间差值，当前时间，经度差值，纬度差值
                for (let i = 0; i < p.length; i++) {
                    if (i >= p.length - 1) break;
                    let startp = p[i], endp = p[i + 1];
                    // 得到的距离以km为单位
                    let distance = new this.$mapboxgl.LngLat(startp[0], startp[1]).distanceTo(new this.$mapboxgl.LngLat(endp[0], endp[1]));
                    // 计算时间 这里以毫秒为单位
                    sumTime.push(distance / v[i] * 3600000 + (i == 0 ? 0 : sumTime[i - 1]));
                    // 计算经纬度的速度 单位： 度/毫秒
                    lngV.push((endp[0] - startp[0]) / (distance / v[i] * 3600000))
                    latV.push((endp[1] - startp[1]) / (distance / v[i] * 3600000))
                    // 得到与正北方向的夹角
                    direction.push(90 - Math.atan((endp[1] - startp[1]) / (endp[0] - startp[0])) / Math.PI * 180 + (endp[0] > startp[0] ? 0 : 180))

                }
                let curLng = p[0][0], curLat = p[0][1], curTime = 0, scope = this, FRAME = 50;
                let curTimeSlot = 0;// 时间段
                // 每50毫秒更新一次
                this.animation[carInfo.carNumber] = setInterval(() => {
                    // 计算两点间的距离 根据速度得到时间
                    // 根据时间 差值每个时间段的经纬度
                    curTime += FRAME;
                    // 已运行的时间段大于该时间段 则换下一个时间段
                    if (curTime > sumTime[curTimeSlot]) {
                        curTimeSlot++
                    }
                    if (!carInfo) {
                        clearInterval(this.animation[carInfo.carNumber])
                        return;
                    }
                    if (curTimeSlot >= p.length - 1) {
                        console.log('动画结束')
                        clearInterval(this.animation[carInfo.carNumber])
                    } else {
                        // 变化坐标
                        curLng += lngV[curTimeSlot] * FRAME;
                        curLat += latV[curTimeSlot] * FRAME;
                        carInfo.coord = [curLng, curLat];
                        carInfo.direction = direction[curTimeSlot];
                        this._updateCarState(carInfo)
                        // 刷新车状态，根据输入的车的轨迹和车的速度
                    }
                }, FRAME);
            },
            _updateCar(carNumber) {
                let carinfo = this.allCars[carNumber].carInfo;
                for (let i = 0; i < this.fs.length; i++) {
                    if (this.fs[i].carNumber == carNumber) {
                        // 更新车辆位置
                        if (this.fs[i].geometry.type == 'Point') {
                            this.fs[i].geometry.coordinates = carinfo.coord;
                            this.fs[i].properties.direction = carinfo.direction;
                        }
                    }
                }
                // 更新车辆位置
                if (this.isNeedUpdate) {
                    this._updateGeojson();
                }
                // 如果有跟踪车辆 则 更新车辆路线
                if (carNumber == this.trackReal) {
                    this.$refs.drawPath.updateMove_line(carNumber, carinfo.carPath ? carinfo.carPath : carinfo.coord);
                }
                if (this.updateCarEvent) {
                    this.$listener.$emit(this.updateCarEvent, carinfo)
                }
            },
            _updateGeojson() {
                if (!this.map) return
                this.map.getSource(SOURCE_ID).setData(this.geojson);
            }
        },
        mounted() {

            this.fs = this.geojson.features;
        }
    }
</script>
<style lang="scss" scoped>

</style>