<template>
    <teleport to="body">
        <div class="side-menu-background" v-show="showMenuLocal" @click="clickedOnBackground"></div>
        <transition name="side-menu-slide">
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
        </transition>
    </teleport>
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
        mounted() {
            document.body.style.overflow = "hidden";
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
        },
        methods: {
            clickedOnBackground(): void {
                document.body.style.overflow = "initial";
                this.$emit("update:show-menu", false);
            }
        }
    });
</script>

<style lang="scss" scoped>
    // ! remove for production 
    @import "../../assets/scss/side-menu/side-menu.scss";

    // it is very important that these styles are AFTER .slide-menu-container
    .side-menu-slide-enter-active, 
    .side-menu-slide-leave-active {
        transition: left .3s;
    } 
    .side-menu-slide-enter-from,
    .side-menu-slide-leave-to {
        left: -200px;
    }

</style>