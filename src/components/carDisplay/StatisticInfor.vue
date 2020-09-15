<template>
    <div class="statistic-info">
        <div class="question_title_content">
            <InforPane chartId='outLineInfoChart' :ischange=isChange :outLineInfo=outLineInfo :totalInfo=totalInfo
                :onLineInfo=onLineInfo>
            </InforPane>
        </div>
        <div class="question_title_content">
            <RegionCarCount chartId='regionCarCount' :info=regionCarCount></RegionCarCount>
        </div>
        <div class="question_title_content">
            <InforBarType chartId='inforbar' :ischange=isChangeType :outLineInfo=outLineInfoType
                :totalInfo=totalInfoType :onLineInfo=onLineInfoType>
            </InforBarType>
        </div>
    </div>
</template>

<script>
    import InforPane from '../StatisticInfo/InforBar.vue'
    import InforBarType from '../StatisticInfo/InforBarType.vue'
    import RegionCarCount from '../StatisticInfo/RegionCarCount.vue'
    export default {
        components: { InforPane, RegionCarCount, InforBarType },
        data() {
            return {
                carTotal: 500,
                carOnLine: 0,
                carOutLine: 500,
                isChangeType: false,
                isChange: false,
                // 车辆信息
                totalInfo: {
                    difangpai: 100,
                    yueOpai: 100,
                    yuejingpai: 200,
                    jingyongmotuochepai: 100
                },
                onLineInfo: {
                    difangpai: 0,
                    yueOpai: 0,
                    yuejingpai: 0,
                    jingyongmotuochepai: 0
                },
                outLineInfo: {
                    difangpai: 100,
                    yueOpai: 100,
                    yuejingpai: 200,
                    jingyongmotuochepai: 100
                },


                totalInfoType: {
                    xiaojiao: 100,
                    yueye: 100,
                    mianbao: 200,
                    lvxing: 200,
                    renhuo: 100
                },
                onLineInfoType: {
                    xiaojiao: 0,
                    yueye: 0,
                    mianbao: 0,
                    lvxing: 0,
                    renhuo: 0
                },
                outLineInfoType: {
                    xiaojiao: 100,
                    yueye: 100,
                    mianbao: 200,
                    lvxing: 200,
                    renhuo: 100
                },

                regionCarCount: [100, 20]
            };
        },
        methods: {

        },
        watch: {
            carOnLine: function (nd) {
                this.$listener.$emit('getCarStatistic', this.carTotal, this.carOnLine, this.carOutLine)
            }
        },
        mounted() {
            //监听在线车辆数据
            let scope = this;
            let tempRegion = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let onLine = {
                difangpai: 0,
                yueOpai: 0,
                yuejingpai: 0,
                jingyongmotuochepai: 0
            }, onlineType = {
                xiaojiao: 0,
                yueye: 0,
                mianbao: 0,
                lvxing: 0,
                renhuo: 0
            }

            this.$axios.get(this.$config.GET_ALL_CAR).then(function (val) {
                scope.carTotal = scope.carOutLine = val.data[1].count + val.data[2].count + val.data[3].count
                scope.totalInfo = {
                    difangpai: val.data[1].count,
                    yueOpai: val.data[2].count,
                    yuejingpai: val.data[3].count,
                    jingyongmotuochepai: 0
                };
                scope.outLineInfo = {
                    difangpai: val.data[1].count,
                    yueOpai: val.data[2].count,
                    yuejingpai: val.data[3].count,
                    jingyongmotuochepai: 0
                }
                scope.isChange = !scope.isChange;
            })
            this.$axios.get(this.$config.GET_ALL_CAR_TYPE).then(function (val) {
                scope.totalInfoType = {
                    xiaojiao: val.data[0].count,
                    yueye: val.data[1].count,
                    mianbao: val.data[2].count,
                    lvxing: val.data[4].count,
                    renhuo: val.data[3].count
                };
                scope.outLineInfoType = {
                    xiaojiao: val.data[0].count,
                    yueye: val.data[1].count,
                    mianbao: val.data[2].count,
                    lvxing: val.data[4].count,
                    renhuo: val.data[3].count
                }
                scope.isChangeType = !scope.isChangeType;
            })

            let pai, type, onlinecount;
            setInterval(() => {
                onLine = {
                    difangpai: 0,
                    yueOpai: 0,
                    yuejingpai: 0,
                    jingyongmotuochepai: 0
                }
                onlineType = {
                    xiaojiao: 0,
                    yueye: 0,
                    mianbao: 0,
                    lvxing: 0,
                    renhuo: 0
                }
                onlinecount = 0;
                tempRegion = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let d in scope.$mapState.car) {
                    // 按车牌号统计
                    if (scope.$mapState.car[d].onLineState == 'off') {
                        continue;
                    }
                    onlinecount++;
                    pai = scope.$mapState.car[d].LICENSE_TYPE;
                    switch (pai) {
                        case 1:
                            onLine.difangpai++;
                            break;
                        case 2:
                            onLine.yueOpai++;
                            break;
                        case 3:
                            onLine.yuejingpai++;
                            break;
                        case 4:
                            onLine.jingyongmotuochepai++;
                            break;
                    }
                    type = scope.$mapState.car[d].VEHICLE_TYPE;
                    switch (type) {
                        case 1:
                            onlineType.xiaojiao++;
                            break;
                        case 2:
                            onlineType.mianbao++;
                            break;
                        case 3:
                            onlineType.yueye++;
                            break;
                        case 4:
                            onlineType.lvxing++;
                            break;
                        case 4:
                            onlineType.xiaojiao++;
                            break;
                    }
                    switch (scope.$mapState.car[d].whereRegion) {
                        case '罗湖区':
                            tempRegion[1]++;
                            break;
                        case '宝安区':
                            tempRegion[4]++;
                            break;
                        case '福田区':
                            tempRegion[0]++;
                            break;
                        case '大鹏区':
                            tempRegion[9]++;
                            break;
                        case '盐田区':
                            tempRegion[2]++;
                            break;
                        case '龙岗区':
                            tempRegion[5]++;
                            break;
                        case '龙华区':
                            tempRegion[6]++;
                            break;
                        case '光明区':
                            tempRegion[8]++;
                            break;
                        case '南山区':
                            tempRegion[3]++;
                            break;
                        case '坪山区':
                            tempRegion[7]++;
                            break;
                        case '深汕区':
                            tempRegion[10]++;
                            break;
                    }
                }
                // 统计在线车辆数 并判断各车牌号的车辆数
                scope.carOnLine = onlinecount;
                scope.carOutLine = scope.carTotal - onlinecount;

                scope.regionCarCount = tempRegion;

                scope.onLineInfo = onLine;
                scope.onLineInfoType = onlineType;
                scope.outLineInfo = {
                    difangpai: scope.totalInfo.difangpai - scope.onLineInfo.difangpai,
                    yueOpai: scope.totalInfo.yueOpai - scope.onLineInfo.yueOpai,
                    yuejingpai: scope.totalInfo.yuejingpai - scope.onLineInfo.yuejingpai,
                    jingyongmotuochepai: scope.totalInfo.jingyongmotuochepai - scope.onLineInfo.jingyongmotuochepai
                }
                scope.outLineInfoType = {
                    xiaojiao: scope.totalInfoType.xiaojiao - scope.onLineInfoType.xiaojiao,
                    yueye: scope.totalInfoType.yueye - scope.onLineInfoType.yueye,
                    mianbao: scope.totalInfoType.mianbao - scope.onLineInfoType.mianbao,
                    renhuo: scope.totalInfoType.renhuo - scope.onLineInfoType.renhuo,
                    lvxing: scope.totalInfoType.lvxing - scope.onLineInfoType.lvxing
                }
                scope.isChange = !scope.isChange;
                scope.isChangeType = !scope.isChangeType;
            }, 5000);

        }
    }
</script>
<style lang="css" scoped>
    .statistic-info {
        /* padding: 5px;
        height: calc(100% - 18px); */
        overflow: hidden;
        /* background-color: rgba(1, 56, 147, 0.1); */
        /* border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px; */
        font-size: 14px;
        color: blue;
        text-shadow: 1px 1px 2px rgb(164, 240, 248), -1px -1px 2px rgb(173, 241, 248);
        font-weight: 500;
        cursor: pointer;
    }

    .statistic-info-title {
        right: 1px;
        top: 1px;
        font-size: 14px;
        text-shadow: 1px 1px 2px rgb(108, 227, 253), -1px -1px 2px rgb(108, 227, 253);
        color: rgb(45, 56, 252);
        cursor: default;
        background-color: rgba(72, 248, 242, 0.1);
        border-radius: 10px;
        padding: 5px;
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px
    }

    .statistic-info img {
        padding: 0px 10px 0px 10px;
        width: 20px;
        height: 20px;
    }

    .statistic-info>>>.el-collapse-item__header:hover {
        background-color: rgb(1, 56, 147);
    }

    .statistic-info>>>.el-collapse-item__header {
        background-color: rgb(65, 99, 164);
        border-bottom: 1px rgb(108, 227, 253) solid;
        box-shadow: rgb(69, 219, 253) 0px 1px 10px;
        color: white;
        font-size: 14px;
        text-shadow: 1px 1px 5px rgb(0, 229, 255), -1px -1px 5px rgb(0, 229, 255), 1px -1px 5px rgb(0, 229, 255), -1px 1px 5px rgb(0, 229, 255);

    }
</style>