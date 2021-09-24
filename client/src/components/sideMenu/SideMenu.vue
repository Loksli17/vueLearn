<template>
    <div class="side-menu-container" v-show="showMenuLocal">
        <div class="side-menu-header">
            <button @click.prevent="showMenuLocal = !showMenuLocal">X</button>
            <slot name="header">

            </slot>
        </div>
        <div class="side-menu-body">
            <SideMenuButton 
                v-for="(button, index) in buttonsList" 
                :key="index" 
                :button-data="button"
            />
        </div>
        <div class="side-menu-footer">
            <slot name="footer">

            </slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import SideMenuButton from "./SideMenuButton.vue";
    import { Button } from "./types";

    export { Button };
    export default defineComponent({
        components: {
            SideMenuButton
        },
        name: "SideMenu",
        emits: ["update:show-menu"],
        props: {
            buttonsList: {
                type: Object as PropType<Array<Button>>,
                required: true
            },
            showMenu: {
                type: Boolean,
                required: true
            }
        },
        computed: {
            showMenuLocal: {
                get(): boolean {
                    return this.showMenu;
                },
                set(newVal: boolean): void {
                    this.$emit("update:show-menu", newVal);
                }
            }
        }
    });
</script>

<style lang="scss" scoped>
    $side-menu-width: 200px;

    // .side-menu-slide-enter-active, 
    // .side-menu-slide-leave-active {
    //     transition: all .3s;
    // } 
    // .side-menu-slide-enter-from,
    // .side-menu-slide-leave-to {
    //     left: -200px;
    //     opacity: 0;
    // }

    .side-menu-container {
        display: grid;
        position: fixed;
        left: 0;
        top: 0;
        opacity: 1;
        width: $side-menu-width;
        height: 100%;
        z-index: 10000;
        background-color: burlywood;
    }
</style>