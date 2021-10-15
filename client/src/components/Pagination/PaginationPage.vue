<template>
    <a :href="page.link" :class="page.class" @click.prevent="$emit('clicked')">
        {{page.content}}
    </a>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Page }                      from './types';
    

    export default defineComponent({
        
        name: "pagination-page",
        
        emits: ["clicked"],
        
        props: {
            page: {
                type: Object as PropType<Page>,
                required: true
            },
            src: {
                type   : String,
                default: undefined,
            },
        }
    })
</script>