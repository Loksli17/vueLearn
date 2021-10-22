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
                @dragleave="onDragLeave"
                @drop="onDrop($event, index)"
                @dragend="onDragEnd($event, index)">
                <slot :item="item">

                </slot>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, getCurrentInstance, PropType } from 'vue';
    import { IDGenerator }                         from "./utils";

    export default defineComponent({

        emits: ["update:modelValue"],
        props: {
            modelValue: {
                type: Object as PropType<Array<Record<string, unknown>>>,
                required: true
            }
        },
        
        setup(props, { emit }) {
            const 
                listID = IDGenerator.getID(),
                instance = getCurrentInstance();

            const computedList = computed(
                {
                    get(): Array<Record<string, unknown>> {
                        return props.modelValue;
                    },
                    set(newVal: Array<Record<string, unknown>>): void {
                        emit("update:modelValue", newVal);
                    }
                }
            );

            const onDragStart = (e: DragEvent, index: number) => {

                const target = e.currentTarget as HTMLLIElement;
                target.classList.toggle("dragged");

                const dataTransfer = e.dataTransfer;

                if (dataTransfer) 
                {
                    dataTransfer.dropEffect = "copy";
                    dataTransfer.setData("text/plain", JSON.stringify({ val: computedList.value[index], id: listID }));
                }

            }

            const onDragOver = (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                
                const target = e.currentTarget as HTMLLIElement;
                target.classList.add("drop-zone");

                // console.log(dragged, listID, index);
            }

            const onDragLeave = (e: DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                
                const target = e.currentTarget as HTMLLIElement;

                target.classList.remove("drop-zone");
            }

            const onDragEnd = (e: DragEvent) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLLIElement;

                // computedList.value.splice(index, 1);

                target.classList.toggle("dragged");
            }

            const onDrop = (e: DragEvent, index: number) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLLIElement;
                const dataTransfer = e.dataTransfer;

                if (dataTransfer) 
                {
                    const dataString = dataTransfer.getData("text/plain");
                    const data = JSON.parse(dataString) as { id: number, val: Record<string, unknown> };
                    const { id, val } = data;
                    

                    if (id === listID) 
                    {
                        const foundIndex = computedList.value.findIndex(el => JSON.stringify(el) === JSON.stringify(val));
                        
                        if (foundIndex !== -1)
                        {
                            computedList.value.splice(foundIndex, 1);
                            computedList.value.splice(index + 1, 0, val);
                        }
                    } 
                    else 
                    {
                        console.log(instance)

                        if (instance) 
                        {
                            const parent = instance.parent;

                            if (parent) 
                            {
                                console.log(parent);
                            }
                        }

                        computedList.value.splice(index + 1, 0, val);
                    }
                    dataTransfer.clearData();
                }

                target.classList.remove("drop-zone");
            }

            return {
                computedList,
                onDragStart,
                onDragOver,
                onDragLeave,
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
                box-sizing: border-box;
                padding: 10px 20px;
                background-color: green;
                border: 1px solid white;

                margin: 5px;

                &:hover {
                    cursor: pointer;
                }
            }

            .drop-zone {
                border: 1px dashed black;
            }
        }
    }
</style>
