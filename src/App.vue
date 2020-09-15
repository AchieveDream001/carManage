<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "App",
        components: {
        }
    };
</script>
<style>
    body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        z-index: -1;
    }

    body .el-table th.gutter {
        display: table-cell !important;
    }

    #app {
        /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 0px;
        height: 100vh;
        overflow: hidden;
    }

    #map {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        left: 1px;
        top: 1px;
        z-index: 0;
    }

    .bimap-measure-tool {
        position: absolute;
        z-index: 100;
        right: 50px;
        top: 70px;
        display: none;
    }



    .bimap-detail-info {
        position: absolute;
        right: 10px;
        bottom: 60px;
        border-radius: 2px;
        width: 400px;
        z-index: 1;
    }

    .question_title_content {
        margin: 8px;
        background: linear-gradient(to left, rgb(45, 56, 252), rgb(45, 56, 252)) left top no-repeat,
            linear-gradient(to bottom, rgb(45, 56, 252), rgb(45, 56, 252)) left top no-repeat,
            linear-gradient(to left, rgb(45, 56, 252), rgb(45, 56, 252)) right top no-repeat,
            linear-gradient(to bottom, rgb(45, 56, 252), rgb(45, 56, 252)) right top no-repeat,
            linear-gradient(to left, rgb(45, 56, 252), rgb(45, 56, 252)) left bottom no-repeat,
            linear-gradient(to bottom, rgb(45, 56, 252), rgb(45, 56, 252)) left bottom no-repeat,
            linear-gradient(to left, rgb(45, 56, 252), rgb(45, 56, 252)) right bottom no-repeat,
            linear-gradient(to left, rgb(45, 56, 252), rgb(45, 56, 252)) right bottom no-repeat;
        /*设置大小*/
        background-size: 15px 3px, 3px 15px, 15px 3px, 3px 15px;
        border: rgb(75, 75, 247) 1px double;
        background-color: rgba(72, 189, 248, 0.3);
        font-size: 14px;
        text-shadow: 1px 1px 0 white, 1px -1px 0 white,
            -1px -1px 0 white, -1px 1px 0 white;
        color: blue;
        z-index: 1000;
    }

    .question_title_content_chart {
        width: 400px;
        height: 210px;
    }

    .search-bar-pos {
        position: absolute;
        top: 60px;
        left: 10px;
    }
</style>