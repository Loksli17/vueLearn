<template>
    <div class="drag-list-container">
        <div class="drag-list-area" v-for="(list, index) in computedList" :key="index">
            <ul v-if="list.length !== 0">
                <li 
                    class="drag-list-item"
                    v-for="(item, i) in list"
                    :key="`${index} ${i}`"
                    draggable="true"
                    @dragstart="onDragStart($event, i, index)"
                    @dragover="onDragOver"
                    @drop="onDrop($event, i, index)"
                    @dragleave="onDragLeave"
                    @dragend="onDragEnd"
                    >
                    <slot :item="item">

                    </slot>
                </li>
            </ul>
            <ul v-else
                @dragstart="onDragStart($event, 0, index)"
                @dragover="onDragOver"
                @drop="onDrop($event, 0, index)"
                @dragleave="onDragLeave"
                @dragend="onDragEnd">
                <li class="drag-list-empty-item"></li>
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

        // props: {
        //     lists: {
        //         type: Object as PropType<Array<Array<Record<string, unknown>>>>,
        //         required: true
        //     }
        // },

        // emits: {
        //     "update:lists": (arr: Array<Array<Record<string, unknown>>>) => {

        //         let isCorrect = false;

        //         isCorrect = Array.isArray(arr);

        //         if (isCorrect) {
        //             for (let i = 0; i < arr.length; i++) {
        //                 isCorrect = Array.isArray(arr[i]);

        //                 if (!isCorrect) break;
        //             }
        //         }

        //         return isCorrect;
        //     }
        // },

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

            const computedList = computed({
                get(): Array<Array<Record<string, unknown>>> {
                    return [props.left, props.right];
                },
                set(newVal: Array<Array<Record<string, unknown>>>): void {
                    emit("update:left", newVal[0]);
                    emit("update:right", newVal[1]);
                }
            });

            // const computedList = computed({
            //     get(): Array<Array<Record<string, unknown>>> {
            //         return props.lists;
            //     },
            //     set(newVal: Array<Array<Record<string, unknown>>>): void {
            //         emit("update:lists", newVal);
            //     }
            // });

            const onDragStart = (e: DragEvent, index: number, listIndex: number) => {
                dragged.value = {
                    listID: listIndex,
                    val: computedList.value[listIndex][index]
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

            const onDrop = (e: DragEvent, index: number, listIndex: number) => {
                e.preventDefault();

                if (dragged.value) 
                {
                    if (dragged.value.listID === listIndex) 
                    {
                        const foundIndex = computedList.value[listIndex].indexOf(dragged.value.val);
                        const temp = computedList.value[listIndex][index];

                        computedList.value[listIndex][index] = dragged.value.val;
                        computedList.value[listIndex][foundIndex] = temp;
                    }
                    else
                    {
                        const removeIndex = computedList.value[listIndex === 0 ? 1 : 0].indexOf(dragged.value.val);

                        computedList.value[listIndex].splice(index + 1, 0, dragged.value.val);
                        computedList.value[listIndex === 0 ? 1 : 0].splice(removeIndex, 1);
                    }
                }

                const target = e.currentTarget as HTMLLIElement;
                target.classList.remove("drop-zone");
            }

            return {
                computedList,
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
                    width: 200px;
                    height: 60px;

                    box-sizing: border-box;
                    border-radius: 10px;

                    background-color: cadetblue;
                    user-select: none;
                }

                .drag-list-empty-item {
                    width: 200px;
                    height: 50px;
                }

                .drop-zone {
                    border: 1px dashed white;

                    opacity: .5;
                }
            }
        }
    }
</style>