<template>
    <div class="drop-down-item" @click.stop="clickHandler(item)" :class="{ 'selectable': clickable }">
        <img width="25" v-if="item.img" :src="require(`@/assets/img/article-types/${item.img}`)" alt="">
        <span class="value">{{item.value}}</span>
    </div>
</template>


<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { ListItem } from "./types";
    
    export default defineComponent({
        
        props: {
            item: {
                type: Object as PropType<ListItem>,
                required: true
            },
            clickable: {
                type: Boolean,
                default: true
            }
        },

        emits: ["item-clicked"],
        
        methods: {

            clickHandler(item: ListItem): void {
                if (this.clickable) {
                    this.$emit("item-clicked", item);
                }
            }
        }
    });
</script>


<style lang="scss">
    .drop-down-item {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: max-content auto;
        column-gap: 12px;
        align-items: center;
        padding: 13px 16px;
        font-size: 20px;
    }

    .clickable {
        &:hover {
            transition: 0.4s;
            background: rgb(212, 212, 238);
            cursor: pointer;
        }
    }
</style>