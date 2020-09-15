<template>
    <div class="" id="amapContainer">
    </div>
</template>

<script>
    import VueAMap from 'vue-amap';
    import { lazyAMapApiLoaderInstance } from 'vue-amap';
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    export default {
        data() {
            return {
                map: null,
                driving: null
            };
        },
        methods: {
            // 百度和高德之间的转换
            bd09togcj02(bd_lon, bd_lat) {
                var bd_lon = +bd_lon;
                var bd_lat = +bd_lat;
                var x = bd_lon - 0.0065;
                var y = bd_lat - 0.006;
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
                var gg_lng = z * Math.cos(theta);
                var gg_lat = z * Math.sin(theta);
                return [gg_lng, gg_lat]
            },
            gcj02tobd09(lng, lat) {
                var lat = +lat;
                var lng = +lng;
                var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
                var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
                var bd_lng = z * Math.cos(theta) + 0.0065;
                var bd_lat = z * Math.sin(theta) + 0.006;
                return [bd_lng, bd_lat]
            },
            // 高德和wgs84之间的转换
            wgs84togcj02(lng, lat) {
                var lat = +lat;
                var lng = +lng;

                var dlat = this.transformlat(lng - 105.0, lat - 35.0);
                var dlng = this.transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return [mglng, mglat]

            },
            gcj02towgs84(lng, lat) {
                var lat = +lat;
                var lng = +lng;

                var dlat = this.transformlat(lng - 105.0, lat - 35.0);
                var dlng = this.transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return [lng * 2 - mglng, lat * 2 - mglat]

            },

            transformlat(lng, lat) {
                var lat = +lat;
                var lng = +lng;
                var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
                return ret
            },
            transformlng(lng, lat) {
                var lat = +lat;
                var lng = +lng;
                var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
                return ret;
            },
            getPlanPath(currentCoord, endName, cb) {
                // 根据当前车辆的位置经纬度和车辆的终点地名得到实时规划的路线
                // 传出实时规划的路线的坐标和计划到达的时间
                var points = [
                    { keyword: '深圳市公安局指挥大楼', city: '深圳' },
                    { keyword: '宝安区政法干部培训基地', city: '深圳' }
                ]
                driving.search(points, function (status, DrivingResult) {
                    // 得到路径坐标
                    let path = [];
                    for (let p of DrivingResult.routes[0].steps) {
                        path.push(scope.gcj02towgs84(p.start_location.lng, p.start_location.lat))
                        for (let tp of p.tmcs) {
                            for (let tpp of tp.path) {
                                path.push(scope.gcj02towgs84(tpp.lng, tpp.lat))
                            }
                        }
                    }
                    scope.$listener.$emit('carPath', path)
                });
            }
        },
        mounted() {
            // let scope = this;
            // VueAMap.initAMapApiLoader({
            //     key: '22aae8fc2cf1daca5e67c55aa8c6cce2',
            //     plugin: ['AMap.Driving'],
            //     // uiVersion: '1.0', // ui库版本，不配置不加载,
            //     v: '1.4.4'
            // });
            // lazyAMapApiLoaderInstance.load().then(() => {
            //     AMap.plugin('AMap.Driving', function () {
            //         var driving = new AMap.Driving({
            //             // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            //             policy: AMap.DrivingPolicy.LEAST_TIME,
            //             //map: map,
            //             //panel: 'info'
            //         })
            //         scope.driving = driving;
            //         var points = [
            //             { keyword: '深圳市公安局指挥大楼', city: '深圳' },
            //             { keyword: '警察战训基地培训中心', city: '深圳' }
            //         ]

            //         driving.search(points, function (status, result) {
            //             // 未出错时，result即是对应的路线规划方案
            //         });
            //         driving.on('complete', function (DrivingResult) {
            //             let arr = [];
            //             for (let r of DrivingResult.routes[0].steps) {
            //                 for (let p of r.path) {
            //                     arr.push(scope.gcj02towgs84(p.lng, p.lat))
            //                 }
            //             }
            //             scope.$listener.$emit('carPath', arr)
            //         })
            //     });
            // });
        }
    }
</script>
<style lang="css" scoped>

</style>