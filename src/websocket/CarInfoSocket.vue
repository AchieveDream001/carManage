<template>
    <div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                websock: null,
            }
        },

        mounted() {
            this.created();
        },
        methods: {
            created() {
                this.initWebSocket();
            },
            destroyed() {
                this.websock.close() //离开路由之后断开websocket连接
            },
            initWebSocket() { //初始化weosocket
                const wsuri = this.$config.WS_GET_CAR_INFO;
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;

            },
            websocketonopen() { //连接建立之后执行send方法发送数据
                // 连接成功后的回调函数
                console.log('连接服务器成功')
                // 轮询获取车辆申请数据
                setInterval(() => {
                    this.websocketsend('getApply')
                }, 3000);

            },
            websocketonerror() {//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e) { //数据接收 收到服务器数据后的回调
                if (e.data != "" && e.data !== '0') {
                    this.$listener.$emit('CarInfoData', e.data)
                }
            },
            websocketsend(Data) {//数据发送
                this.websock.send(Data);
            },
            websocketclose(e) {  //关闭
                console.log('断开连接', e);
            },
        },
    }
</script>
<style lang='css'>

</style>