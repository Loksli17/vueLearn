<template>
    <tr>
        <td v-if="selectable">
            <Checkbox v-model="isSelected" @change="toggledSelection" />
        </td>
        <template v-for="(value, name) in row" :key="name">
            <td v-if="!customCells[name]">
                {{ value }}
            </td>
            <component v-else :is="customCells[name]" :data="value[customCells[name].fieldToGetDataFrom]"></component>
        </template>
    </tr>
</template>

<script lang="ts">
    import { ComponentPublicInstance, defineComponent, PropType, ref } from 'vue';
    import Checkbox from "@/components/crudComponent/VueCheckbox.vue";

    export default defineComponent({
        
        components: {
            Checkbox
        },
        props: {
            row: {
                type: Object as PropType<Record<string, unknown>>,
                required: true
            },
            selectable: {
                type: Boolean,
                default: false
            },
            customCells: {
                type: Object as PropType<{ 
                    fieldName: string, 
                    component: ComponentPublicInstance
                    fieldToGetDataFrom?: string }>,
                default: undefined
            }
        },

        emits: ["toggled-selection"],

        setup(props, { emit }) {
            const isSelected = ref(false);

            const toggledSelection = () => {
                emit("toggled-selection", { isSelected: isSelected.value, row: props.row });
            }

            return {
                isSelected,
                toggledSelection
            }
        }
    })
</script>
