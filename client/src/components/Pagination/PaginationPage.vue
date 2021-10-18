<template>
    <router-link :to="{name: url, query: {page: page.number}}" :class="page.class">
        {{page.content}}
    </router-link>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Page }                      from './types';
    

    export default defineComponent({
        
        name: "pagination-page",
        
        props: {
            page: {
                type    : Object as PropType<Page>,
                required: true
            },
            src: {
                type   : String,
                default: undefined,
            },
            url: {
                type    : String,
                required: true, 
            }
        }
    })
</script>