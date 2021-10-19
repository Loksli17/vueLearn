<template>
    <div class="collapsable-list-item">
        <div 
            class="collapsable-list-item-header"
            @click="showComputed = !showComputed">
            <span> {{ item.header }} </span>

            <!-- ! Make this customisable -->
            <span 
                v-if="showCollapseButton"
                class="collapsable-list-item-collapse-button"
                :class="{ 'rotated': showComputed }">▲</span>
        </div>

        <template v-if="!animated">
            <div 
                class="collapsable-list-item-content-wrapper"
                v-show="showComputed">
                <div 
                    class="collapsable-list-item-content">
                    {{ item.content }}
                </div>
            </div>
        </template>

        <transition 
            v-else
            name="collapsable-list-item-collapse">
            <div 
                class="collapsable-list-item-content-wrapper"
                v-show="showComputed">
                <div 
                    class="collapsable-list-item-content">
                    {{ item.content }}
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
    
    props: {
        item: {
            type: Object as PropType<{ header: string; content: string }>,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        },
        showCollapseButton: {
            type: Boolean,
            required: true
        },
        animated: {
            type: Boolean,
            default: true
        }
    },

    emits: ["toggled"],

    setup(props, { emit }) {

        const showComputed = computed({
            get(): boolean {
                return props.show;
            },
            set(newVal: boolean): void {
                emit("toggled", newVal);
            }
        });

        return {
            showComputed
        }

    }

})
</script>

<style lang="scss">
    .collapsable-list-item {

        .collapsable-list-item-header {
            display: grid;
            grid-template-columns: auto max-content;
            cursor: pointer;
            padding: 20px;
            user-select: none;

            background-color: blueviolet;
            color: white;

            .collapsable-list-item-collapse-button {
                transition: transform .3s;
            }


            .rotated {
                transform: rotateZ(180deg);
            }
        }

        .collapsable-list-item-content-wrapper {
            max-height: 500px;
            overflow: hidden;

            .collapsable-list-item-content {
                padding: 20px;
    
                background-color: rgb(164, 127, 199);
                color: white;
            }
        }

        .collapsable-list-item-collapse-enter-active,
        .collapsable-list-item-collapse-leave-active {
            transition: all .3s;
        }

        .collapsable-list-item-collapse-enter-from,
        .collapsable-list-item-collapse-leave-to {
            max-height: 0px;
        }
    }

</style>
