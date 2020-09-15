import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import mapBoxGl from "mapbox-gl";
import turf from "turf";
import axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import listener from "./components/common/Listener.vue";
import config from "./components/common/Config.vue";
import echart from "echarts";
import echartgl from "echarts-gl";

import router from "./router/index";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import mapboxDraw from "@mapbox/mapbox-gl-draw";

Vue.prototype.$mapboxgl = mapBoxGl;
Vue.prototype.$turf = turf;
Vue.prototype.$axios = axios;
Vue.prototype.$listener = listener;
Vue.prototype.$config = config;
Vue.prototype.$echart = echart;
Vue.prototype.$echartgl = echartgl;

// 设置地图数据
Vue.prototype.$mapDataPath = {
    carSource: "mapdata/carMap/source.json",
    carLayer: "mapdata/carMap/layer.json",
    carImage: "mapdata/carMap/image.json",
    overviewSource: "mapdata/overviewMap/source.json",
    overviewLayer: "mapdata/overviewMap/layer.json",
    overviewMap: "mapdata/overviewMap/image.json",
    trackSource: "mapdata/trackMap/source.json",
    trackLayer: "mapdata/trackMap/layer.json",
    trackImage: "mapdata/trackMap/image.json",
    watchSource: "mapdata/watchMap/source.json",
    watchLayer: "mapdata/watchMap/layer.json",
    watchImage: "mapdata/watchMap/image.json"
};
// 设置地图状态
Vue.prototype.$mapState = {
    val: "", // 记录当前地图的状态
    car: {} // 记录当前地图中包含的车辆
};

Vue.config.productionTip = false;
Vue.prototype.$mapboxDraw = mapboxDraw;
Vue.use(ElementUI);

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
