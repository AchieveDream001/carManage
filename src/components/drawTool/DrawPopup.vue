<template>
    <div class="">
        <div ref="carInfo" style="display: none;">
            <div class="carInfo" id="pupup_carinfo">
                <table>
                    <tr>
                        <td>车牌号：</td>
                        <td>{{carInfo.carNumber}}</td>
                    </tr>
                    <tr>
                        <td>车辆类型：</td>
                        <td>{{carInfo.VEHICLE_CLASS_NAME}}</td>
                    </tr>
                    <tr>
                        <td>所属单位：</td>
                        <td>{{carInfo.OWN_UNIT_NAME}}</td>
                    </tr>
                    <tr>
                        <td>车辆操作：</td>
                        <td>
                            <el-button class="popup_detailRow" @click="detailRow" type="text" size="small"
                                icon="el-icon-chat-line-round" title="详情">详情</el-button>
                            <el-button class="popup_trackRow" @click="trackRow" type="text" size="small"
                                icon="el-icon-aim" title="显示轨迹">显示轨迹</el-button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div>
            <div ref="stopInfo" style="display: none;">
                <div class="carInfo">
                    <table>
                        <tr>
                            <td>速度：</td>
                            <td>{{stopInfo.speed}}km/h</td>
                        </tr>
                        <tr>
                            <td>时间：</td>
                            <td>{{stopInfo.time}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div ref="warningPoint" style="display: none;">
            <div class="carInfo">
                <table>
                    <tr>
                        <td>车牌号：</td>
                        <td>{{warningInfo.carNumber}}</td>
                    </tr>
                    <tr>
                        <td>司机：</td>
                        <td>{{warningInfo.TAKE_UNAME}}</td>
                    </tr>
                    <tr>
                        <td>司机电话：</td>
                        <td>{{warningInfo.TAKE_TEL}}</td>
                    </tr>
                    <tr>
                        <td>速度：</td>
                        <td>{{warningInfo.speed}}km/h</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                _carInfoPopup: null,// 车辆信息弹框
                _pathLinePopup: null,// 路线弹框
                _warningLinePopup: null,// 警报路线弹框
                _warningPointPopup: null,// 警报点弹框
                _stopPointPopup: null,// 经停点弹框
                _multWarningPopup: {},// 多个警报点信息同时显示
                // 信息内容
                carInfo: {},
                warningInfo: {},
                map: null,
                stopInfo: {}
            };
        },
        methods: {
            addCarInfoPopup(params) {
                if (this.option && this.option.hasOwnProperty('showPopup')) {
                    return
                }
                let scope = this;
                this.clear();
                this.carInfo = JSON.parse(params.carInfo);
                this.$listener.$emit('getCarDetail', this.carInfo.carNumber, (res) => {
                    scope.carInfo = res;
                    setTimeout(() => {
                        let carInfoHtml = this.$refs.carInfo.innerHTML;
                        scope._carInfoPopup.setLngLat(params.lnglat)
                            .setHTML(carInfoHtml)
                            .setMaxWidth("600px")
                            .addTo(scope.map);
                        // document.getElementsByClassName('popup_highlightRow')[0].onclick = scope.highlightRow;
                        // document.getElementsByClassName('popup_watchRow')[0].onclick = scope.watchtRow;
                        document.getElementsByClassName('popup_trackRow')[0].onclick = scope.trackRow;
                        document.getElementsByClassName('popup_detailRow')[0].onclick = scope.detailRow;
                    }, 100);
                })

            },
            // 经停点信息
            addStopPointPopup(params) {
                let scope = this;
                this.clear();
                this.stopInfo = params.stopInfo;
                setTimeout(() => {
                    let carInfoHtml = this.$refs.stopInfo.innerHTML;
                    scope._stopPointPopup.setLngLat(params.lnglat)
                        .setHTML(carInfoHtml)
                        .setMaxWidth("600px")
                        .addTo(scope.map);
                }, 100);
            },
            // 增加车辆调度信息
            addWarningPopup(carInfo) {
                let scope = this;
                scope.warningInfo = carInfo;
                setTimeout(() => {
                    let warningInfoHtml = this.$refs.warningPoint.innerHTML;
                    scope._warningPointPopup.setLngLat(carInfo.coord)
                        .setHTML(warningInfoHtml)
                        .setMaxWidth("600px")
                        .addTo(scope.map);
                }, 100);
            },
            // 同时显示多个车辆调度信息
            multWarningPopup(carInfo) {
                // 为每个车辆创建一个popup
                this._multWarningPopup[carInfo.carNumber] = new this.$mapboxgl.Popup({ closeButton: false, className: 'carInfo1' });
                this.warningInfo = carInfo;
                setTimeout(() => {
                    let warningInfoHtml = this.$refs.warningPoint.innerHTML;
                    this._multWarningPopup[carInfo.carNumber].setLngLat(carInfo.coord)
                        .setHTML(warningInfoHtml)
                        .setMaxWidth("600px")
                        .addTo(this.map);
                }, 100);
            },
            _initPupup() {
                this._carInfoPopup = new this.$mapboxgl.Popup({ closeButton: false, className: 'carInfo1' })
                this._stopPointPopup = new this.$mapboxgl.Popup({ closeButton: false, className: 'trackoldInfo' })
                this._warningPointPopup = new this.$mapboxgl.Popup({ closeButton: false, className: 'carInfo1' });
            },
            initLayer(map, option) {
                this.map = map;
                this.option = option;
            },
            clear() {
                this._carInfoPopup.remove();
                this._stopPointPopup.remove();
                this._warningPointPopup.remove();
                for (let mp in this._multWarningPopup) {
                    this._multWarningPopup[mp].remove();
                }
                this._multWarningPopup = {};
            },
            // 点击按钮事件
            highlightRow(row) {
                this.clear()
                this.$listener.$emit('highlightCar', this.carInfo)
            },
            watchtRow(row) {
                this.$listener.$emit('watchCar', this.carInfo)
            },
            trackRow(row) {
                this.clear()
                this.$listener.$emit('trackCar', this.carInfo)
            },
            detailRow(row) {
                this.clear()
                this.$listener.$emit('carDetail', this.carInfo)
            },
        },
        mounted() {
            // 绘制各种样式的信息弹出框
            this._initPupup();
        }
    }
</script>
<style lang="css" scoped>
    .carInfo {
        background-color: #3756c7;
        padding: 2px;
        padding-right: 7px;
        margin: -10px;
        margin-bottom: -15px;
        border-radius: 5px;
        border: 2px solid #8ef9ff;
        font-family: 微软雅黑;
        font-size: 12px;
        color: white;
    }

    .popup_trackRow,
    .popup_detailRow {
        color: white;
    }

    .carInfo table td:nth-child(odd) {
        text-align: right;
    }

    .carInfo table td:nth-child(even) {
        text-align: left;
    }
</style>