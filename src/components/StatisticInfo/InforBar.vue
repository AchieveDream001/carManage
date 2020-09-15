<template>
    <div class="infor-pane">
        <div :id='chartId' class="question_title_content_chart"></div>
        <div style="margin-top: -20px;">按车牌类型统计</div>
    </div>
</template>

<script>
    export default {
        props: ['info', 'ischange', 'chartId', 'outLineInfo', 'onLineInfo', 'totalInfo'],
        data() {
            return {
                plateChart: null,
                data: {},
                labelOption: {
                    show: true,
                    position: 'insideBottom',
                    distance: 15,
                    align: 'left',
                    verticalAlign: 'middle',
                    rotate: 90,
                    formatter: '{c}  {name|{a}}',
                    fontSize: 12,
                    rich: {
                        name: {
                            textBorderColor: '#fff'
                        }
                    }
                }
            };
        },
        methods: {
            // 按车牌类型统计表
            plateType(data) {
                // 绘制已行驶时间柱状图
                return {
                    color: ['rgb(16, 16, 165)', 'rgb(89, 226, 89)', 'rgb(127, 127, 127)'],
                    legend: {
                        data: ['总数', '在线数', '离线数']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },textStyle:{
                            color:'blue'
                        }
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '3%',
                        top: '15%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['地方牌', '粤O牌', '粤警牌', '警用摩托车牌'],
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
                                fontSize: 13,
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
                            name: '总数',
                            barGap: 0,
                            // label: this.labelOption,
                            type: 'bar',
                            data: this.data.total
                        }, {
                            name: '在线数',
                            //label: this.labelOption,
                            type: 'bar',
                            data: this.data.online
                        }, {
                            name: '离线数',
                            // label: this.labelOption,
                            type: 'bar',
                            data: this.data.outline
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
            ischange: function () {
                this.data = {
                    total: [this.totalInfo.difangpai, this.totalInfo.yueOpai, this.totalInfo.yuejingpai, this.totalInfo.jingyongmotuochepai],
                    online: [this.onLineInfo.difangpai, this.onLineInfo.yueOpai, this.onLineInfo.yuejingpai, this.onLineInfo.jingyongmotuochepai],
                    outline: [this.outLineInfo.difangpai, this.outLineInfo.yueOpai, this.outLineInfo.yuejingpai, this.outLineInfo.jingyongmotuochepai]
                }
                this.plateChart.setOption(this.plateType())
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
        color: rgb(89, 226, 89);
    }
</style>