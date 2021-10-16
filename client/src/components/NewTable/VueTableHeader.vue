<template>
    <th v-for="col in columns" :key="col.fieldName">
        {{ col.displayedName }}
    </th>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { Column } from './types'

    export default defineComponent({

        name: "table-header",

        props: {
            columns: {
                type: Object as PropType<Array<Column>>,
                required: true
            }
        }
    });
</script>
