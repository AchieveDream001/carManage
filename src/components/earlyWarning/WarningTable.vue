<template>
    <div class="warning-table">
        <el-dialog title="车辆预警统计" :visible.sync="centerDialogVisible" width="80%" center>
            <table class="tab-filter">
                <tr>
                    <th>查询条件：</th>
                    <td>
                        <el-input placeholder="请输入车牌号、取车人查询" v-model="searchCarNumber" size="small"
                            class="input-with-select searchInput">
                        </el-input>
                    </td>
                    <th>预警类型：</th>
                    <td>
                        <el-checkbox-group v-model="warningType" size="mini">
                            <el-checkbox label="轨迹预警"></el-checkbox>
                            <el-checkbox label="超时预警"></el-checkbox>
                            <el-checkbox label="离深预警"></el-checkbox>
                        </el-checkbox-group>
                    </td>
                    <th>预警时间：</th>
                    <td>
                        <el-date-picker class='daterange' v-model="dateRange" type="daterange" align="right"
                            unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            size="mini">
                        </el-date-picker>
                    </td>
                    <td>
                        <el-button type="primary" @click='onStatistic' size="small">查询</el-button>
                    </td>
                    <td>
                        <el-button type="primary" size="small" @click='exportToExcel'>导出EXCEL</el-button>
                    </td>
                </tr>
            </table>
            <div>
                <el-table id='warningStatisticTable' :data="warningData.filter(data => !search 
    || data.carNumber.includes(search)
    || data.TAKE_UNAME.includes(search)
    || (data.DEST_PLACE?data.DEST_PLACE.includes(search):false)).slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    style="width: 100%" border size='small' :default-sort="{prop: 'date', order: 'descending'}">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="LICENSE_PLATE" label="车牌号" sortable width="120">
                        <template slot-scope="scope">
                            <span class="overLong" :title="scope.row.LICENSE_PLATE" v-html="scope.row.LICENSE_PLATE">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="TAKE_UNAME" label="取车人" width="80">
                        <template slot-scope="scope">
                            <span class="overLong" :title="scope.row.TAKE_UNAME" v-html="scope.row.TAKE_UNAME">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="TAKE_TEL" label="取车人电话" width="120">
                        <template slot-scope="scope">
                            <span class="overLong" :title="scope.row.TAKE_TEL" v-html="scope.row.TAKE_TEL">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DEST_PLACE" label="目的地" width="120">
                        <template slot-scope="scope">
                            <span class="overLong" :title="scope.row.DEST_PLACE" v-html="scope.row.DEST_PLACE">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="APPLY_ONAME" label="申请单位">
                        <template slot-scope="scope">
                            <span class="overLong" :title="scope.row.APPLY_ONAME" v-html="scope.row.APPLY_ONAME">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="WARNING_DATE" label="预警时间" sortable>
                        <template slot-scope="scope">
                            <span class="overLong" :title="scope.row.WARNING_DATE" v-html="scope.row.WARNING_DATE">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="EST_OUT_TIME" label="取车时间" sortable>
                        <template slot-scope="scope">
                            <span class="overLong" :title="scope.row.EST_OUT_TIME" v-html="scope.row.EST_OUT_TIME">
                            </span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="AC_BACK_TIME" label="实际交车时间" sortable>
                    <template slot-scope="scope">
                        <span class="overLong" :title="scope.row.AC_BACK_TIME" v-html="scope.row.AC_BACK_TIME">
                        </span>
                    </template>
                </el-table-column> -->
                    <el-table-column prop="MARK" label="备注">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.MARK" placement="right" effect="light">
                                <el-link class="overLong" type="danger" style="font-size: 13px;">{{scope.row.MARK}}
                                </el-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button @click="detailRow(scope.row)" type="text" size="small"
                                icon="el-icon-chat-line-round" title="详情">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
                layout="total,prev, pager, next, jumper" :total="warningData.length" :pager-count="5">
            </el-pagination>
        </el-dialog>

    </div>
</template>

<script>
    import FileSaver from 'file-saver'

    import XLSX from 'xlsx'
    export default {
        components: { FileSaver, XLSX },
        props: ['type'],
        data() {
            return {
                search: '',
                warningType: [],
                searchCarNumber: '',
                dateRange: '',
                warningData: [],
                currentPage: 1,
                pageSize: 7,
                warningName: '',
                centerDialogVisible: false
            };
        },
        methods: {
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
            },
            detailRow(row) {
                this.$listener.$emit('carDetail', row)
            },
            watchtRow(row) {
                // 如果车辆不在图上 则抛出异常
                let scope = this;
                if (this.$mapState.car[row.LICENSE_PLATE]) {
                    // 得到车辆详情
                    this.$listener.$emit('getCarDetail', row.LICENSE_PLATE, function (d) {
                        scope.$listener.$emit('watchCar', d)
                    })
                } else {
                    this.$message('车辆已离线');
                }
            },
            onStatistic: function () {
                // 根据筛选条件 获取预警数据
                let scope = this;
                this.$axios.get(this.$config.GET_WARNING, {
                    params: {
                        warningType: scope.type == 'warningStatistic' ? scope.warningType : [scope.warningName],
                        LICENSE_PLATE: this.searchCarNumber,
                        warningDate: this.dateRange[0] ? [new Date(this.dateRange[0]).format("yyyy-MM-dd"),
                        new Date(this.dateRange[1]).format("yyyy-MM-dd")] : null,
                    }
                }).then(res => {
                    let data = res.data;
                    for (let d of data) {
                        d.WARNING_DATE = new Date(d.WARNING_DATE).toLocaleString('chinese', { hour12: false })
                        d.EST_OUT_TIME = new Date(d.EST_OUT_TIME).toLocaleString('chinese', { hour12: false })
                        d.EST_BACK_TIME = new Date(d.EST_BACK_TIME).toLocaleString('chinese', { hour12: false })
                    }
                    this.warningData = data;
                })

            },
            getData(warningType) {

            },

            exportToExcel() {
                let div = document.createElement('div');
                let html = '<table>';
                let th = '<tr>';
                let td = '';
                let thContent = [{ label: '车牌号', prop: 'LICENSE_PLATE' }, { label: '取车人', prop: 'TAKE_UNAME' },
                { label: '取车人电话', prop: 'TAKE_TEL' },
                { label: '目的地', prop: 'DEST_PLACE' }, { label: '申请单位', prop: 'APPLY_ONAME' },
                { label: '预警时间', prop: 'WARNING_DATE' },
                { label: '取车时间', prop: 'EST_OUT_TIME' }, { label: '备注', prop: 'MARK' },
                ]
                for (let thc of thContent) {
                    th += `<th>${thc.label}</th>`
                }
                th += '</tr>';

                for (let wd of this.warningData) {
                    td += '<tr>'
                    for (let tdc of thContent) {
                        let cont = wd[tdc.prop];
                        td += `<td>${cont == null ? '' : cont}</td>`
                    }
                    td += '</tr>'
                }
                html = html + th + td + '</table>';
                div.innerHTML = html;
                console.log(div)
                let et = XLSX.utils.table_to_book(div); //此处传入table的DOM节点
                let etout = XLSX.write(et, {
                    bookType: 'xlsx',
                    bookSST: true,
                    type: 'array'
                });
                try {
                    FileSaver.saveAs(new Blob([etout], {
                        type: 'application/octet-stream'
                    }), '车辆预警统计表.xlsx');   //trade-publish.xlsx 为导出的文件名
                } catch (e) {
                    console.log(e, etout);
                }
                return etout;
            },

        },
        mounted() {
            let scope = this;
            this.$listener.$on('changeWarningPage', function () {
                scope.centerDialogVisible = true;
                scope.$refs.watchMag.clearAll();
            })

            switch (this.type) {
                case 'warningMove':
                    scope.warningName = '离深预警'
                    // 监听
                    scope.$listener.$on('addMoveWarning', function (data) {
                        scope.warningData.splice(0, 0, data);
                    });
                    break;
                case 'warningTime':
                    scope.warningName = '超时预警'
                    scope.$listener.$on('addTimeWarning', function (data) {
                        scope.warningData.splice(0, 0, data);
                    });
                    // 模拟一个数据
                    break;
                case 'warningTrack':
                    scope.warningName = '轨迹预警'
                    break;
                case 'warningStatistic':
                    scope.pageSize = 10;
                    break;
            }
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
        }
    }
</script>
<style lang="css" scoped>
    .warning-table>>>.el-dialog {
        z-index: 3000;
        background-color: rgb(1, 56, 147, 0.3);
        border: 3px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 5px;
    }

    .warning-table>>>.el-dialog__title {
        color: blue;
        text-shadow: 1px 1px 5px white, -1px -1px 5px white,
            1px -1px 5px white, -1px 1px 5px white;
        font-size: 18px;
        cursor: default;
    }

    .el-input {
        border: 1px solid black;
        border-radius: 5px;
    }

    .warning-statistic {
        padding: 0px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .tab-filter>>>th {
        width: 80px;
        padding-left: 10px;
        font-size: 15px;
        cursor: default;
        color: white;
    }

    .tab-filter>>>.el-input {
        width: 180px;
    }

    .tab-filter>>>.daterange {
        width: 220px;
    }

    .overLong {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
    }

    .warning-table>>>thead th {

        color: blue;
        text-align: center;
        font-family: '微软雅黑';
    }



    .el-pagination>>>span {
        color: white !important;
    }

    .tab-filter .el-button {
        color: white;
        background-color: rgb(1, 56, 147);
    }

    .tab-filter .el-button:hover {
        background-color: rgb(23, 108, 245);
    }

    .el-checkbox {
        color: white;
    }
</style>