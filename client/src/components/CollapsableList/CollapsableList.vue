<template>
    <div class="collapsable-list">
        <CollapsableListItem 
            v-for="(item, index) in itemsRef"
            :key="index"
            :item="item"
            :show="item.show"
            :show-collapse-button="showCollapseButton"
            :animated="animated"
            @toggled="toggle($event, index)"
             />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue';
    import CollapsableListItem           from "./CollapsableListItem.vue";

    export default defineComponent({
        
        components: {
            CollapsableListItem
        },

        props: {
            items: {
                type: Object as PropType<Array<{ header: string, content: string }>>
            },
            showCollapseButton: {
                type: Boolean,
                default: false
            },
            onlyOneOpen: {
                type: Boolean,
                default: false
            },
            animated: {
                type: Boolean,
                default: true
            }
        },
        
        setup(props) {
            
            const itemsRef = ref(
                props.items?.map(item => {
                    return { 
                        ...item, 
                        show: false 
                    }
                }) ?? []);

            const toggle = (show: boolean, index: number) => {
                if (props.onlyOneOpen) {
                    itemsRef.value.forEach(item => {
                        item.show = false;
                    });

                    itemsRef.value[index].show = show;
                } else {
                    itemsRef.value[index].show = show;
                }
            }

            return {
                itemsRef,
                toggle
            }

        },
    })
</script>
