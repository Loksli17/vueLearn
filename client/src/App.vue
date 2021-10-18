<template>
    <div class="app-wrap">
        <FlashMessage class="flash-message" position="right bottom"/>
        <div class="app-line">
            <router-link :to="'/logout'"> Logout => </router-link>
            <span>{{token}}</span>
        </div>
        <router-view :key="$route.fullPath"/>
    </div>
</template>


<script lang="ts">

    import store from './store';

    export default {
        data: function(){
            return {
                token: store.getters.getJWT,
            }
        }
    }
</script>


<style lang="scss">
    .app-wrap{
        padding: 20px 50px;
        box-sizing: border-box;
    }

    .app-line{
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        column-gap: 20px;
    }
</style>
