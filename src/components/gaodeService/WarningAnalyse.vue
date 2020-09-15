<template>
    <div class="">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                applyData: {},
                returnData: {},
                moveShenData: {},
                totalWarning: {}
            };
        },
        methods: {
            od_analyse() {
                //OD异常报警（对比派车任务起始点（出发地和目的地）与车辆实际行驶起始点）；

            },
            time_analyse() {

                // 时间异常 即未按规定时间发车 或未按规定时间还车  如果还了车 则在图中删除车辆
                // 传入车辆数据状态表 比对车辆状态和车辆发车时间和当前时间  如果当前时间等于车辆发车时间时车辆状态不对 则抛出异常
                // 如果当前时间等于车辆还车时间时车辆车辆仍在表中 则抛出异常
            },
            saveTimeWarning(data) {
                if (!data.carData.ID) return;
                let scope = this;
                if (scope.totalWarning[`${data.carData.ID}_${data.type}}`]) {
                    return;
                }
                scope.totalWarning[`${data.carData.ID}_${data.type}}`] = data;
                if (data.type == '出车异常') {
                    data.carData.warningContent = `未在${new Date(data.carData.EST_OUT_TIME).toLocaleString('chinse', { hour12: false })}前发车`
                } else if (data.type == '交车异常') {
                    data.carData.warningContent = `未在${new Date(data.carData.EST_BACK_TIME).toLocaleString('chinse', { hour12: false })}前交车`
                }
                data.carData.type = data.type;
                data.carData.date = new Date(data.currentTime).toLocaleString('chinse', { hour12: false })
                // 存放预警数据到数据库
                scope.$axios.get(scope.$config.SAVE_WARNING, {
                    params: {
                        warningType: data.carData.type,
                        applyId: data.carData.ID,
                        LICENSE_PLATE: data.carData.LICENSE_PLATE,
                        warningDate: data.carData.date,
                        mark: data.carData.warningContent
                    }
                })
                scope.$listener.$emit('addTimeWarning', data.carData);
            },
            saveMoveWarning(data) {
                if (!data.carData.ID) return;
                let scope = this;
                if (scope.totalWarning[`${data.carData.ID}_${data.type}}`]) {
                    return;
                }
                scope.totalWarning[`${data.carData.ID}_${data.type}}`] = data;
                if (data.type == '离深预警') {
                    data.carData.warningContent = `车辆驶离过深圳`
                }
                data.carData.type = data.type;
                data.carData.date = new Date(data.currentTime).toLocaleString('chinse', { hour12: false })
                // 存放预警数据到数据库
                scope.$axios.get(scope.$config.SAVE_WARNING, {
                    params: {
                        warningType: data.carData.type,
                        applyId: data.carData.ID,
                        LICENSE_PLATE: data.carData.LICENSE_PLATE,
                        warningDate: data.carData.date,
                        mark: data.carData.warningContent
                    }
                })
                scope.$listener.$emit('addMoveWarning', data.carData);
            }

        },
        mounted() {
            let scope = this;
            // 开启时间实时预警分析
            this.$listener.$on('warning_time', (data) => {
                // 延迟1分钟 执行预警分析
                setTimeout(() => {
                    scope.returnData[data.ID] = data;
                }, 60000);
            })
            setInterval(() => {
                let currentTime = new Date().toLocaleString('chinese', { hour12: false });
                for (let ad in scope.returnData) {
                    let applyCar = scope.returnData[ad];
                    if (currentTime >= applyCar.EST_BACK_TIME && scope.$mapState.car[applyCar.carNumber]) {// 如果达到了交车时间 地图上还有车辆 则抛出异常
                        scope.saveTimeWarning({
                            currentTime: currentTime,
                            carData: applyCar,
                            type: '超时预警'
                        })
                    }
                }
            }, 10000);
            this.$listener.$on('moveShen', function (data) {
                //离开深圳
                let currentTime = new Date().toLocaleString('chinese', { hour12: false });
                // 得到车辆申请信息
                scope.saveMoveWarning({
                    currentTime: currentTime,
                    carData: data,
                    type: '离深预警'
                })
            })
            /*
            预警分析模型
            
            到点未发车预警
            到点未还车预警
    
    
            OD异常报警（对比派车任务起始点（出发地和目的地）与车辆实际行驶起始点）；
            轨迹异常报警（出现车辆轨迹与规划路径不符、行车路线偏离情况）；
            越界异常报警（车辆行驶偏离预定区域）；
            时间异常（派车预计到达时间与车辆行驶时间不符）；
            车辆超速报警（车辆超出道路规定车速）；
            
        */
        }
    }

</script>
<style lang="css" scoped>

</style>