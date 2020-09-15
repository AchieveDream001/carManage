<template>
    <div>
        <div class="car-system-title">
            <!-- <img class="bimap-title-logo" src="../assets/carLogo1.png"> -->
            <div class="bimap-title-text">公务车辆可视化管理系统</div>
        </div>
        <div class="car-system-menus">
            <div class="car-system-menu" @click='goDisplay'>
                <span>车辆分布</span>
            </div>
            <div class="car-system-menu" @click='goTrackReal'>
                <span>车辆实时轨迹</span>
            </div>
            <div class="car-system-menu" @click='goTrackOld'>
                <span>车辆历史轨迹</span>
            </div>
            <div class="car-system-menu" @click="goWarningStatistic">
                <span>车辆预警统计</span>
            </div>
            <div class="car-system-menu" @click="goDispatch">
                <span>车辆调度</span>
            </div>
        </div>
        <div class="center-pane">
            <CarDisplay :style="{display:display_show?'':'none'}"></CarDisplay>
            <CarTrackOld :style="{display:track_old_show?'':'none'}"></CarTrackOld>
            <CarDispatch :style="{display:dispatch_show?'':'none'}"></CarDispatch>
        </div>
        <CarManage></CarManage>
        <Websocket></Websocket>
        <Cardetail></Cardetail>
        <DispatchCarManage></DispatchCarManage>
        <WarningTable></WarningTable>
    </div>
</template>

<script>
    import CarDisplay from './CarDisplay.vue';
    import CarTrackOld from './CarTrackOld.vue';
    import WarningTable from '../components/earlyWarning/WarningTable.vue'
    import CarDispatch from './CarDispatch.vue'

    import CarManage from '../components/carManage/CarManage.vue'
    import DispatchCarManage from '../components/carManage/DispatchCarManage.vue'

    import Websocket from '../websocket/Websocket.vue';
    import Cardetail from "../components/dialogTools/carDetail/Cardetail.vue";
    export default {
        components: {
            CarDisplay, CarTrackOld,
            Websocket, Cardetail, CarManage, CarDispatch, DispatchCarManage, WarningTable
        },
        data() {
            return {
                left_pane_show: true,
                display_show: true,
                track_real_show: false,
                track_old_show: false,
                warning_show: false,
                dispatch_show: false,

                trackChildMenu: false,
                warningChildMenu: false,

                totalWarning: 0,
                timeWarning: 0,
                moveWarning: 0,
                trackWarning: 0
            }
        },
        methods: {
            leftPaneShow() {
                this.left_pane_show = true;
                this.$listener.$emit('mapResize')

            },
            leftPaneHide() {
                this.left_pane_show = false;
                this.$listener.$emit('mapResize')
            },
            goDisplay() {
                console.log('000')
                this.$listener.$emit('changePage', 'display')
                this.showMenu('display_show')
                this.$listener.$emit('mapResize');
            },
            goTrackReal() {
                this.$listener.$emit('changePage', 'trackReal')
                this.showMenu('display_show');
                this.$listener.$emit('mapResize');
            },
            goTrackOld() {
                this.trackChildMenu = false;
                this.showMenu('track_old_show')
                this.$listener.$emit('mapResize')

            },
            goTrack(e) {
                this.warningChildMenu = false;
                this.trackChildMenu = !this.trackChildMenu;
                e.stopPropagation();
            },
            goWarning(e) {
                this.trackChildMenu = false;
                this.warningChildMenu = !this.warningChildMenu;
                e.stopPropagation();
            },
            goWarningTrack() {
                this.$listener.$emit('changeWarningPage', 'warningTrack')
                this.warningChildMenu = false;
                this.showMenu('warning_show')
                this.totalWarning = this.totalWarning - this.trackWarning;
                this.trackWarning = 0;
            },
            goWarningMove() {
                this.$listener.$emit('changeWarningPage', 'warningMove')
                this.warningChildMenu = false;
                this.showMenu('warning_show')
                this.totalWarning = this.totalWarning - this.moveWarning;
                this.moveWarning = 0;
            },
            goWarningTime() {
                this.$listener.$emit('changeWarningPage', 'warningTime')
                this.warningChildMenu = false;
                this.showMenu('warning_show')
                this.totalWarning = this.totalWarning - this.timeWarning;
                this.timeWarning = 0;
            },
            goWarningStatistic() {
                this.$listener.$emit('changeWarningPage', 'warningStatistic')
            },
            goDispatch() {
                this.$listener.$emit('mapResize')
                this.warningChildMenu = false;
                this.trackChildMenu = false;
                this.showMenu('dispatch_show')
            },
            showMenu(menuName) {
                this.display_show = false;
                this.track_real_show = false
                this.track_old_show = false
                this.warning_show = false
                this.dispatch_show = false
                this[menuName] = true;
            }
        },
        mounted() {
            let scope = this;
            // 监听实时预警 更新预警信息
            scope.$listener.$on('addTimeWarning', function (data) {
                scope.$notify({
                    title: '警告',
                    message: `'${data.carNumber}'还车超时！预警时间：${new Date().toLocaleString('chinese', { hour12: false })}`,
                    type: 'warning',
                    duration: 0
                });
            });
            scope.$listener.$on('addMoveWarning', function (data) {
                scope.$notify({
                    title: '警告',
                    message: `'${data.carNumber}'离开深圳！预警时间：${new Date().toLocaleString('chinese', { hour12: false })}`,
                    type: 'warning',
                    duration: 0
                });
            });
            scope.$listener.$on('addTrackWarning', function (data) {
                scope.$notify({
                    title: '警告',
                    message: `'${data.carNumber}'轨迹异常！预警时间：${new Date().toLocaleString('chinese', { hour12: false })}`,
                    type: 'warning',
                    duration: 0
                });
            });
        }
    };
</script>
<style lang="css" scoped>
    .left-pane {
        position: absolute;
        left: 0;
        height: 100vh;
        width: 150px;
        background-image: url('../assets/bgimg1.jpg');

        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-size: cover;

        z-index: 101;
    }

    .center-pane {
        position: absolute;
        height: 100vh;
        width: 100vw;
        /* left: 0px;
        right: 0px; */
    }

    .left-pane-hide-btn {
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translate(0, -50%);
        height: 150px;
        padding: 1px !important;
        z-index: 100;
    }

    .left-pane-show-btn {
        position: absolute;
        right: -15px;
        top: 50%;
        transform: translate(0, -50%);
        height: 150px;
        padding: 1px !important;

    }

    .bimap-menu {
        position: absolute;
        top: 150px;
        left: 0;
        width: 100%;
    }

    .bimap-menu img {
        padding-top: 5px;
        width: 30px;
        height: 30px;
    }

    .bimap-menu>div {
        text-align: center;
        width: 100%;
        font-size: 15px;
        color: white;
        text-shadow: 1px 1px 5px rgb(0, 229, 255), -1px -1px 5px rgb(0, 229, 255), 1px -1px 5px rgb(0, 229, 255), -1px 1px 5px rgb(0, 229, 255);
        font-family: "Microsoft YaHei";
        border-top: 1px solid rgb(52, 74, 164);
        border-bottom: 1px solid rgb(52, 74, 164);
        cursor: pointer;
    }

    /* .bimap-menu div:hover {
        background-color: rgb(32, 239, 250);
    } */

    .trackChildMenu {
        position: absolute;
        left: 150px;
        width: 150px;
        top: 78px;
    }

    .warningChildMenu {
        position: absolute;
        left: 150px;
        width: 150px !important;
        top: -50px;
    }

    .one-menu {
        border: 1px rgb(127, 253, 255) double;
        box-shadow: rgb(69, 219, 253) 0px 0px 15px
    }

    .one-menu:hover {
        background-color: rgba(62, 204, 243, 0.5);
    }

    .child-menu {
        padding: 10px;
        font-size: 13px;
        border: 1px rgb(127, 253, 255) solid;
        box-shadow: rgb(69, 219, 253) 0px 0px 15px;
        background-color: rgba(72, 125, 209, 0.9);
        font-weight: 300px;
        width: 150px !important;
    }

    .child-menu img {
        width: 15px;
        height: 15px;
    }

    .child-menu:hover {
        background-color: rgb(32, 239, 250);
    }

    .totalWarning>>>.el-badge__content {
        margin-top: 20px;
        position: absolute;
        margin-right: 30px;
    }

    .timeWarning>>>.el-badge__content {
        margin-top: 20px;
        margin-right: 20px;
    }

    .moveWarning>>>.el-badge__content {
        margin-top: 20px;
        margin-right: 20px;
    }

    .trackWarning>>>.el-badge__content {
        margin-top: 20px;
        margin-right: 20px;
    }


    .car-system-menus {
        position: absolute;
        top: -20px;
        left: 0px;
        font-size: 13px;
        z-index: 2000;
        padding: 10px;
    }

    .car-system-menu {
        display: inline-block;
        padding: 8px;
        z-index: 1000;
        color: rgb(12, 12, 154);
        height: 15px;
        margin: 20px 0;
        border: rgb(104, 104, 245) 1px double;
        border-radius: 50% / 30%;
        text-align: center;
        text-indent: .1em;
        box-shadow: rgb(69, 219, 253) 0px 0px 15px;
        background-color: rgba(51, 75, 169, 0.2);
        text-shadow: 1px 1px 5px white, -1px -1px 5px white,
            1px -1px 5px white, -1px 1px 5px white;
        cursor: pointer;
        font-weight: bold;
    }

    .car-system-menu:hover {
        background-color: turquoise;
    }

    .bimap-title-logo {
        text-align: center;
        width: 40px;
        height: 40px;
        position: absolute;
        top: -20px;
        z-index: 5;
        transform: translate(-50%, 0);
    }

    .bimap-title-text {
        text-align: center;
        font-size: 16px;
        color: blue;
        font-weight:bold;
        text-shadow: 1px 1px 0  white, 1px -1px 0 white,
            -1px -1px 0 white, -1px 1px 0 white;
        font-family: "Microsoft YaHei";
        z-index: 100;
    }

    .car-system-title {
        position: absolute;
        top: 5px;
        left: 50%;
        z-index: 200;
        transform: translate(-50%, 0);
        text-align: center;
        padding: 12px;
        margin-bottom: 6px;
        height: 10px;
        width: 350px;
        letter-spacing: 5px;
    }

    .car-system-title:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 50%;
        background-color: rgba(72, 248, 242, 1);
        border-left: rgb(104, 104, 245) 2px double;
        border-top: rgb(104, 104, 245) 2px double;
        border-bottom: rgb(104, 104, 245) 2px double;
        transform: skew(0deg, 6deg);
        box-shadow: rgb(69, 219, 253) 0px 0px 15px;
        border-radius: 5px 0 0 5px;
        z-index: -1;
        background-image: url('../assets/bgimg111.jpg');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-size: cover;
        opacity: 0.7;
    }

    .car-system-title:after {
        content: '';
        position: absolute;
        border-radius: 0 5px 5px 0;
        top: 0;
        right: 0;
        height: 100%;
        width: 50%;
        background-color: rgba(72, 248, 242, 0.2);
        border-right: rgb(104, 104, 245) 2px double;
        border-top: rgb(104, 104, 245) 2px double;
        border-bottom: rgb(104, 104, 245) 2px double;
        transform: skew(0deg, -6deg);
        box-shadow: rgb(69, 219, 253) 0px 0px 15px;
        z-index: -1;
        background-image: url('../assets/bgimg111.jpg');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-size: cover;
        opacity: 0.7;
    }
</style>