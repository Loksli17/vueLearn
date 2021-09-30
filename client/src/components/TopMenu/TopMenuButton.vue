<template>
    <li class="top-menu-list-button">
        <router-link :to="button.path">{{ button.name }}</router-link>
    </li>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { LinkButton }                from "./types";

    export default defineComponent({
        name: "top-menu-button",

        props: {
            button: {
                type: Object as PropType<LinkButton>,
                required: true
            }
        }
    })
</script>

<style lang="scss" scoped>
    .top-menu-list-button {
        box-sizing: border-box;

        // yes this is a hack, but it works, so shut up
        border-bottom: 2px solid transparent;
        
        a {
            text-decoration: none;
            color: #000;
        }

        &:hover {
            // box-sizing: content-box;
            border-bottom: 2px solid #000;
        }
    }
</style>