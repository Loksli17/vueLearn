<template>
    <div class="drag-list-container">
        <div class="drag-list-area left">
            <ul>
                <li 
                    class="drag-list-item"
                    v-for="(item, index) in computedLeft" 
                    :key="`${index} 1`"
                    draggable="true"
                    @dragstart="onDragStart($event, index, 1)"
                    @dragover="onDragOver"
                    @dragleave="onDragLeave"
                    @drop="onDrop($event, index, 1)"
                    @dragend="onDragEnd" >
                    <slot :item="item">

                    </slot>
                </li>
            </ul>
        </div>
        <div class="drag-list-area right">
            <ul>
                <li 
                    class="drag-list-item"
                    v-for="(item, index) in computedRight" 
                    :key="`${index} 2`"
                    draggable="true"
                    @dragstart="onDragStart($event, index, 2)"
                    @dragover="onDragOver"
                    @dragleave="onDragLeave"
                    @drop="onDrop($event, index, 2)"
                    @dragend="onDragEnd" >
                    <slot :item="item">
                        
                    </slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'

    export default defineComponent({

        name: "drag-list",

        props: {
            left: {
                type: Object as PropType<Array<Record<string, unknown>>>,
                required: true
            },
            right: {
                type: Object as PropType<Array<Record<string, unknown>>>,
                required: true
            }
        },

        // emits: ["update:left", "update:right"],
        emits: {
            "update:left": (arr: Array<Record<string, unknown>>) => {
                return Array.isArray(arr);
            },
            "update:right": (arr: Array<Record<string, unknown>>) => {
                return Array.isArray(arr);
            },
        },

        setup(props, { emit }) {

            const dragged = ref(null as { listID: number, val: Record<string, unknown> } | null);

            const computedLeft = computed({
                get(): Array<Record<string, unknown>> {
                    return props.left;
                },
                set(newVal: Array<Record<string, unknown>>) {
                    emit("update:left", newVal);
                }
            });

            const computedRight = computed({
                get(): Array<Record<string, unknown>> {
                    return props.right;
                },
                set(newVal: Array<Record<string, unknown>>) {
                    emit("update:right", newVal);
                }
            });
            
            const onDragStart = (e: DragEvent, index: number, listID: number) => {

                if (listID === 1) {
                    dragged.value = {
                        listID,
                        val: computedLeft.value[index]
                    };
                } else if (listID === 2) {
                    dragged.value = {
                        listID,
                        val: computedRight.value[index]
                    };
                }

            }

            const onDragOver = (e: DragEvent) => {
                e.preventDefault();

                const target = e.currentTarget as HTMLLIElement;
                target.classList.add("drop-zone");
            }

            const onDragLeave = (e: DragEvent) => {
                e.preventDefault();

                const target = e.currentTarget as HTMLLIElement;
                target.classList.remove("drop-zone");
            }

            const onDragEnd = (e: DragEvent) => {
                e.preventDefault();

                dragged.value === null;
            }

            const onDrop = (e: DragEvent, index: number, listID: number) => {
                e.preventDefault();

                if (dragged.value) {
                    if (dragged.value.listID === listID) {
                        if (listID === 1) 
                        {
                            const foundIndex = computedLeft.value.indexOf(dragged.value.val);
                            const temp = computedLeft.value[index];
                            computedLeft.value[index] = dragged.value.val;
                            computedLeft.value[foundIndex] = temp;
                        } 
                        else if (listID === 2)
                        {
                            const foundIndex = computedRight.value.indexOf(dragged.value.val);
                            const temp = computedRight.value[index];
                            computedRight.value[index] = dragged.value.val;
                            computedRight.value[foundIndex] = temp;
                        }
                    } else {
                        if (listID === 1)
                        {
                            const removeIndex = computedRight.value.indexOf(dragged.value.val);

                            computedLeft.value.splice(index + 1, 0, dragged.value.val);
                            computedRight.value.splice(removeIndex, 1);
                        } 
                        else if (listID === 2)
                        {
                            const removeIndex = computedLeft.value.indexOf(dragged.value.val);

                            computedRight.value.splice(index + 1, 0, dragged.value.val);
                            computedLeft.value.splice(removeIndex, 1);
                        }
                    }
                }
            }

            return {
                computedLeft,
                computedRight,
                dragged,
                onDragStart,
                onDragOver,
                onDragLeave,
                onDrop,
                onDragEnd
            }
        },
    })
</script>

<style lang="scss">
    .drag-list-container {
        display: grid;
        grid-template-columns: repeat(2, max-content);
        gap: 20px;

        .drag-list-area {
            ul {
                list-style: none;
                margin: 0;
                display: grid;
                grid-auto-rows: max-content;
                row-gap: 5px;

                .drag-list-item {
                    padding: 10px 20px;
                    width: 100%;

                    background-color: green;
                    user-select: none;
                }
            }
        }
    }
</style>