<template>
    <thead>
        <th v-for="column in columnNames" :key="column.id">{{ column.name }}</th>
    </thead>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Column } from "./types";

    export default defineComponent({
        name: "TableHeader",
        props: {
            columnNames: {
                type: Object as PropType<Array<Column>>,
                required: true
            }
        }
    })
</script>