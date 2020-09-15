<template>
    <div class="search-bar  search-bar-pos">
        <div>
            <table>
                <tr>
                    <td></td>
                </tr>
            </table>
            <div class="advancedSearchPane" ref='advancedSearchPane' v-show="advancedSearchPaneShow">
                <div @click='onShowDispatch' class="show-dispatch">
                    点击设置车辆调度条件 <i class="el-icon-edit"></i></div>
                <transition name="el-zoom-in-top">
                    <table v-show='dispatch_table_show' border="0">
                        <tr>
                            <th>调度目的地：</th>
                            <td>
                                <el-autocomplete size="mini" class="inline-input" v-model="destination"
                                    :fetch-suggestions="querySearch" placeholder="请输入调度目的地" :trigger-on-focus="false"
                                    @select="handleSelect">
                                </el-autocomplete>
                            </td>
                        </tr>
                        <tr>
                            <th>缓冲区半径：</th>
                            <td>
                                <el-input style="width: 170px;" size="mini" v-model="distance" placeholder="请输入缓冲区半径">
                                </el-input>
                                米
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
                            <th colspan="2">
                                <el-button-group>
                                    <el-button type="primary" @click='ensure' size='mini'>查询可调度车辆</el-button>
                                    <el-button size='mini' @click='reset'>重置调度条件</el-button>
                                </el-button-group>
                            </th>
                        </tr>
                    </table>
                </transition>
            </div>

        </div>
        <GaodeService ref='gaode'></GaodeService>
    </div>
</template>

<script>
    import GaodeService from '../gaodeService/GaodeService.vue'
    export default {
        components: { GaodeService },
        data() {
            return {
                searchBarDisabled: false,
                advancedSearchPaneShow: true,
                searchTableShow: false,
                carNumber: '',

                dispatch_table_show: false,
                //筛选条件
                checkCarPlateType: ['1', '2', '3', '4'],
                distance: 1000,
                destination: '',
                // 记录表数据
                carData: [],
                totalCarData: [],
                allDestination: {
                    "value": "深圳市局大院", "coord": [114.19768515082933, 22.65344925076326]
                }
            };
        },
        methods: {
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            querySearch(queryString, cb) {
                let scope = this;
                if (this.$config.SERVICE_POSITION) {
                    // 根据服务得到模糊搜索结果
                    this.$axios.get(this.$config.SERVICE_POSITION, {
                        params: {
                            key: scope.$config.KEY,
                            keywords: queryString
                        }
                    }).then(data => {
                        for (let d of data.data.data) {
                            d.value = d.name;
                            d.coord = [parseFloat(d.x), parseFloat(d.y)];
                        }
                        cb(data.data.data);
                    })
                } else {
                    let result = [
                        { "value": "深圳市局大院", "coord": [114.19768515082933, 22.65344925076326] },
                        { "value": "罗湖分局", "coord": [114.09768515082933, 22.65044925076326] }]
                    cb(result)
                }
            },
            handleSelect(item) {
                item.coord = [parseFloat(item.coord[0]), parseFloat(item.coord[1])];
                this.allDestination = item
            },
            onShowDispatch: function () {
                this.dispatch_table_show = !this.dispatch_table_show
            },
            reset: function () {
                // 重置筛选栏
                this.destination = '';
                this.distance = 1000;
                this.checkCarPlateType = ['1', '2', '3', '4'];
            },
            ensure: function () {
                if (!this.allDestination.coord || !this.distance) {
                    this.$message.error('请输入正确的目的地或车辆数目')
                    return;
                }
                // 根据调用的车辆数和车辆地点 和搜索条件开始调度车辆
                // 需要利用调度模型 得到调度车辆的基本信息 和调度车辆的调度信息
                // 调度模型为：根据输入的地点得到目的地的经纬度 遍历所有车辆 筛选出离目的地最近的几辆车 并且根据车牌号过滤车辆
                // 计算车辆的调度信息 并返回车辆调度信息和车辆基本信息
                // 这里模拟一个坐标 并返还车辆
                this.startDispatch();
            },
            computeDistance(coords) {

            },
            getPlanPath(startP, endP) {
                // 根据服务得到规划路线
                // 这里先模拟直线为规划路线
                // 返回规划的路线点串 和 预计行驶的时间 和预计行驶的距离  和预计到达的时间点
                let coords = [startP, endP];
                let distance = parseFloat(this.$turf.lineDistance({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coords
                    }
                }).toLocaleString());
                let time = new Date(new Date().getTime() + 1000).toLocaleString('chinese', { hour12: false });
                return {
                    planPath: coords,
                    estimateDistance: distance,
                    estimateTime: time,
                    dispatchTime: new Date().toLocaleString('chinese', { hour12: false })
                }
            },
            // 开始调度
            startDispatch() {
                let scope = this;
                this.$listener.$emit('getCarDetail', 'all', function (totalData) {
                    let data = totalData.filter(data => data.speed)
                    let res = [];
                    // 遍历所有车辆数据 搜索指定车牌类型  缓冲区内的车辆
                    for (let d of data) {
                        if (!d.LICENSE_TYPE) continue;
                        // 根据经纬度计算距离目的地的距离
                        if (d.speed && scope.checkCarPlateType.includes(d.LICENSE_TYPE.toString())) {
                            let distance = parseFloat(scope.$turf.lineDistance({
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': [scope.allDestination.coord, scope.$refs.gaode.gcj02towgs84(d.coord[0], d.coord[1])]
                                }
                            }).toLocaleString());
                            if (distance * 1000 <= scope.distance) {
                                res.push(d);
                            }
                        }
                    }
                    // 对选中的车辆做路径规划得到路径规划的结果
                    if (scope.$config.SERVICE_PATH) {
                        let allResult = [];
                        for (let r of res) {
                            let wgscoord = scope.$refs.gaode.gcj02towgs84(r.coord[0], r.coord[1])
                            allResult.push(new Promise(resolve => {
                                scope.$axios.get(scope.$config.SERVICE_PATH, {
                                    params: {
                                        key: scope.$config.KEY,
                                        start: wgscoord[0] + ' ' + wgscoord[1],
                                        end: scope.allDestination.coord[0] + ' ' + scope.allDestination.coord[1]
                                    }
                                }).then(d => {
                                    if (!d.data.data) return
                                    let path = [];
                                    let coords = d.data.data.lines[0].geometry.coordinates;
                                    for (let cd of coords) {
                                        path.push(scope.$refs.gaode.wgs84togcj02(cd[0], cd[1]))
                                    }
                                    r.planPath = path;
                                    r.estimateTime = (d.data.data.lines[0].duration / 60).toFixed(2);// 预计花费时间
                                    r.estimateDistance = d.data.data.lines[0].distance / 1000;// 预计花费路程
                                    r.dispatchTime = new Date(new Date().getTime() + r.estimateTime * 60000).toLocaleString('chinese', { hour12: false })   // 预计到达时间
                                    resolve(r);
                                })
                            }))
                        }
                        Promise.all(allResult).then(value => {
                            scope.$listener.$emit('searchDispatchTable', value, scope.allDestination, scope.distance)
                        })
                    } else {
                        for (let r of res) {
                            r.planPath = [r.coord, scope.allDestination.coord];
                            r.estimateTime = 20;// 预计花费时间 分钟
                            r.estimateDistance = 4;// 预计花费路程 千米
                            r.dispatchTime = new Date(new Date().getTime() + r.estimateTime * 60000).toLocaleString('chinese', { hour12: false })   // 预计到达时间
                        }
                        scope.$listener.$emit('searchDispatchTable', res, scope.allDestination, scope.distance)
                    }
                })
            }
        },
        mounted() {
            let scope = this;

        },
        watch: {
        }
    }
</script>
<style lang="css" scoped>
    .search-bar {
        width: 300px;
        opacity: 1;
    }

    .show-dispatch {
        width: 100%;
        font-size: 15px;
        font-weight: bold;
        padding: 5px;
        cursor: pointer;
    }

    .show-dispatch:hover {
        text-shadow: 1px 1px 5px rgb(0, 229, 255), -1px -1px 5px rgb(0, 229, 255), 1px -1px 5px rgb(0, 229, 255), -1px 1px 5px rgb(0, 229, 255);

    }

    .input-with-select {
        border: 1px solid black;
        border-radius: 5px;
    }

    .advancedSearchPane {
        width: 100%;
        text-align: center;
        border-radius: 10px;
        cursor: default;
        background-color: rgb(1, 56, 147);
        color: white;

        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px
    }

    .advancedSearchPane table {
        table-layout: fixed;
        cursor: default;
    }

    .advancedSearchPane table tr {
        margin: 10px;
        background-color: rgb(1, 56, 147);
        box-shadow: rgb(108, 227, 253) 1px 0px 5px;
    }

    .advancedSearchPane table th {
        font-size: 13px;
        width: 100px;
    }

    .advancedSearchPane table td {
        font-size: 13px;
        text-align: left;
    }

    .advancedSearchPane .el-cascader {
        width: 120px;
    }

    .advancedSearchPane .el-input {
        width: 99%;
    }

    .advancedSearchPane .el-autocomplete {
        width: 99%;
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
        padding-top: 5px;
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