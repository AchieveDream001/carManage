<template>
    <div>
        <DrawCarTool ref='drawCar' drawType='dispatch' updateCarEvent='dispatchUpdateCar'></DrawCarTool>
        <GaodeService ref='gaode'></GaodeService>
    </div>
</template>

<script>
    import DrawCarTool from '../drawTool/DrawCarTool.vue';
    import GaodeService from '../gaodeService/GaodeService.vue'
    export default {
        components: { DrawCarTool, GaodeService },
        data() {
            return {
                map: null
            };
        },
        methods: {
        },
        mounted() {
            let scope = this;
            // 增加车辆
            this.$listener.$on('GpsData', function (gpsdata) {
                let d = JSON.parse(gpsdata);
                let data = Object.assign(d, {
                    coord: [d.Lng, d.Lat],
                    carNumber: d.mobileNo,
                    direction: d.Direction,
                    speed: d.Speed,
                    carPath: d.hasRunPath,
                    VEHICLE_TYPE: d.VEHICLE_CLASS,
                })
                // 模拟超时预警数据
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
            this.$listener.$on('onDispatchMapLoad', function (map) {
                scope.map = map;
                scope.$refs.drawCar.isNeedUpdate = false;
                scope.$refs.drawCar.initCarLayer(map);
                scope.$refs.drawCar.showFilterCar([]);
            });
            this.$listener.$on('highlightDispatchCar', function (data) {
                if (!data.carNumber) return;
                scope.$refs.drawCar.highlightCar(data.carNumber)
            })
            // 过滤车辆
            this.$listener.$on('filterDispatchCar', function (data) {
                if (data == 'all') {
                    scope.$refs.drawCar.showAllCar();
                } else {
                    if (data.length > 0) {
                        scope.$refs.drawCar.showFilterCar(data);
                    }
                }
            })
            this.$listener.$on('dispatchCarPath', function (data) {
                scope.$refs.drawCar.clearWarningLine();
                scope.$refs.drawCar.clearWarningPopup();
                scope.$refs.drawCar.addWarningLine(data.carNumber, data.planPath);
                scope.$refs.drawCar.setPathZoom(null, data.planPath[0], data.planPath);
                // 在路线起始点绘制提示信息
                //scope.$refs.drawCar.addWarningPopup(data);
            })
            // 得到调度信息
            scope.$listener.$on('searchDispatchTable', function (cardata, destination, distance) {
                // 先标注目的地  先清空点 再转换坐标系 再绘制点
                let gcjcoord = scope.$refs.gaode.wgs84togcj02(destination.coord[0], destination.coord[1])
                scope.$refs.drawCar.clearWarningPoint();
                scope.$refs.drawCar.clearWarningLine();
                scope.$refs.drawCar.clearWarningPopup();

                scope.$refs.drawCar.addWarningPoint(gcjcoord, destination.value);
                scope.$refs.drawCar.addBufferArea(gcjcoord, distance);

                // 缩放至调度范围 以调度点为中心
                let path = [];
                let carNb = [];
                for (let cd of cardata) {
                    path.push(cd.coord);
                    carNb.push(cd.carNumber)
                }
                scope.$refs.drawCar.setPathZoom(null, destination.coord, path);
                // 显示车辆
                scope.$refs.drawCar.showFilterCar(carNb);
                // 再标注规划的车辆路线
                // 动态绘制车辆的规划路线
                // for (let cd of cardata) {
                //     // 规划路线的接口
                //     // 这里先设置路线为直线
                //     let warningPath = [gcjcoord, cd.coord];
                //     scope.$refs.drawCar.addWarningLine(cd.carNumber, warningPath);
                //     // 在路线起始点绘制提示信息
                //     scope.$refs.drawCar.addWarningPopup(cd);
                // }
            })
        }
    }
</script>
<style lang="scss" scoped>

</style>