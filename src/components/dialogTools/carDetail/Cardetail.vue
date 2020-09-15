<template>
    <div class="car-detail">
        <el-dialog title="车辆信息详情" :visible.sync="centerDialogVisible" width="80%" center>
            <div>
                <el-tabs type="card">
                    <el-tab-pane label="车辆基本信息">
                        <CarInfo :myinfo='info'></CarInfo>
                    </el-tab-pane>
                    <el-tab-pane label="车辆申请信息">
                        <CarApply :myinfo='info'></CarApply>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import CarInfo from './CarInfo.vue'
    import CarApply from './CarApply.vue'
    export default {
        name: 'cardetail',
        components: { CarInfo, CarApply },
        data() {
            return {
                centerDialogVisible: false,
                info: null
            };
        },
        methods: {
        },
        mounted() {
            let scope = this;
            scope.$listener.$on("carDetail", (row) => {
                if (scope.info == null) {
                    scope.info = { a: 1 };
                    setTimeout(() => {
                        scope.info = row;
                    }, 10);
                } else {
                    scope.info = row;
                }
                // 这里得到行数据
                scope.centerDialogVisible = true;
            });
        }
    };
</script>
<style lang="css" scoped>
    .car-detail>>>.el-dialog {
        z-index: 3000;
        color: white !important;
        background-color: rgb(1, 56, 147, 0.1);
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px;
    }

    .car-detail>>>.el-dialog__title {
        color: white;
        text-shadow: 1px 1px 5px rgb(0, 229, 255), -1px -1px 5px rgb(0, 229, 255), 1px -1px 5px rgb(0, 229, 255), -1px 1px 5px rgb(0, 229, 255);
        font-size: 18px;
        cursor: default;
    }


    .car-detail>>>.is-active {
        color: white !important;
    }

    .car-detail>>>.el-tabs__item {
        color: rgb(184, 166, 166);
    }

    .car-detail>>>.el-tabs__item:hover {
        color: rgb(108, 227, 253);
    }

    .car-detail>>>.el-tabs__content {
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 35px;
    }
</style>