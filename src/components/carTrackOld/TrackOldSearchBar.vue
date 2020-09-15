<template>
    <div class="search-bar search-bar-pos">
        <div>
            <table>
                <tr>
                    <td>
                        <el-input :disabled="searchBarDisabled" @change="singleSearch" size="small"
                            placeholder="请输入车牌号查询" v-model="carNumber" class="input-with-select">
                            <el-button :disabled="searchBarDisabled" slot="append" icon="el-icon-search"
                                @click='singleSearch'>
                            </el-button>
                        </el-input>
                    </td>
                    <td>
                        <el-button ref='advancedSearch' size="small" @click='advancedSearch' type="primary">按条件查询<i
                                ref='advancedSearchI' class="el-icon-arrow-up"></i></el-button>
                    </td>
                </tr>
            </table>
            <el-collapse-transition>
                <div class="advancedSearchPane" ref='advancedSearchPane' v-show="advancedSearchPaneShow">
                    <table border="0">
                        <tr>
                            <th colspan="2" style="width: 100%;padding-left: 8px;">
                                申请日期：
                                <el-date-picker class='daterange' v-model="dateRange" type="daterange" align="right"
                                    unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    size="mini">
                                </el-date-picker>
                            </th>
                        </tr>
                        <tr>
                            <th>所属单位：</th>
                            <td>
                                <el-cascader size="small" v-model="unit" :options="unitOptions" filterable clearable
                                    :props="{ expandTrigger: 'hover' }"></el-cascader>
                            </td>
                        </tr>
                        <tr>
                            <th>车牌类型：</th>
                            <td>
                                <el-checkbox-group v-model="checkCarPlateType" size="mini">
                                    <el-checkbox label="1">地方牌</el-checkbox>
                                    <el-checkbox label="2">粤O牌</el-checkbox>
                                    <el-checkbox label="3">粤警牌</el-checkbox>
                                    <el-checkbox label="4">警用摩托车牌</el-checkbox>
                                </el-checkbox-group>
                            </td>
                        </tr>
                        <tr>
                            <th>车辆类型：</th>
                            <td>
                                <el-checkbox-group v-model="checkCarType" size="mini">
                                    <el-checkbox label="1">小轿车</el-checkbox>
                                    <el-checkbox label="2">越野车</el-checkbox>
                                    <el-checkbox label="3">面包车</el-checkbox>
                                    <el-checkbox label="5">旅行车</el-checkbox>
                                    <el-checkbox label="4">人货车</el-checkbox>
                                </el-checkbox-group>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <el-button-group>
                                    <el-button type="primary" @click='ensure' size='mini'>确定</el-button>
                                    <el-button size='mini' @click='reset'>重置</el-button>
                                </el-button-group>
                            </th>
                        </tr>
                    </table>
                </div>
            </el-collapse-transition>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchBarDisabled: false,
                advancedSearchPaneShow: false,
                searchTableShow: false,
                carNumber: '',
                //筛选条件
                unitOptions: [{ value: 'all', label: '全部单位' }],
                unit: 'all',
                checkCarPlateType: ['1', '2', '3', '4'],
                checkCarState: ['0', '1', '2'],
                checkCarType: ['1', '2', '3', '4', '5'],
                dateRange: '',
                filter: {},
                // 记录表数据
                carData: []
            };
        },
        methods: {

            singleSearch(val) {
                let scope = this;
                this.filterData({
                    apply_date: null,
                    LICENSE_PLATE: this.carNumber,
                    VEHICLE_TYPE: '',
                    LICENSE_TYPE: '',
                    unit: ''
                }, function (data) {
                    scope.carData = data;
                    scope.$listener.$emit('trackOldSearchTable', scope.carData)
                })
            },
            advancedSearch: function () {
                if (this.advancedSearchPaneShow) {
                    this.advancedSearchPaneShow = false
                    this.$refs.advancedSearchI.className = 'el-icon-arrow-up'
                    this.searchBarDisabled = false;
                } else {
                    this.advancedSearchPaneShow = true;
                    this.$refs.advancedSearchI.className = 'el-icon-arrow-down';
                    this.searchBarDisabled = true;
                }
            },
            reset: function () {
                // 重置筛选栏
                //this.dept = 'all';
                //this.useMan = 'all';
                this.maxSpeed = 999;
                this.minSpeed = 0;
                //this.checkCarState = ['0', '1', '2'];
                this.checkCarType = ['1', '2', '3', '4', '5'];
                this.checkCarPlateType = ['1', '2', '3', '4'];
                this.unit = 'all'
            },
            ensure: function () {
                let scope = this;
                this.filterData({
                    apply_date: this.dateRange[0] ? [new Date(this.dateRange[0]).format("yyyy-MM-dd"),
                    new Date(this.dateRange[1]).format("yyyy-MM-dd")] : null,
                    VEHICLE_TYPE: scope.checkCarType,
                    LICENSE_TYPE: scope.checkCarPlateType,
                    unit: this.unit == 'all' ? this.unit : this.unit[this.unit.length - 1]
                }, function (data) {
                    console.log(data)
                    scope.carData = data;
                    scope.$listener.$emit('trackOldSearchTable', scope.carData)
                })
            },
            filterData(condition, cb) {
                // 设置条件筛选 并从数据库返回数据
                this.$axios.get(this.$config.GET_CAR_RETURN, {
                    params: condition
                }).then(data => {
                    for (let d of data.data) {
                        d.AC_BACK_TIME = new Date(d.AC_BACK_TIME).toLocaleString('chinse', { hour12: false })
                        d.SEND_TIME = new Date(d.SEND_TIME).toLocaleString('chinse', { hour12: false })
                        d.apply_date = new Date(d.apply_date).toLocaleString('chinse', { hour12: false })
                        d.carNumber = d.LICENSE_PLATE
                    }
                    if (cb) cb(data.data)
                })
            }

        },
        mounted() {
            let scope = this;
            Date.prototype.format = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1,                 //月份 
                    "d+": this.getDate(),                    //日 
                    "h+": this.getHours(),                   //小时 
                    "m+": this.getMinutes(),                 //分 
                    "s+": this.getSeconds(),                 //秒 
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                    "S": this.getMilliseconds()             //毫秒 
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return fmt;
            }
            scope.$listener.$on('unitOptions', function (val) {
                scope.unitOptions = val
            })
        },
        watch: {

        }
    }
</script>
<style lang="css" scoped>
    .search-bar {

        width: 331px;
        opacity: 1;
    }

    .input-with-select {
        border: 1px solid black;
        border-radius: 5px;
    }

    .closeBtn {
        padding: 1px;
        border: gray 1px solid;
        margin-left: 10px;
        font-size: 18px;
        transform: translate(0, -5px);
    }

    .closeBtn:hover {
        background-color: rgb(194, 192, 192);
        cursor: pointer;
    }

    .advancedSearchPane {
        width: 100%;
        text-align: center;
        color: white;
        padding: -5px;
    }

    .advancedSearchPane table {
        table-layout: fixed;
        cursor: default;
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px
    }

    .advancedSearchPane table tr {
        margin: 10px;
        background-color: rgb(1, 56, 147);
        box-shadow: rgb(108, 227, 253) 1px 0px 5px;
    }

    .advancedSearchPane table th {
        font-size: 13px;
        font-family: '微软雅黑';
        width: 70px;
    }

    .advancedSearchPane table td {
        font-size: 13px;
        text-align: left;
    }

    .advancedSearchPane .el-input {
        width: 95%;
    }

    .advancedSearchPane .el-cascader {
        width: 100%;
    }

    .advancedSearchPane>>>.daterange {
        width: 240px;
    }

    .advancedSearchPane>>>.el-checkbox__label {
        font-size: 13px;
        padding: 3px;
    }

    .speedScope label {
        font-size: 13px;
    }

    .speedScope .el-input {
        width: 80px;
    }

    .searchTable {
        width: 550px;
        background-color: white;
        padding-top: 5px;
    }

    .el-table>>>.weifacheRow {
        background: rgb(252, 195, 178);
    }

    .el-table>>>.yifacheRow {
        background: rgb(182, 252, 179);
    }

    .el-table>>>.weishenqingRow {
        background: rgb(234, 248, 181);
    }

    .tab-notes {
        position: absolute;
        font-size: 12px;
        cursor: default;
    }

    .searchTable>>>.el-checkbox {
        position: absolute;
        left: 210px;

    }

    .searchTable>>>.el-checkbox__label {
        font-size: 13px;
        color: rgb(80, 184, 248);
    }

    .overLong {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
    }

    .el-button {
        color: white;
        background-color: rgb(1, 56, 147);
    }

    .el-button:hover {
        background-color: rgb(23, 108, 245);
    }

    .el-checkbox {
        color: white;
    }
</style>