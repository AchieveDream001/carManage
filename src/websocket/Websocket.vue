<template>
    <div class="test">
        <CarInfoSocket></CarInfoSocket>
        <CarGpsSocket></CarGpsSocket>
    </div>
</template>

<script>
    import CarInfoSocket from './CarInfoSocket.vue';
    import CarGpsSocket from './CarGpsSocket.vue'
    export default {
        components: { CarInfoSocket, CarGpsSocket },
        data() {
            return {

            }
        },

        mounted() {

        },
        methods: {

        }
    }
</script>
<style lang='css'>

</style>