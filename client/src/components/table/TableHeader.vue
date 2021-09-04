<template>
    <thead class="table-header">
        <th v-for="(column, index) in columnNames" 
            :key="index"
            @click="selectedColumn(index)"
            class="table-header-column-names"
            :class="{ 'clickable': (tableIsSortable && index !== columnNames.length - 1) }"
        >
            {{ column.name }}
        </th>
    </thead>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Column } from "./types";

    export default defineComponent({
        name: "TableHeader",
        emits: ["selected-column"],
        props: {
            columnNames: {
                type: Object as PropType<Array<Column>>,
                required: true
            },
            tableIsSortable: {
                type: Boolean,
                default: false
            },
            hasActions: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            selectedColumn(id: number): void {
                if (this.hasActions && id === this.columnNames.length - 1) return;
                this.$emit("selected-column", id);
            }
        }
    })
</script>


<style lang="scss" scoped>
    .table-header {
        .table-header-column-names {
            user-select: none;
        }

        .clickable {
            cursor: pointer;
        }
    }
</style>