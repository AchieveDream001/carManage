<template>
    <div class="car-track-real">
        <div class="display-center" ref='displayCenter'>
            <Map ref='trackMap' :trackPath='trackPath' :trackInfo=trackInfo></Map>
            <SearchBar style="z-index: 100;"></SearchBar>
        </div>
        <el-button type="primary" title="打开车辆数据表" @click='displayBottomShowBtn' class="display-bottom-show-btn"
            icon="el-icon-arrow-up" size="small">
        </el-button>
        <el-collapse-transition>
            <div class="display-bottom" v-show='displayBottomShow'>
                <SearchTable></SearchTable>
                <el-button type="primary" title="关闭车辆数据表" @click='displayBottomHideBtn' class="display-bottom-hide-btn"
                    icon="el-icon-arrow-down" size="small">
                </el-button>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import SearchBar from "../components/carTrackOld/TrackOldSearchBar.vue";
    import SearchTable from "../components/carTrackOld/TrackOldSearchTable.vue";
    import Map from "../components/carTrackOld/TrackOldMap.vue";
    export default {
        props: ['trackPath', 'trackInfo'],
        data() {
            return {
                displayBottomShow: false,
                displayRightShow: true,
                // 车辆播放
                timeBar: 0,
                timeScale: 1,
                isStart: false,
                isStartIcon: 'el-icon-video-play',
                runTimeScale: 0.0000001,
                runInter: null,
                subTime: 0,
                currentState: {
                    time: 0,
                    speed: 0
                }
            };
        },
        components: { SearchBar, SearchTable, Map },
        methods: {
            displayBottomHideBtn() {
                this.displayBottomShow = false;
                this.$refs.displayCenter.style.bottom = '0px';
                this.$listener.$emit('mapResize')
            },
            displayBottomShowBtn() {
                this.displayBottomShow = true;
                this.$refs.displayCenter.style.bottom = '250px';
                this.$listener.$emit('mapResize')
            },
            displayRightHideBtn() {
                this.displayRightShow = false;
            },
            displayRightShowBtn() {
                this.displayRightShow = true;
            },

            stopRun() {
                this.currentReviewTime = 0;// 时间
                this.curTimeSlot = 0;// 时间点
                this.timeBar = 0;
                this.runTimeScale = 0.0000001;
                this.isStart = false;
                this.isStartIcon = 'el-icon-video-play';
            },
            onStart() {
                this.isStart = !this.isStart;
                this.isStartIcon = this.isStart ? 'el-icon-video-pause' : 'el-icon-video-play';
                this.runTimeScale = this.isStart ? this.timeScale : 0.0000001;
            },
            formatTooltip(val) {
                if (this.trackPath && this.trackPath[0]) {
                    let start = new Date(this.trackPath[0].TIME).getTime();
                    let currentTime = new Date(this.subTime / 100 * val + start).toLocaleString('chinse', { hour12: false });
                    this.currentState.time = currentTime;
                    return currentTime;
                } else {
                    return '';
                }
            },
            onDragBar(val) {
                if (!this.reviewPath || this.reviewPath.path.length < 1) return;
                //this.updateRun();
                // 更改子组件里的动画参数
                // 计算移动进度条后时间和时间段
                this.currentReviewTime = this.subTime / 100 * val;
                this.curTimeSlot = 0;
                for (let i = 0; i < this.reviewPath.millisecond.length - 1; i++) {
                    let oneMill = this.reviewPath.millisecond[i];
                    let twoMill = this.reviewPath.millisecond[i + 1];
                    this.curTimeSlot++;
                    if (this.currentReviewTime + this.reviewPath.millisecond[0] >= oneMill
                        && this.currentReviewTime + this.reviewPath.millisecond[0] <= twoMill) {
                        this.updateRun();
                        console.log(this.currentReviewTime, this.curTimeSlot)
                        break;
                    }

                }
            },
            updateRun() {
                // 当进度条改变 或者 播放速度改变时 动态改变 动画播放参数
                clearInterval(this.runInter);
                let scope = this;
                let step = 5000 / this.subTime;// 得到进度条的运行间隔
                this.runInter = setInterval(() => {
                    scope.timeBar += step;
                    if (scope.currentReviewTime + scope.reviewPath.millisecond[0] >= scope.reviewPath.millisecond[scope.curTimeSlot] - 100
                        && scope.currentReviewTime + scope.reviewPath.millisecond[0] <= scope.reviewPath.millisecond[scope.curTimeSlot] + 100) {
                        scope.$refs.drawCar.addCar({
                            carNumber: scope.trackInfo.carNumber,
                            speed: scope.reviewPath.speed[scope.curTimeSlot],
                            direction: scope.reviewPath.direction[scope.curTimeSlot],
                            coord: scope.reviewPath.path[scope.curTimeSlot]
                        })
                        scope.currentState.speed = scope.reviewPath.speed[scope.curTimeSlot]// 得到当前时间点的速度
                        scope.curTimeSlot += 1;
                    }
                    scope.currentReviewTime += 50;
                }, 50 / scope.runTimeScale);
            },
        },
        mounted() {
            let scope = this;
            scope.$listener.$on('trackOldSearchTable', function () {
                scope.displayBottomShowBtn()
            })
        },
        watch: {
        }
    }
</script>
<style lang="css" scoped>
    .car-track-real {
        width: 100%;
        height: 100vh;
    }

    .display-right {
        background-color: white;
        position: absolute;
        right: 0px;
        top: 0px;
        width: 300px;
        height: calc(100vh - 250px);
    }

    .display-bottom {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: 250px;
        z-index: 100;
        background-color: white;
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
        top: -15px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 150px;
        padding: 1px !important;
    }

    .display-bottom-show-btn {
        width: 150px;
        padding: 1px !important;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 0px;
    }

    .display-right-show-btn {
        height: 150px;
        padding: 1px !important;
        position: absolute;
        top: calc(50% - 125px);
        right: 0px;
        transform: translate(0, -50%);
    }

    .display-right-hide-btn {
        height: 150px;
        padding: 1px !important;
        position: absolute;
        top: 50%;
        left: -17px;
        transform: translate(0, -50%);
    }



    .watch-info img {
        padding: 20px;
        width: 20px;
        height: 20px;
    }
</style>