<template>
    <div class="car-dispatch">
        <div class="display-center">
            <CarDispatchMap></CarDispatchMap>
            <CarDispatchSearchBar style="z-index: 10;"></CarDispatchSearchBar>
        </div>
        <el-button type="primary" title="打开车辆数据表" @click='displayBottomShowBtn' class="display-bottom-show-btn"
            icon="el-icon-arrow-up" size="small">
        </el-button>
        <el-collapse-transition>
            <div class="display-bottom" v-show='displayBottomShow'>
                <CarDispatchTable></CarDispatchTable>
                <el-button type="primary" title="关闭车辆数据表" @click='displayBottomHideBtn' class="display-bottom-hide-btn"
                    icon="el-icon-arrow-down" size="small">
                </el-button>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import CarDispatchSearchBar from '../components/carDispatch/CarDispatchSearchBar.vue'
    import CarDispatchTable from '../components/carDispatch/CarDispatchTable.vue'
    import CarDispatchMap from '../components/carDispatch/CarDispatchMap.vue'
    export default {
        components: { CarDispatchTable, CarDispatchSearchBar, CarDispatchMap },
        data() {
            return {
                displayBottomShow: false,
                displayRightShow: true
            };
        },
        methods: {
            displayBottomShowBtn() {
                this.displayBottomShow = true;
                document.getElementsByClassName('display-center')[2].style.bottom = '250px';
                this.$listener.$emit('mapResize')
            },
            displayBottomHideBtn() {
                this.displayBottomShow = false;
                document.getElementsByClassName('display-center')[2].style.bottom = '0px';
                this.$listener.$emit('mapResize')
            }
        },
        mounted() {
            let scope = this;
            scope.$listener.$on('searchDispatchTable', function () {
                scope.displayBottomShowBtn()
            })
        }
    }
</script>
<style lang="css" scoped>
    .car-dispatch {
        background-color: greenyellow;
    }

    .display-center {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 0px;
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

    .display-bottom-hide-btn {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 150px;
        padding: 1px !important;
        z-index: 2;
    }

    .display-bottom-show-btn {
        width: 150px;
        padding: 1px !important;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 0px;
        z-index: 1;
    }
</style>