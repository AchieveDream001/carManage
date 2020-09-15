<template>
    <div class="infor-pane">
        <div :id='chartId' class="question_title_content_chart"></div>
        <div>按区域统计在线车辆数</div>
    </div>
</template>

<script>
    export default {
        props: ['info', 'chartId'],
        data() {
            return { 
                plateChart: null,
                region: ['福田区','罗湖区','盐田区','南山区','宝安区','龙岗区','龙华区','坪山区','光明区', '大鹏区']
            };
        },
        methods: {
            regionCarCount(data) {
                // 绘制已行驶时间柱状图
                return {
                    tooltip: { //提示框组件
                        trigger: 'axis',
                        formatter: '区域：{b}<br />车辆数目: {c0}台',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        textStyle: {
                            color: 'blue',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 13
                        }
                    },
                    grid: {
                        left: '4%',
                        right: '4%',
                        bottom: '3%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.region,
                        axisLabel: {
                            interval:0,
                            textStyle: {
                                color: 'blue',
                                fontStyle: 'normal',
                                fontFamily: '微软雅黑',
                                fontSize: 12,
                                textBorderColor:'white'
                            },
                            rotate: 30,
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true
                        },
                        z: 10
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: 'blue',
                                fontSize: 12,
                                textBorderColor:'white'
                            }
                        }
                    },
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            itemStyle: {
                                color: new this.$echart.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        { offset: 0, color: '#83bff6' },
                                        { offset: 0.5, color: '#188df0' },
                                        { offset: 1, color: '#188df0' }
                                    ]
                                )
                            },
                            emphasis: {
                                itemStyle: {
                                    color: new this.$echart.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            { offset: 0, color: '#2378f7' },
                                            { offset: 0.7, color: '#2378f7' },
                                            { offset: 1, color: '#83bff6' }
                                        ]
                                    )
                                }
                            },
                            data: data
                        }
                    ]
                };
            },
        },
        mounted() {
            this.plateChart = this.$echart.init(document.getElementById(this.chartId));
            this.plateChart.setOption(this.regionCarCount(this.info))
        },
        watch: {
            info: function (info) {
                // 根据传来的数据 绘制echarts图
                this.plateChart.setOption(this.regionCarCount(info))
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