"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _vue = _interopRequireDefault(require("vue"));

var _CarSystem = _interopRequireDefault(require("../pages/CarSystem.vue"));

var _CarDisplay = _interopRequireDefault(require("../pages/CarDisplay.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 配置路由相关的信息
// 1.通过Vue.use(插件), 安装插件
_vue["default"].use(_vueRouter["default"]); // 2.创建VueRouter对象


var routes = [{
  path: "",
  component: _CarSystem["default"]
}, {
  path: "/display",
  component: _CarDisplay["default"]
}];
var router = new _vueRouter["default"]({
  // 配置路由和组件之间的应用关系
  routes: routes
}); // 3.将router对象传入到Vue实例

var _default = router;
exports["default"] = _default;