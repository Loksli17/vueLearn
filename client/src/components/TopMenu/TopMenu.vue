<template>
    <teleport to="body">
        <header ref="root" class="top-menu-wrapper">
            <div 
                class="top-menu-burger" 
                :class="{ 'top-menu-burger-active': showMenu }" 
                @click.prevent="toggleMenu">
                <span></span>
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
        <template v-if="renderMobileMenu">
            <transition :name="transitionName">
                <div v-show="showMenu" class="top-menu-mobile-wrapper" :style="{ top: menuHeight }">
                    <div class="top-menu-button-list">
                        <ul>
                            <template v-for="button in buttons" :key="button.name">
                                <TopMenuButton :button="button" />
                            </template>
                        </ul>
                    </div>
                    <div class="top-menu-right-section">
                        <slot name="right"></slot>
                    </div>
                </div>
            </transition>
        </template>
    </teleport>
</template>

<script lang="ts">
    import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, Ref, ref } from 'vue';
    import TopMenuButton                                                       from './TopMenuButton.vue';
    import { LinkButton }                                                      from './types';

    // export { LinkButton };

    export default defineComponent({
        components: { TopMenuButton },
        
        props: {
            buttons: {
                type: Object as PropType<Array<LinkButton>>,
                required: true
            },
            selectedButton: {
                type: Object as PropType<LinkButton>,
                required: false
            },
            slideFrom: {
                type: String,
                default: "bottom"
            }
        },

        setup(props) {
            const root = ref(null);
            let 
                renderMobileMenu: Ref<boolean> = ref(false),
                showMenu:         Ref<boolean> = ref(false),
                menuHeight:       Ref<number>  = ref(0),
                transitionName                 = computed(() => {
                    if (props.slideFrom !== "bottom" && props.slideFrom !== "left") 
                        console.warn("[TopMenu warn]: Unsupported direction. Falling back to 'left'");
                    
                    return props.slideFrom === "bottom" ? "top-menu-mobile-slide-bottom" : "top-menu-mobile-slide-left";
                });

            const setShowMobileMenu = (): void => {
                const 
                    bodyStyle = getComputedStyle(document.body),
                    width     = parseInt(bodyStyle.width),
                    // :)
                    margin    = parseInt(bodyStyle.marginLeft) * 2;
                
                renderMobileMenu.value = (width + margin) < 859;
            }

            const setMobileMenuHeight = (el: HTMLElement): void => {
                menuHeight.value = parseInt(getComputedStyle(el).height);
            }

            onMounted(() => {
                const 
                    headerVal = root.value as unknown as HTMLElement,
                    headerHeight = parseInt(getComputedStyle(headerVal).height);

                document.body.style.paddingTop = `${headerHeight}px`;

                setShowMobileMenu();
                setMobileMenuHeight(headerVal);

                window.addEventListener("resize", () => {
                    setShowMobileMenu(); 
                    setMobileMenuHeight(headerVal);
                });
            });

            // cleanup
            onBeforeUnmount(() => {
                document.body.style.paddingTop = "";
            });

            const toggleMenu = () => {
                showMenu.value = !showMenu.value;
            }

            return {
                root,
                menuHeight,
                toggleMenu,
                showMenu,
                transitionName,
                renderMobileMenu
            }
        },
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/top-menu/burger.scss";
    @import "../../assets/scss/top-menu/top-menu.scss";
    @import "../../assets/scss/top-menu/top-menu-mobile.scss";

    .top-menu-mobile-slide-bottom-enter-active,
    .top-menu-mobile-slide-bottom-leave-active {
        transition: top .3s;
    }

    .top-menu-mobile-slide-bottom-enter-from,
    .top-menu-mobile-slide-bottom-leave-to {
        top: 100vh;
    }

    .top-menu-mobile-slide-left-enter-active,
    .top-menu-mobile-slide-left-leave-active {
        transition: left .3s;
    }

    .top-menu-mobile-slide-left-enter-from,
    .top-menu-mobile-slide-left-leave-to {
        left: -100vw;
    }

    @media screen and (max-width: 860px) {
        .top-menu-wrapper {
            grid-template-columns: 60px auto;
            gap: 0;

            .top-menu-burger {
                display: flex;
            }
            
            .top-menu-button-list {
                display: none;
            }

            .top-menu-left-section {
                display: flex;
                justify-content: center;
            }

            .top-menu-right-section {
                display: none;
            }
        }

        .top-menu-mobile-wrapper {
            position: fixed;

        }
    }
</style>