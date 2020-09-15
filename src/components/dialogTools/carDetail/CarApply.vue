<template>
    <div class="car-apply">
        <table class="car-apply-tab">
            <tr>
                <td colspan="8" class="td-divider">
                    <el-divider content-position="left">车辆申请参数</el-divider>
                </td>
            </tr>
            <tr>
                <th>申请人：</th>
                <td :title="info.APPLY_UNAME">{{info.APPLY_UNAME}}</td>
                <th>申请单编号：</th>
                <td :title="info.APPLY_CODE">{{info.APPLY_CODE}}</td>
                <th>申请单位：</th>
                <td :title="info.APPLY_ONAME">{{info.APPLY_ONAME}}</td>
                <th>申请科室：</th>
                <td :title="info.APPLY_DNAME">{{info.APPLY_DNAME}}</td>
            </tr>
            <tr>

                <th>申请日期：</th>
                <td :title="info.apply_date">{{new Date(info.apply_date).toLocaleString('chinese',{hour12:false})}}</td>
                <th>申请事由：</th>
                <td :title="info.APPLY_REASON">{{info.APPLY_REASON}}</td>
                <th>目的地：</th>
                <td :title="info.DESTINATION">{{info.DESTINATION}}</td>
                <th>用车人数：</th>
                <td :title="info.USE_NUM">{{info.USE_NUM}}</td>
            </tr>
            <tr>
                <th>警号：</th>
                <td :title="info.POLICE_NO">{{info.POLICE_NO}}</td>
                <th>手机：</th>
                <td :title="info.TEL">{{info.TEL}}</td>
                <th>预计出车时间：</th>
                <td :title="info.EST_OUT_TIME">{{new Date(info.EST_OUT_TIME).toLocaleString('chinese',{hour12:false})}}
                </td>
                <th>预计交车时间：</th>
                <td :title="info.EST_BACK_TIME">
                    {{new Date(info.EST_BACK_TIME).getFullYear()>2019?new Date(info.EST_BACK_TIME).toLocaleString('chinese',{hour12:false}):''}}
                </td>
            </tr>
            <tr>
                <td colspan="8" class="td-divider">
                    <el-divider content-position="left">车辆派车参数</el-divider>
                </td>
            </tr>
            <tr>
                <th>司机姓名：</th>
                <td :title="info.DRIVER_UNAME">{{info.DRIVER_UNAME}}</td>
                <th>司机电话：</th>
                <td :title="info.DRIVER_TEL">{{info.DRIVER_TEL}}</td>
                <th>审批时间：</th>
                <td :title="info.AUDIT_TIME">{{new Date(info.SEND_TIME).toLocaleString('chinese',{hour12:false})}}</td>
                <th>派车时间：</th>
                <td :title="info.SEND_TIME">{{new Date(info.SEND_TIME).toLocaleString('chinese',{hour12:false})}}</td>

            </tr>
            <tr>
                <th>取车人姓名：</th>
                <td :title="info.TAKE_UNAME">{{info.TAKE_UNAME}}</td>
                <th>取车人电话：</th>
                <td :title="info.TAKE_TEL">{{info.TAKE_TEL}}</td>
                <th>是否指标内：</th>
                <td :title="info.QUOTA==1?'是':'否'">{{info.QUOTA==1?'是':'否'}}</td>
                <th>派车有无刮痕：</th>
                <td :title="info.SLUG==1?'是':'否'">{{info.SLUG==1?'是':'否'}}</td>
            </tr>
            <tr>
                <th>油卡号：</th>
                <td :title="info.REFUEL_NO">{{info.REFUEL_NO}}</td>
                <th>车载设备：</th>
                <td :title="info.ON_EQUI">{{info.ON_EQUI}}</td>
                <th>粤通卡号：</th>
                <td :title="info.PASS_CARD_NO">{{info.PASS_CARD_NO}}</td>
                <th>出车金额：</th>
                <td :title="info.RECH_MONEY">{{info.RECH_MONEY}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        props: ['myinfo'],
        data() {
            return {
                formInline: {
                    user: '',
                    region: ''
                },
                info: {}
            };
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            }
        },
        mounted() {

        },
        watch: {
            myinfo: function (nd) {
                // 根据申请id 得到数据
                let scope = this;
                if (!nd.ID&&!nd.APPLY_ID){
                    scope.info={}
                   return; 
                } 
                this.$axios.get(scope.$config.GET_APPLY_INFO, {
                    params: {
                        id: nd.APPLY_ID ? nd.APPLY_ID : nd.ID
                    }
                }).then(val => {
                    scope.info = val.data[0] ? val.data[0] : {}
                })
            }
        }
    }
</script>
<style lang="css" scoped>
    .car-apply-tab {
        width: 100%;
        font-size: 14px;
        table-layout: fixed;
        cursor: default;
    }

    .car-apply-tab tr {
        padding: 5px;
    }

    .car-apply-tab th {
        padding: 10px;
        width: 100px;
        background-color: rgb(243, 247, 247);
    }

    .car-apply-tab td {
        padding: 10px;
        width: 100px;
        background-color: rgb(207, 250, 250);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }

    .car-apply-tab .td-divider {
        background-color: white;
        padding: 0px;
    }
</style>