<template>
    <div class="drag-list-container">
        <span>{{ listID }}</span>
        <ul class="drag-list">
            <li 
                class="drag-list-item"
                v-for="(item, index) in computedList" 
                :key="index" 
                draggable="true"
                @dragstart="onDragStart($event, index)"
                @dragover="onDragOver($event, index)"
                @drop="onDrop($event, index)"
                @dragend="onDragEnd($event, index)">
                <slot :item="item">

                </slot>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType } from 'vue';
    import { IDGenerator }                         from "./utils";

    export default defineComponent({
        emits: ["update:modelItemList"],
        props: {
            modelItemList: {
                type: Object as PropType<Array<Record<string, unknown>>>,
                required: true
            }
        },
        
        setup(props, { emit }) {
            
            const listID = IDGenerator.getID(); 

            const computedList = computed({
                get(): Array<Record<string, unknown>> {
                    return props.modelItemList;
                },
                set(newVal: Array<Record<string, unknown>>): void {
                    emit("update:modelItemList", newVal);
                }
            });

            const onDragStart = (e: DragEvent, index: number) => {
                // e.preventDefault();
                const target = e.target as HTMLLIElement;
                target.classList.toggle("dragged");

                const dataTransfer = e.dataTransfer;

                if (dataTransfer) {
                    dataTransfer.dropEffect = "copy";
                    dataTransfer.setData("text/plain", JSON.stringify({ val: computedList.value[index], id: listID }));
                }

            }

            const onDragOver = (e: DragEvent, index: number) => {
                e.preventDefault();
                const dragged = document.querySelector(".dragged") as HTMLLIElement;

                // console.log(dragged, listID, index);
            }

            const onDragEnd = (e: DragEvent, index: number) => {
                e.preventDefault();
                const target = e.target as HTMLLIElement;

                computedList.value.splice(index, 1);

                target.classList.toggle("dragged");
            }

            const onDrop = (e: DragEvent, index: number) => {
                e.preventDefault();
                const dataTransfer = e.dataTransfer;


                if (dataTransfer) {
                    const dataString = dataTransfer.getData("text/plain");
                    const data = JSON.parse(dataString) as { id: number, val: Record<string, unknown> };
                    const { id, val } = data;

                    if (id === listID) 
                    {
                        const foundIndex = computedList.value.findIndex(el => JSON.stringify(el) === JSON.stringify(val));

                        if (foundIndex  !== -1) {
                            // computedList.value.splice(foundIndex, 1);
                            computedList.value.splice(index + 1, 0, val);
                        }
                    } 
                    else 
                    {
                        computedList.value.splice(index + 1, 0, val);
                    }
                    dataTransfer.clearData();
                }
            }

            return {
                computedList,
                onDragStart,
                onDragOver,
                onDrop,
                onDragEnd,
                listID
            }

        },
    })
</script>

<style lang="scss" scoped>
    .drag-list-container {
        .drag-list {
            list-style: none;
            padding: none;

            .drag-list-item {
                padding: 10px 20px;
                background-color: green;

                margin: 5px;

                &:hover {
                    cursor: pointer;
                }
            }

            .dragged {
                //
            }
        }
    }
</style>
