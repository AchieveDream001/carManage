<template>
    <div class="search-table">
        <div class="search-table-filter">
            车辆过滤：
            <el-radio-group v-model="filterCar" @change="onFilterCar">
                <el-radio label="1">显示全部车辆</el-radio>
                <el-radio label="2">只显示表中车辆</el-radio>
            </el-radio-group>
        </div>
        <el-table :data="carData.slice((currentPage-1)*pageSize,currentPage*pageSize)" size='small' border
            max-height="350">
            <el-table-column label="序号" width="50" type="index"></el-table-column>
            <el-table-column label="车牌号" prop="carNumber">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.carNumber" v-html="scope.row.carNumber">
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="车牌类型" width="100" prop="LICENSE_TYPE_NAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.LICENSE_TYPE_NAME" v-html="scope.row.LICENSE_TYPE_NAME">
                    </span>
                </template>
            </el-table-column> -->
            <el-table-column label="车辆类型" width="100" prop="VEHICLE_CLASS_NAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.VEHICLE_CLASS_NAME" v-html="scope.row.VEHICLE_CLASS_NAME">
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="权属单位" prop="OWN_UNIT_NAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.OWN_UNIT_NAME" v-html="scope.row.OWN_UNIT_NAME">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="使用单位" prop="APPLY_ONAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.APPLY_ONAME" v-html="scope.row.APPLY_ONAME">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="取车人" prop="TAKE_UNAME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.TAKE_UNAME" v-html="scope.row.TAKE_UNAME">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="电话" prop="TAKE_TEL">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.TAKE_TEL" v-html="scope.row.TAKE_TEL">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="取车时间" prop="SEND_TIME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.SEND_TIME"
                        v-html="new Date(scope.row.SEND_TIME).toLocaleString('chinse', { hour12: false })">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="目的地" prop="DEST_PLACE">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.DEST_PLACE" v-html="scope.row.DEST_PLACE">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="申请事由" prop="APPLY_REASON"></el-table-column> -->
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <!-- <el-button @click="highlightRow(scope.row)" type="text" size="small"
                        :disabled='scope.row.rowStatus!=0?false:true' icon="el-icon-location-information" title="高亮">
                    </el-button> -->
                    <el-button @click="trackRow(scope.row)" type="text" size="small"
                        :disabled='scope.row.rowStatus!=0?false:true' icon="el-icon-aim" title="显示轨迹">
                        显示轨迹
                    </el-button>
                    <el-button @click="detailRow(scope.row)" type="text" size="small" icon="el-icon-chat-line-round"
                        title="详情">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
            layout="total,prev, pager, next" :total="carData.length" :pager-count="5">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                onlyShowTable: false,
                carData: [],
                totalCarData: [],
                currentPage: 1,
                pageSize: 8,
                search: '',
                filterCar: '1',
                isShow: false,
            };
        },
        methods: {
            onFilterCar() {
                if (!this.isShow) return;
                if (this.filterCar == '1') {
                    // 显示全部车辆
                    this.$listener.$emit('filterCar', 'all')
                } else {
                    // 只显示表中车辆
                    let resd = [];
                    for (let d of this.carData) {
                        resd.push(d.carNumber);
                    }
                    this.$listener.$emit('filterCar', resd)
                }
            },
            // 点击表格事件
            highlightRow(row) {
                this.$listener.$emit('highlightCar', row)
            },
            watchtRow(row) {
                this.$listener.$emit('watchCar', row)
            },
            trackRow(row) {
                this.$listener.$emit('trackCar', row)
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
            scope.$listener.$on('trackRealSearchTable', function (cardata) {
                scope.carData = cardata;
                scope.onFilterCar();
            })
            this.$listener.$on('changePage', function (type) {
                if (type == 'display') {
                    scope.isShow = false;
                } else {
                    scope.filterCar = '1';
                    scope.onFilterCar();
                    scope.isShow = true;
                }
            });
        }
    }
</script>
<style lang="css" scoped>
    .search-table {
        width: 400px;
        height: calc(100% - 6px);
        background-color: rgb(1, 56, 147);
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px;
    }

    .search-table>>>td {
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

    /* 修改表颜色 */
    .search-table>>>thead th {
        background-color: rgb(1, 56, 147);
        color: white;
        text-align: center;
        font-family: '微软雅黑';
    }

    .search-table>>>.el-table__row:nth-child(odd) {
        background-color: rgb(4, 85, 216);
        color: white;
    }

    .search-table>>>.el-table__row:nth-child(even) {
        background-color: rgb(34, 80, 154);
        color: white;
    }

    .search-table>>>.el-table__row:hover td {
        background-color: rgb(62, 136, 255) !important;
    }

    .search-table>>>.hover-row td {
        background-color: rgb(62, 136, 255) !important;
    }

    .search-table>>>.el-table__empty-block {
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