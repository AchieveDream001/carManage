<template>
    <div class="car-dispatch-table">
        <!-- <div class="search-table-filter">
            车辆过滤：
            <el-radio-group v-model="filterCar" @change="onFilterCar">
                <el-radio label="1">显示全部车辆</el-radio>
                <el-radio label="2">只显示表中车辆</el-radio>
            </el-radio-group>
        </div> -->
        <el-table :data="carData.slice((currentPage-1)*pageSize,currentPage*pageSize)" size='small' border
            max-height="350">
            <el-table-column label="序号" width="50" type="index"></el-table-column>
            <el-table-column label="车牌号" prop="carNumber">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.carNumber" v-html="scope.row.carNumber">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="车牌类型" prop="LICENSE_TYPE_NAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.LICENSE_TYPE_NAME" v-html="scope.row.LICENSE_TYPE_NAME">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="车辆类型" prop="VEHICLE_CLASS_NAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.VEHICLE_CLASS_NAME" v-html="scope.row.VEHICLE_CLASS_NAME">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="权属单位" prop="OWN_UNIT_NAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.OWN_UNIT_NAME" v-html="scope.row.OWN_UNIT_NAME">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="预计花费时间" prop="estimateTime">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.estimateTime" v-html="scope.row.estimateTime">
                    </span>
                    分钟
                </template>
            </el-table-column>
            <el-table-column label="预计到达时间" prop="dispatchTime">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.dispatchTime" v-html="scope.row.dispatchTime">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="预计行驶路程" prop="estimateDistance">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.estimateDistance" v-html="scope.row.estimateDistance">
                    </span>千米
                </template>
            </el-table-column>
            <el-table-column width="230" label="操作">
                <template slot-scope="scope">
                    <el-button @click="highlightRow(scope.row)" type="text" size="small"
                        icon="el-icon-location-information" title="高亮">高亮
                    </el-button>
                    <el-button @click="dispatchRow(scope.row)" type="text" size="small" icon="el-icon-guide"
                        title="规划调度路线">调度路线
                    </el-button>
                    <el-button @click="detailRow(scope.row)" type="text" size="small" icon="el-icon-chat-line-round"
                        title="详情">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
            layout="total,prev, pager, next, jumper" :total="carData.length" :pager-count="5">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                onlyShowTable: false,
                carData: [],
                currentPage: 1,
                pageSize: 5,
                search: '',
                filterCar: '1'
            };
        },
        methods: {
            onFilterCar() {
                if (this.filterCar == '1') {
                    // 显示全部车辆
                    this.$listener.$emit('filterDispatchCar', 'all')
                } else {
                    // 只显示表中车辆
                    let resd = [];
                    for (let d of this.carData.filter(data => data.speed)) {
                        resd.push(d.carNumber);
                    }
                    this.$listener.$emit('filterDispatchCar', resd)
                }
            },
            // 点击表格事件
            highlightRow(row) {
                this.$listener.$emit('highlightDispatchCar', row)
            },
            dispatchRow(row) {
                this.$listener.$emit('dispatchCarPath', row)
            },
            detailRow(row) {
                this.$listener.$emit('carDetail', row)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
            },
        },
        mounted() {
            // 监听搜索栏传来的数据
            let scope = this;
            // 传入的数据里 包含了所有数据 包括未发车 已发车 未申请  最后在表里做了过滤 只显示已发车的数据
            scope.$listener.$on('searchDispatchTable', function (cardata) {
                scope.carData = cardata;
            })
        }
    }
</script>
<style lang="css" scoped>
    .car-dispatch-table {
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        background-color: rgb(1, 56, 147);
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px;
    }

    .car-dispatch-table>>>td {
        padding: 0px !important;
    }


    .overLong {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
    }

    .search-table-filter {
        position: absolute;
        top: -35px;
        left: 90px;
        background-color: white;
        padding: 7px;
        color: white;
        border-radius: 5px;
        font-size: 13px;
        font-weight: 400;
        background-color: rgb(1, 56, 147);
        border: 2px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px
    }

    .search-table-filter>>>.el-radio__label {
        font-size: 13px;
    }

    .car-dispatch-table>>>thead th {
        background-color: rgb(1, 56, 147);
        color: white;
        text-align: center;
        font-family: '微软雅黑';
    }

    .car-dispatch-table>>>.el-table__row:nth-child(odd) {
        background-color: rgb(4, 85, 216);
        color: white;
    }

    .car-dispatch-table>>>.el-table__row:nth-child(even) {
        background-color: rgb(34, 80, 154);
        color: white;
    }

    .car-dispatch-table>>>.el-table__row:hover td {
        background-color: rgb(62, 136, 255) !important;
    }

    .car-dispatch-table>>>.hover-row td {
        background-color: rgb(62, 136, 255) !important;
    }

    .car-dispatch-table>>>.el-table__empty-block {
        color: white !important;
        background-color: rgb(3, 74, 187);

    }

    .el-button {
        color: white;
    }

    .el-pagination>>>span {
        color: white !important;
    }

    .el-radio {
        color: white;
    }
</style>