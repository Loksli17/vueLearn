<template>
    <li>
        <router-link :to="button.path">{{ button.name }}</router-link>
    </li>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { LinkButton }      from "./types";

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