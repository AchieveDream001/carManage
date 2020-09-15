<template>
    <div class="car-info">
        <table class="car-info-tab">
            <tr>
                <td colspan="8" class="td-divider">
                    <el-divider content-position="left">车辆型号参数</el-divider>
                </td>
            </tr>
            <tr>
                <th>车牌号：</th>
                <td :title="info.LICENSE_PLATE">{{info.LICENSE_PLATE}}</td>
                <th>品牌：</th>
                <td :title="info.BRAND">{{info.BRAND}}</td>
                <th>车型：</th>
                <td :title="info.CYCLE_TYPE">{{info.CYCLE_TYPE}}</td>
                <th>车辆类型：</th>
                <td
                    :title="info.VEHICLE_CLASS==1?'小轿车':(info.VEHICLE_CLASS==2?'越野车':(info.VEHICLE_CLASS==3?'面包车':(info.VEHICLE_CLASS==4?'人货车':(info.VEHICLE_CLASS==5?'旅行车':(info.VEHICLE_CLASS==6?'中巴':'大巴')))))">
                    {{info.VEHICLE_CLASS==1?'小轿车':(info.VEHICLE_CLASS==2?'越野车':(info.VEHICLE_CLASS==3?'面包车':(info.VEHICLE_CLASS==4?'人货车':(info.VEHICLE_CLASS==5?'旅行车':(info.VEHICLE_CLASS==6?'中巴':'大巴')))))}}
                </td>
            </tr>
            <tr>
                <th>型号：</th>
                <td :title="info.MODEL">{{info.MODEL}}</td>
                <th>排量(L)：</th>
                <td :title="info.DISPLACE">{{info.DISPLACE}}</td>
                <th>车身颜色：</th>
                <td :title="info.BODY_COLOR==1?'白色':(info.BODY_COLOR==2?'黑色':(info.BODY_COLOR==3)?'红色':'银色')">
                    {{info.BODY_COLOR==1?'白色':(info.BODY_COLOR==2?'黑色':(info.BODY_COLOR==3)?'红色':'银色')}}</td>
                <th>车牌类型：</th>
                <td
                    :title="info.LICENSE_TYPE==1?'地方牌':(info.LICENSE_TYPE==2?'粤O牌':(info.LICENSE_TYPE==3?'粤警牌':(info.LICENSE_TYPE==4?'警用摩托车牌':'非警用摩托车牌')))">
                    {{info.LICENSE_TYPE==1?'地方牌':(info.LICENSE_TYPE==2?'粤O牌':(info.LICENSE_TYPE==3?'粤警牌':(info.LICENSE_TYPE==4?'警用摩托车牌':'非警用摩托车牌')))}}
                </td>

            </tr>
            <tr>
                <th>能源类型：</th>
                <td :title="info.ENERGY_TYPE">
                    {{info.ENERGY_TYPE==1?'汽油':(info.ENERGY_TYPE==2?'柴油':(info.ENERGY_TYPE==3?'纯电动':(info.ENERGY_TYPE==4?'油电混合':'油气混合')))}}
                </td>
                <th>环保标志：</th>
                <td :title="info.ENVIR_LAB==1?'黄标':'绿标'">{{info.ENVIR_LAB==1?'黄标':'绿标'}}</td>
                <th>载客量(人)：</th>
                <td :title="info.PA_CAPA">{{info.PA_CAPA}}</td>
                <th>载重量(吨)：</th>
                <td :title="info.CAR_CAPA">{{info.CAR_CAPA}}</td>

            </tr>
            <tr>
                <th>油箱容积(L)：</th>
                <td :title="info.TANK_VOL">{{info.TANK_VOL}}</td>
                <th>金额：</th>
                <td :title="info.AMO_MO">{{info.AMO_MO}}</td>
                <th>车辆识别号：</th>
                <td :title="info.IDENT_NUM">{{info.IDENT_NUM}}</td>
                <th>发动机号：</th>
                <td :title="info.ENGINE_NUM">{{info.ENGINE_NUM}}</td>
            </tr>
            <tr>
                <td colspan="8" class="td-divider">
                    <el-divider content-position="left">车辆使用参数</el-divider>
                </td>
            </tr>
            <tr>
                <th>使用单位：</th>
                <td :title="info.USE_UNIT_NAME">{{info.USE_UNIT_NAME}}</td>
                <th>权属单位：</th>
                <td :title="info.OWN_UNIT_NAME">{{info.OWN_UNIT_NAME}}</td>
                <th>行驶证：</th>
                <td :title="info.DRIVING_LI">{{info.DRIVING_LI}}</td>
                <th>登记证书：</th>
                <td :title="info.REG_CERT">{{info.REG_CERT}}</td>
            </tr>
            <tr>
                <th>车辆资产编码：</th>
                <td :title="info.ASSET_CODE">{{info.ASSET_CODE}}</td>
                <th>初次登记日期：</th>
                <td :title="info.FIRST_REG_DATE">
                    {{new Date(info.FIRST_REG_DATE).toLocaleString('chinese',{hour12:false})}}</td>
                <th>内容档案编号：</th>
                <td :title="info.CONTENT_NUM">{{info.CONTENT_NUM}}</td>
                <th>保险截止日期</th>
                <td :title="info.EXP_DATE">{{info.EXP_DATE}}</td>
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
                if (!nd.LICENSE_PLATE) return;
                this.$axios.get(scope.$config.GET_CAR_INFO, {
                    params: {
                        LICENSE_PLATE: nd.LICENSE_PLATE
                    }
                }).then(val => {
                    scope.info = val.data[0]
                })
            }
        }
    }
</script>
<style lang="css" scoped>
    .car-info-tab {
        width: 100%;
        font-size: 14px;
        table-layout: fixed;
        cursor: default;

    }

    .car-info-tab tr {
        padding: 5px;
    }

    .car-info-tab th {
        padding: 10px;
        width: 100px;
        background-color: rgb(243, 247, 247);
    }

    .car-info-tab td {
        padding: 10px;
        width: 100px;
        background-color: rgb(207, 250, 250);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }


    .car-info-tab .td-divider {
        background-color: white;
        padding: 0px;
        color: blue !important;
    }
</style>