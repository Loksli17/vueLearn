<template>
    <tr>
        <td v-for="(value, name) in row" :key="name">{{ value }}</td>
    </tr>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { columnType } from "./Table.vue";

    export default defineComponent({
        name: "TableRow",
        props: {
            row: {
                type: Object as PropType<columnType>,
                require: true
            }
        }
    })
</script>