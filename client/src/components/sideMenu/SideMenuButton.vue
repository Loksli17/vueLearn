<template>
    <div class="side-menu-button">
        <router-link :to="buttonData.path">{{ buttonData.text }}</router-link>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Button } from "./types";

    export default defineComponent({
        name: "SideMenuButton",
        props: {
            buttonData: {
                type: Object as PropType<Button>,
                required: true
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/side-menu/side-menu-button.scss";
</style>