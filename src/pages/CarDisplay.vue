<template>
    <div class="car-display">
        <div class="display-center">
            <Map></Map>
            <div ref='statistic_search'>
                <SearchBar></SearchBar>
            </div>
            <div ref='track_search'>
                <TrackRealSearchBar></TrackRealSearchBar>
            </div>
        </div>
        <div ref='statistic'>
            <el-button type="primary" title="打开车辆统计信息" @click='displayRightShowBtn' class="display-right-show-btn"
                icon="el-icon-arrow-left" size="small">
            </el-button>
            <div class="statistic-info-title">
                <span> <img src="../assets//total.png" alt="">车辆总数：{{carTotal}}</span>
                <span> <img src="..//assets//online.png" alt="">在线车辆：{{carOnLine}}</span>
                <span><img src="../assets//outline.png" alt="">离线车辆：{{carOutLine}}</span>
            </div>
            <transition name="el-zoom-in-right">
                <div class="display-right" v-show='displayRightShow'>
                    <StatisticInfor></StatisticInfor>
                    <el-button type="primary" title="关闭车辆统计信息" @click='displayRightHideBtn'
                        class="display-right-hide-btn" icon="el-icon-arrow-right" size="small">
                    </el-button>
                </div>
            </transition>
        </div>
        <div ref='statistic_tab'>
            <el-button type="primary" title="打开车辆数据表" @click='displayBottomShowBtn' class="display-bottom-show-btn"
                icon="el-icon-arrow-up" size="small">
            </el-button>
            <el-collapse-transition>
                <div class="display-bottom" v-show='displayBottomShow'>
                    <SearchTable></SearchTable>
                    <el-button type="primary" title="关闭车辆数据表" @click='displayBottomHideBtn'
                        class="display-bottom-hide-btn" icon="el-icon-close" size="small">
                    </el-button>
                </div>
            </el-collapse-transition>
        </div>
        <div ref='trackInfo'>
            <el-button type="primary" title="打开车辆跟踪信息" @click='displayRightShowBtn' class="display-right-show-btn"
                icon="el-icon-arrow-left" size="small">
            </el-button>
            <transition name="el-zoom-in-right">
                <div class="display-right" v-show='displayRightShow'>
                    <TrackRealInfo></TrackRealInfo>
                    <el-button type="primary" title="关闭车辆跟踪信息" @click='displayRightHideBtn'
                        class="display-right-hide-btn" icon="el-icon-arrow-right" size="small">
                    </el-button>
                </div>
            </transition>
        </div>
        <div ref='track_tab'>
            <el-button type="primary" title="打开车辆数据表" @click='displayBottomShowBtn' class="display-bottom-show-btn"
                icon="el-icon-arrow-up" size="small">
            </el-button>
            <el-collapse-transition>
                <div class="display-bottom" v-show='displayBottomShow'>
                    <TrackRealSearchTable></TrackRealSearchTable>
                    <el-button type="primary" title="关闭车辆数据表" @click='displayBottomHideBtn'
                        class="display-bottom-hide-btn" icon="el-icon-close" size="small">
                    </el-button>
                </div>
            </el-collapse-transition>
        </div>
    </div>
</template>

<script>
    import SearchBar from "../components/carDisplay/SearchBar.vue";
    import SearchTable from "../components/carDisplay/SearchTable.vue";
    import StatisticInfor from "../components/carDisplay/StatisticInfor.vue";
    import Map from "../components/carDisplay/PoliceMap.vue";
    import TrackRealSearchBar from '../components/carTrackReal/TrackRealSearchBar.vue';
    import TrackRealSearchTable from '../components/carTrackReal/TrackRealSearchTable.vue';
    import TrackRealInfo from '../components/carTrackReal/TrackRealInfo.vue'
    export default {
        data() {
            return {
                displayBottomShow: false,
                displayRightShow: true,
                carTotal: 500,
                carOnLine: 0,
                carOutLine: 500
            };
        },
        // 这里的实时轨迹和车辆可视化共用一套界面
        props: [],
        components: { SearchBar, SearchTable, Map, StatisticInfor, TrackRealSearchBar, TrackRealSearchTable, TrackRealInfo },
        methods: {
            displayBottomHideBtn() {
                this.displayBottomShow = false;
            },
            displayBottomShowBtn() {
                this.displayBottomShow = true;
            },
            displayRightHideBtn() {
                this.displayRightShow = false;
                document.getElementsByClassName('display-right-show-btn')[0].style.opacity = '0.5';
                document.getElementsByClassName('display-right-show-btn')[1].style.opacity = '0.5';
            },
            displayRightShowBtn() {
                this.displayRightShow = true;
                document.getElementsByClassName('display-right-show-btn')[0].style.opacity = '0';
                document.getElementsByClassName('display-right-show-btn')[1].style.opacity = '0';
            },
            showPage(type) {
                this.$refs.statistic_search.style.display = (type == 'display' ? '' : 'none');
                this.$refs.statistic_tab.style.display = (type == 'display' ? '' : 'none');
                this.$refs.statistic.style.display = (type == 'display' ? '' : 'none');

                this.$refs.track_search.style.display = (type == 'display' ? 'none' : '');
                this.$refs.trackInfo.style.display = (type == 'display' ? 'none' : '');
                this.$refs.track_tab.style.display = (type == 'display' ? 'none' : '');
                this.displayRightShow = true;
                //type == 'display' ? null : this.displayRightShow = false;
            }
        },
        mounted() {
            // 每当切换时 就重置地图状态
            let scope = this;
            this.showPage('display');
            this.$listener.$on('changePage', function (type) {
                if (type == 'display') {
                    // 清除地图上的路径 隐藏统计路径
                    scope.showPage('display');
                } else {
                    scope.showPage('');
                }
            });
            this.$listener.$on('trackCar', function () {
                scope.displayRightShow = true;
            })
            scope.$listener.$on('openSearchTable', function () {
                scope.displayBottomShowBtn()
            });
            scope.$listener.$on('getCarStatistic', function (carTotal, carOnLine, carOutLine) {
                scope.carTotal = carTotal;
                scope.carOnLine = carOnLine;
                scope.carOutLine = carOutLine
            })
        }
    }
</script>
<style lang="css" scoped>
    .car-display {
        width: 100%;
        height: 100vh;
    }

    .display-right {
        position: absolute;
        right: 0px;
        top: 40px;
        height: calc(100vh - 40px);
    }

    .display-bottom {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 400px;
        height: 350px;
        z-index: 100;
    }

    .display-center {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 0px;
    }

    .display-bottom-hide-btn {
        position: absolute;
        top: -33px;
        left: 335px;
        font-size: 18px;
        width: 70px;
        height: 32px;
        padding: 1px !important;

    }

    .display-bottom-show-btn {
        width: 150px;
        padding: 1px !important;
        position: absolute;
        left: 200px;
        transform: translate(-50%, 0);
        bottom: 0px;
        opacity: 0.5;
    }

    .display-right-show-btn {
        height: 150px;
        padding: 1px !important;
        position: absolute;
        top: 100px;
        right: 0px;
        opacity: 0;
    }

    .display-right-hide-btn {
        height: 150px;
        padding: 1px !important;
        position: absolute;
             top: 100px;
        width: 15px;
        left: -8px;
        opacity: 0.5;
    }

    .display-right-hide-btn:hover,
    .display-right-show-btn:hover {
        opacity: 1;
    }

    .statistic-info-title img {
        padding: 0px 10px 0px 10px;
        width: 20px;
        height: 20px;
    }

    .statistic-info-title {
        position: absolute;
        right: 0;
        top: 10px;
        right: 1px;
        top: 1px;
        font-size: 14px;
           text-shadow: 1px 1px 0  white, 1px -1px 0 white,
            -1px -1px 0 white, -1px 1px 0 white;
        color: rgb(45, 56, 252);
        cursor: default;
            background-color: rgba(72, 189, 248, 0.3);
        border-radius: 10px;
        padding: 5px;
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px
    }
</style>