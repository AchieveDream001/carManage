<template>
    <div>
        <DrawCarTool ref='drawCar' drawType='display' updateCarEvent='mainUpdateCar'></DrawCarTool>
    </div>
</template>

<script>
    import DrawCarTool from '../drawTool/DrawCarTool.vue';
    export default {
        components: { DrawCarTool },
        data() {
            return {
                map: null
            };
        },
        methods: {
            addCarData(data) {

            }
        },
        mounted() {
            let scope = this;
            // setTimeout(() => {
            //     scope.$listener.$emit('addMoveWarning', { carNumber: '粤O1234' });
            // }, 10000);

            // 先得到所有车辆的最新状态  之后再更新车辆
            let isFinishLoad = false;
            this.$axios.get(this.$config.GET_ALL_CAR_STATE).then(function (allCarState) {
                setTimeout(() => {
                    isFinishLoad = true;
                }, 30000);
                for (let carNb in allCarState.data) {
                    let d = allCarState.data[carNb];
                    let data = Object.assign(d, {
                        coord: [d.Lng, d.Lat],
                        carNumber: d.mobileNo,
                        direction: d.Direction,
                        speed: d.Speed,
                        carPath: [],
                        VEHICLE_TYPE: d.VEHICLE_CLASS ? d.VEHICLE_CLASS : '-1',
                        whereRegion: ''// 所在区域
                    })

                    // 根据服务得到车辆所在区域并记录到车辆上，这里是有延迟
                    if (scope.$config.SERVICE_UNPOSITION) {
                        scope.$axios.get(scope.$config.SERVICE_UNPOSITION, {
                            params: {
                                key: scope.$config.KEY,
                                coord: data.coord[0] + ',' + data.coord[1]
                            }
                        }).then(res => {
                            data.whereRegion = res.data.data ? res.data.data.district : '';
                            scope.$mapState.car[data.carNumber] = (data);
                            if (!scope.map) {
                                let inter = setInterval(() => {
                                    if (scope.map) {
                                        scope.$refs.drawCar.addCar(data);// 延迟增加车辆
                                        clearInterval(inter);
                                    }
                                }, 50);
                            } else {
                                scope.$refs.drawCar.addCar(data)// 如果地图初始化完毕 则直接增加车辆
                            }
                        })
                    } else {
                        data.whereRegion = '';
                        scope.$mapState.car[data.carNumber] = (data);
                        if (!scope.map) {
                            let inter = setInterval(() => {
                                if (scope.map) {
                                    scope.$refs.drawCar.addCar(data);// 延迟增加车辆
                                    clearInterval(inter);
                                }
                            }, 50);
                        } else {
                            scope.$refs.drawCar.addCar(data)// 如果地图初始化完毕 则直接增加车辆
                        }
                    }
                }
            })

            this.$listener.$on('GpsData', function (gpsdata) {
                if (!isFinishLoad) return;
                let d = JSON.parse(gpsdata);
                let data = Object.assign(d, {
                    coord: [d.Lng, d.Lat],
                    carNumber: d.mobileNo,
                    direction: d.Direction,
                    speed: d.Speed,
                    carPath: d.hasRunPath,
                    VEHICLE_TYPE: d.VEHICLE_CLASS,
                    whereRegion: ''// 所在区域
                })
                delete data.hasRunPath;
                // 模拟超时预警数据
                // 判断是否离深 不在指标内 并且离开深圳则发出离深预警
                // 得到车辆申请数据
                if (data.isMoveShen) {
                    this.$listener.$emit('getCarDetail', data.carNumber, function (detailData) {
                        if (detailData.QUOTA && detailData.QUOTA == 1) {
                            // 发出离开深圳的预警
                            scope.$listener.$emit('moveShen', data)
                        }
                    })
                }
                // 根据服务得到车辆所在区域并记录到车辆上，这里是有延迟
                if (scope.$config.SERVICE_UNPOSITION) {
                    scope.$axios.get(scope.$config.SERVICE_UNPOSITION, {
                        params: {
                            key: scope.$config.KEY,
                            coord: data.coord[0] + ',' + data.coord[1]
                        }
                    }).then(res => {
                        data.whereRegion = res.data.data ? res.data.data.district : '';
                        scope.$mapState.car[data.carNumber] = (data);
                        if (!scope.map) {
                            let inter = setInterval(() => {
                                if (scope.map) {
                                    scope.$refs.drawCar.addCar(data);// 延迟增加车辆
                                    clearInterval(inter);
                                }
                            }, 50);
                        } else {
                            scope.$refs.drawCar.addCar(data)// 如果地图初始化完毕 则直接增加车辆
                        }
                    })
                } else {
                    data.whereRegion = '';
                    scope.$mapState.car[data.carNumber] = (data);
                    if (!scope.map) {
                        let inter = setInterval(() => {
                            if (scope.map) {
                                scope.$refs.drawCar.addCar(data);// 延迟增加车辆
                                clearInterval(inter);
                            }
                        }, 50);
                    } else {
                        scope.$refs.drawCar.addCar(data)// 如果地图初始化完毕 则直接增加车辆
                    }
                }
            })

            this.$listener.$on('highlightCar', function (data) {
                if (!data.carNumber) return;
                scope.$refs.drawCar.highlightCar(data.carNumber)
            })
            this.$listener.$on('zoomAll', function (data) {
                if (!data.carNumber) return;
                scope.$refs.drawCar.setPathZoom(data.carNumber)
            })
            // 显示轨迹
            this.$listener.$on('trackCar', function (data, isTrack = true, hasShow) {
                if (hasShow) {
                    isTrack ? scope.$refs.drawCar.showRealTrack(data.carNumber) : scope.$refs.drawCar.clearRealTrack();
                } else {
                    if (!data.carNumber) return;
                    scope.$refs.drawCar.stopTrack()
                    scope.$refs.drawCar.setPathZoom(data.carNumber)
                    isTrack ? scope.$refs.drawCar.showRealTrack(data.carNumber) : scope.$refs.drawCar.clearRealTrack();
                }
            });
            // 实时跟踪
            this.$listener.$on('realTrack', function (data, isTrack = true) {
                isTrack ? scope.$refs.drawCar.trackCar(data.carNumber, 20) : scope.$refs.drawCar.stopTrack();
            });
            this.$listener.$on('onMapLoad', function (map) {
                scope.map = map;
                scope.$refs.drawCar.initCarLayer(map);
            });
            // 过滤车辆
            this.$listener.$on('filterCar', function (data) {
                if (data == 'all') {
                    scope.$refs.drawCar.showAllCar();
                } else {
                    scope.$refs.drawCar.showFilterCar(data);
                }
            })
            this.$listener.$on('changePage', function (type) {
                if (type == 'display') {
                    // 去掉轨迹
                    scope.$refs.drawCar.showRealTrack('');
                    // 去掉跟踪
                    scope.$refs.drawCar.stopTrack();
                } else {

                }
            });
        }
    }
</script>
<style lang="scss" scoped>

</style>