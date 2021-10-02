<template>
    <div>
        <ul>
            <li 
                v-for="item in itemListComputed" 
                :key="item.id" 
                draggable="true"
                @dragstart="onDragStart($event, item)"
                @dragover="onDragOver($event, item)"
                @dragend="onDragEnd"
                >
                <slot :item="item"></slot>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType } from 'vue';
    import { IDraggable }                          from "./types";
    import { IDGenerator }                         from "./utils";
    
    export { IDraggable };

    export default defineComponent({
        emits: ["update:modelItemList"],
        props: {
            modelItemList: {
                type: Object as PropType<Array<IDraggable>>,
                required: true
            }
        },
        
        setup(props, { emit }) {
            let selectedItem: IDraggable | null = null;
            const containerID = IDGenerator.getID();

            const itemListComputed = computed({
                get(): Array<IDraggable> {
                    return props.modelItemList.map(item => {
                        return {
                            ...item,
                            containerID
                        }
                    });
                },
                set(val: Array<IDraggable>): void {
                    emit("update:modelItemList", val);
                }
            });

            const onDragStart = (e: DragEvent, item: IDraggable) => {
                selectedItem = item;
                
            }

            const onDragOver = (e: DragEvent, item: IDraggable) => {
                e.preventDefault();

                if (item == selectedItem) return;

                if (selectedItem) {
                    itemListComputed.value.splice(itemListComputed.value.indexOf(item), 0, selectedItem);
                }

                // if (selectedItem?.containerID !== containerID) {
                //     itemListComputed.value.splice(itemListComputed.value.indexOf(item), 0, selectedItem);
                // }
            }

            const onDragEnd = () => {
                selectedItem = null;
            }

            return {
                itemListComputed,
                selectedItem,
                onDragStart,
                onDragOver,
                onDragEnd,
                containerID
            }
        },
    })
</script>

<style lang="scss" scoped>

</style>
