<template>
    <div class="search-bar  search-bar-pos">
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
                            <th>所属单位：</th>
                            <td>
                                <el-cascader size="small" v-model="unit" :options="unitOptions" filterable clearable
                                    :props="{ expandTrigger: 'hover',checkStrictly: true }" @change="onUnitChange">
                                </el-cascader>
                            </td>
                        </tr>
                        <tr>
                            <th>所在区域：</th>
                            <td>
                                <el-cascader size="small" v-model="region" :options="reigonOptions" filterable clearable
                                    @change="onRegionChange"></el-cascader>
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
                            <th>车辆状态：</th>
                            <td>
                                <el-checkbox-group v-model="checkCarState" size="mini">
                                    <el-checkbox label="on">在线车</el-checkbox>
                                    <el-checkbox label="off">离线车</el-checkbox>
                                </el-checkbox-group>
                            </td>
                        </tr>
                        <!-- <tr>
                            <th>速度范围：</th>
                            <td>
                                <el-input size="mini" v-model="minSpeed" placeholder="最小"></el-input>
                                km/h-
                                <el-input size="mini" v-model="maxSpeed" placeholder="最大"></el-input>km/h
                            </td>
                        </tr> -->
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
                region: 'all',
                reigonOptions: [{ label: '全部区域', value: 'all' }, { label: '福田区', value: '福田区' }, { label: '罗湖区', value: '罗湖区' }, { label: '盐田区', value: '盐田区' },
                { label: '南山区', value: '南山区' }, { label: '宝安区', value: '宝安区' }, { label: '龙岗区', value: '龙岗区' }, { label: '龙华区', value: '龙华区' },
                { label: '坪山区', value: '坪山区' }, { label: '光明区', value: '光明区' }, { label: '大鹏区', value: '大鹏区' }],
                minSpeed: 0,
                maxSpeed: 999,
                checkCarPlateType: ['1', '2', '3', '4'],
                checkCarType: ['1', '2', '3', '4', '5'],
                checkCarState: ['on', 'off'],

                filter: {},

                // 记录表数据
                carData: [],
                totalCarData: [],


            };
        },
        methods: {
            onUnitChange(val) {

            },
            onRegionChange(val) {

            },
            singleSearch: function () {
                this.filter = {
                    carNumber: this.carNumber,
                }
                this.$listener.$emit('openSearchTable');
            },
            reset: function () {
                // 重置筛选栏
                this.maxSpeed = 999;
                this.minSpeed = 0;
                this.checkCarType = ['1', '2', '3', '4', '5'];
                this.checkCarPlateType = ['1', '2', '3', '4'];
                this.region = 'all'
                this.unit = 'all'
            },
            ensure: function () {
                //确定筛选 得到筛选数据 以对象方式发送
                this.filter = {
                    checkCarState: this.checkCarState,
                    checkCarType: this.checkCarType,
                    checkCarPlateType: this.checkCarPlateType,
                    unit: this.unit,
                    region: this.region
                }
                this.$listener.$emit('openSearchTable');
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
            filterCarData: function (filter) {
                let scope = this;
                if (filter.hasOwnProperty('carNumber')) {// 单一查询
                    this.carData = this.totalCarData.filter(data => data.carNumber.toLowerCase().includes(filter.carNumber.toLowerCase()))
                } else if (filter.hasOwnProperty('checkCarType')) {// 高级查询
                    this.carData = this.totalCarData.filter(data => {
                        return (data.VEHICLE_TYPE && filter.checkCarType.includes(data.VEHICLE_TYPE.toString()))
                            && (data.LICENSE_TYPE && filter.checkCarPlateType.includes(data.LICENSE_TYPE.toString()))
                            && (scope.unit == 'all' || scope.unit.length <= 0 || (data.hasOwnProperty('OWN_UNIT_ID') && scope.unit[scope.unit.length - 1] == data.OWN_UNIT_ID.toString()))
                            && ((data.whereRegion && data.whereRegion == scope.region) || scope.region == 'all')
                            && (data.hasOwnProperty('onLineState') && filter.checkCarState.includes(data.onLineState))
                    })
                }
                // 发送搜索结果
                this.$listener.$emit('searchTable', this.carData)
            }
        },
        mounted() {
            let scope = this;
            // 发送搜索结果
            // setTimeout(() => {
            //     this.singleSearch();
            // }, 3000);

            this.$listener.$on('getCarDetail', function (carNumber, cb) {
                if (carNumber == 'all') {
                    if (cb) cb(scope.totalCarData)
                } else if (carNumber) {
                    for (let d of scope.totalCarData) {
                        if (d.carNumber == carNumber) {
                            cb(d);
                            break;
                        }
                    }
                }
            })
            this.$listener.$on('getOnMapCar', function (filter, cb) {
                if (cb) cb(scope.totalCarData.filter(data => filter.checkCarPlateType.includes(data.LICENSE_TYPE.toString()) && data.speed))
            });
            // 得到车辆实时归还数据
            this.$listener.$on('CarInfoData', function (data) {
                let infoData = JSON.parse(data)
                let returnDatas = infoData.data;
                scope.$listener.$emit('warning_time', returnDatas)
            });
            // 当新增车辆时 才更新表数据
            this.$listener.$on('mainUpdateCar_add', function (carData) {
                carData.SEND_TIME = new Date(carData.SEND_TIME).toLocaleString('chinse', { hour12: false })
                scope.totalCarData.push(carData);
                // 更新表格车辆
                scope.filterCarData(scope.filter);
            })
            // 得到组织机构树
            this.$axios.get(this.$config.GET_ORGANIZATION).then(data => {
                scope.unitOptions = scope.unitOptions.concat(data.data)
                scope.$listener.$emit('unitOptions', scope.unitOptions)
            })
        },
        watch: {
            filter: function (nd, od) {
                this.filterCarData(nd);
                this.searchTableShow = true;
            },
            onlyShowTable: function (nd) {
                this.$listener.$emit('filterShowCar', nd);
            }
        }
    }
</script>
<style lang="css" scoped>
    .search-bar {
        width: 330px;
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
        width: 70px;
    }

    .advancedSearchPane table td {
        font-size: 13px;
        text-align: left;
    }

    .advancedSearchPane .el-cascader {
        width: 100%;
    }

    .advancedSearchPane .el-input {
        width: 80px;
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