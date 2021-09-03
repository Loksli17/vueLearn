<template>
    <thead>
        <th v-for="column in columnNames" :key="column.id">{{ column.name }}</th>
    </thead>
</template>

<script lang="ts">
    export interface Column {
        name: string;
    }

    import { defineComponent, PropType } from 'vue'
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