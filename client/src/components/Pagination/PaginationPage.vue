<template>
    <a :href="page.link" :class="page.class" @click.prevent="$emit('clicked')">
        {{page.content}}
    </a>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';

    export interface Page{
        content: string;
        class: string;
        link: number;
        current?: boolean;
    }

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