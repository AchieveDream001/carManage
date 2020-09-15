<template>
    <div class="infor-pane">
        <table>
            <tr>
                <td>
                    <div :id='chartId' style="width: 150px;height: 150px;z-index: 1000;margin-left: 70px;"></div>
                </td>
            </tr>
        </table>

    </div>
</template>

<script>
    export default {
        props: ['info', 'chartId'],
        data() {
            return {
                plateChart: null
            };
        },
        methods: {
            // 按车牌类型统计表
            plateType(params) {
                return {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}辆 ({d}%)',
                        position: [10, 0]
                    },
                    series: [
                        {
                            name: '车辆数目占比',
                            type: 'pie',
                            radius: '85%',
                            center: ['50%', '50%'],
                            // label: {
                            //     position: 'inside',
                            //     formatter: '{b}\n{c}辆'
                            // },
                            data: [
                                { value: params['difangpai'], name: '地方牌' },
                                { value: params['yueOpai'], name: '粤O牌' },
                                { value: params['yuejingpai'], name: '粤警牌' },
                                { value: params['jingyongmotuochepai'], name: '警用摩托车牌' }
                            ]
                        }
                    ]
                };
            }
        },
        mounted() {
            this.plateChart = this.$echart.init(document.getElementById(this.chartId));
            this.plateChart.setOption(this.plateType(this.info))
        },
        watch: {
            info: function (info) {
                // 根据传来的数据 绘制echarts图
                this.plateChart.setOption(this.plateType(info))
            }
        }
    }
</script>
<style lang="css" scoped>
    .infor-pane {
        width: 100%;

    }

    .infor-pane table {
        width: 100%;
    }

    .infor-pane td {
        text-align: center;
    }
</style>