<template>
    <div class="track-real-info  question_title_content">
        <div class="track-real-info-title">车辆实时轨迹详情</div>
        <table class="track-real-info-table" border="0">
            <tr>
                <th>车牌号：</th>
                <td>{{info.LICENSE_PLATE}}</td>
            </tr>
            <tr>
                <th>所属单位：</th>
                <td>{{info.OWN_UNIT_NAME}}</td>
            </tr>
            <!-- <tr>
                <th>取车人：</th>
                <td>{{info.TAKE_UNAME}}</td>
            </tr>
            <tr>
                <th>取车人电话：</th>
                <td>{{info.TAKE_TEL}}</td>
            </tr>
            <tr>
                <th>取车时间：</th>
                <td>{{new Date(info.startRunTime).toLocaleString('chinese',{hour12:false})}}</td>
            </tr> -->
            <tr>
                <th>速度：</th>
                <td>{{info.speed}}km/h</td>
            </tr>
            <!-- <tr>
                <th>已行驶路程：</th>
                <td>{{info.distance}}km</td>
            </tr> -->
        </table>
        <table class="track-real-info-btn">
            <tr>
                <th>缩放范围：</th>
                <td>
                    <el-radio-group v-model="zoom" @change="onZoom">
                        <el-radio label="1">无</el-radio>
                        <el-radio label="2">车辆</el-radio>
                        <el-radio label="3">全局</el-radio>
                    </el-radio-group>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <el-divider></el-divider>
                </td>
            </tr>

            <tr>
                <th>实时跟踪：</th>
                <td>
                    <el-radio-group v-model="track" @change="onTrack">
                        <el-radio label="1">否</el-radio>
                        <el-radio label="2">是</el-radio>
                    </el-radio-group>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <el-divider></el-divider>
                </td>
            </tr>
            <tr>
                <th>显示轨迹：</th>
                <td>
                    <el-radio-group v-model="path" @change="onPath">
                        <el-radio label="1">否</el-radio>
                        <el-radio label="2">是</el-radio>
                    </el-radio-group>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: {},
                zoom: '1',
                track: '1',
                path: '1'
            };
        },
        methods: {
            onTrack(val) {
                switch (val) {
                    case '1':
                        this.$listener.$emit('realTrack', null, false);
                        break;
                    case '2':
                        this.$listener.$emit('realTrack', this.info, true);
                        break;
                }
            },
            onPath(val) {
                switch (val) {
                    case '1':
                        this.$listener.$emit('trackCar', null, false, true)
                        break;
                    case '2':
                        this.$listener.$emit('trackCar', this.info, true, true)
                        break;
                }
            },
            onZoom(val) {
                switch (val) {
                    case '1':
                        break;
                    case '2':
                        this.$listener.$emit('highlightCar', this.info)
                        break;
                    case '3':
                        this.$listener.$emit('zoomAll', this.info)
                        break;
                }
            }

        },
        mounted() {
            let scope = this;
            this.$listener.$on('changePage', function (type) {
                if (type != 'display') {
                    scope.zoom = '1';
                    scope.track = '1';
                    scope.path = '1';
                }
            });
            this.$listener.$on('trackCar', function (data, isTrack, onlyShow) {
                if (onlyShow) return;
                scope.info = data;
                scope.zoom = '1';
                scope.track = '1';
                scope.path = '2';
                // 根据carPath计算路程
                // let length = scope.$turf.lineDistance({
                //     'type': 'Feature',
                //     'geometry': {
                //         'type': 'LineString',
                //         'coordinates': data.carPath
                //     }
                // }).toLocaleString();
                // scope.info.distance = length;
                // console.log(data);
            });
        }
    }
</script>
<style lang="css" scoped>
    .track-real-info {
        padding-left: 5px;
        padding-right: 5px;
        height: 300px;
              background-color: rgba(72, 189, 248, 0.3);
        width: 300px;
    }

    .track-real-info-title {
        font-size: 17px;
        font-weight: bold;
        padding: 15px;
        cursor: default;
        color: blue;
        text-shadow: 1px 1px 0  white, 1px -1px 0 white,
            -1px -1px 0 white, -1px 1px 0 white;

        font-family: "Microsoft YaHei";
    }

    .track-real-info-table {
        width: 100%;
        cursor: default;
        /* border: 1px rgb(108, 227, 253) ridge;
        box-shadow: rgb(69, 219, 253) 0px 0px 1px */
    }

    .track-real-info-table tr {
        /* border: 1px rgb(108, 227, 253) ridge; */
        box-shadow: blue 0px 0px 5px;

    }

    .track-real-info-table th {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 14px;
        font-weight: 500;
        width: 100px;
        text-align: right;
        color: blue;
    }

    .track-real-info-table td {
        font-size: 14px;
        color: blue;
    }

    .track-real-info-btn {
        width: 100%;
        font-size: 14px;
    }

    .track-real-info-btn tr {
        padding-top: 10px;
    }

    .track-real-info-btn th {
        text-align: left;
        cursor: default;
        font-weight: 500;
        padding-top: 15px;
        color: blue;
    }

    .track-real-info-btn td {
        text-align: left;
        cursor: default;
        padding-top: 15px;
    }

    .el-radio {
        color: blue;
    }

    .el-divider {
        padding: 0px !important;
        margin: 0px !important;
        border: 1px blue ridge;
        box-shadow: blue 0px 0px 1px;
    }
</style>