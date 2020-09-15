<template>
    <div class="search-table">
        <el-table :data="carData.slice((currentPage-1)*pageSize,currentPage*pageSize)" size='small' border
            max-height="350">
            <el-table-column label="序号" width="50" type="index"></el-table-column>
            <el-table-column label="车牌号" width="130" prop="LICENSE_PLATE">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.LICENSE_PLATE" v-html="scope.row.LICENSE_PLATE">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="申请日期" prop="apply_date">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.apply_date" v-html="scope.row.apply_date">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="还车日期" prop="AC_BACK_TIME">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.AC_BACK_TIME" v-html="scope.row.AC_BACK_TIME">
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
            <el-table-column label="所属单位" prop="OWN_UNIT_NAME">
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
            <el-table-column label="取车人电话" prop="TAKE_TEL">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.TAKE_TEL" v-html="scope.row.TAKE_TEL">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="目的地" prop="DEST_PLACE">
                <template slot-scope="scope">
                    <span class="overLong" :title="scope.row.DEST_PLACE" v-html="scope.row.DEST_PLACE">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="出车金额" prop="RECH_MONEY"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="reviewRow(scope.row)" type="text" size="small" icon="el-icon-video-play"
                        title="回放">轨迹回放</el-button>
                    <el-button @click="detailRow(scope.row)" type="text" size="small" icon="el-icon-chat-line-round"
                        title="详情">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
            layout="total,prev, pager, next, jumper"
            :total="carData.filter(data => !search || data.carNumber.toLowerCase().includes(search.toLowerCase())).length"
            :pager-count="5">
        </el-pagination>
        <GaodeService ref='gd'></GaodeService>
    </div>
</template>

<script>
    import GaodeService from '../gaodeService/GaodeService.vue'
    export default {
        components: { GaodeService },
        data() {
            return {
                onlyShowTable: false,
                carData: [],
                totalCarData: [],
                currentPage: 1,
                pageSize: 5,
                search: '',
                testp: []
            };
        },
        methods: {
            // 点击表格事件
            reviewRow(row) {
                // 根据该行的申请日期 和申请id 来获取车辆的行驶记录
                this.$axios.get(this.$config.GET_HISTORY_GPS, {
                    params: {
                        apply_date: row.apply_date,
                        apply_id: row.APPLY_ID
                        // apply_date: '2020/06/18 00:10:00',
                        // apply_id: '17F0AADC58E',
                    }
                }).then(data => {
                    if (data.data.length < 1) {
                        this.$message('无轨迹数据！');
                        return;
                    }
                    this.$listener.$emit('trackReviewInfo', row, data.data)
                })
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
            this.$listener.$on('carPath', function (p) {
                scope.testp = p;
            })
            // 传入的数据里 包含了所有数据 包括未发车 已发车 未申请  最后在表里做了过滤 只显示已发车的数据
            scope.$listener.$on('trackOldSearchTable', function (cardata) {
                scope.carData = cardata;
            })
        }
    }
</script>
<style lang="css" scoped>
    .search-table {
        width: calc(100% - 6px);
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
</style>