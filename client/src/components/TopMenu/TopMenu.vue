<template>
    <teleport to="body">
        <header class="top-menu-wrapper">
            <div class="top-menu-burger">
                <span>dasgkjahbdkg</span>
            </div>
            <div class="top-menu-left-section">
                <slot name="left"></slot>
            </div>
            <div class="top-menu-button-list">
                <ul>
                    <template v-for="button in buttons" :key="button.name">
                        <TopMenuButton :button="button" />
                    </template>
                </ul>
            </div>
            <div></div>
            <div class="top-menu-right-section">
                <slot name="right"></slot>
            </div>
        </header>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import TopMenuButton from './TopMenuButton.vue'
    import { LinkButton } from './types'

    export default defineComponent({
        components: { TopMenuButton },
        
        props: {
            buttons: {
                type: Object as PropType<Array<LinkButton>>,
                required: true
            }
        },
        // setup(props) {
            
        // },
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/top-menu/burger.scss";

    .top-menu-wrapper {
        position: fixed;
        display: grid;
        gap: 20px;
        padding: 20px;
        grid-template-columns: max-content max-content max-content auto max-content;
        top: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        background-color: #FFF;
        box-shadow: 4px 4px 8px #000;

        .top-menu-button-list {
            ul {
                display: grid;
                list-style: none;
                grid-auto-flow: column;
                gap: 20px;
                padding: 0;
                margin: 0;
            }
        }
    }
</style>