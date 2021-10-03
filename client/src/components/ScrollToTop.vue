<template>
    <teleport to="body">
        <div 
            class="scroll-to-top" 
            :class="posClassName" 
            :style="buttonStyle"
            @click.prevent="scrollToTop">
        </div>
    </teleport>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType } from 'vue';

    type ScrollBehavior = "auto" | "smooth" | undefined;

    export default defineComponent({
        name: "scroll-to-top",

        props: {
            behavior: {
                type: String,
                default: "auto",
                validator: (behavior: string) => {
                    return (behavior == "smooth" || behavior == "auto")
                }
            },
            position: {
                type: String,
                default: "right"
            },
            dist: {
                type: Object as PropType<{ bottom: number, side: number }>,
                default: () => ({ bottom: 20, side: 20 })
            },
            radius: {
                type: Number,
                default: 30
            }
        },

        setup(props) {
            const scrollToTop = (): void => {
                window.scrollTo({ top: 0, behavior: (props.behavior as ScrollBehavior) });
            }

            const posClassName = computed(() => {
                let className = "";

                switch (props.position) {
                    case "left":
                        className = "scroll-to-top-left";
                        break;
                    case "right":
                    default:
                        className = "scroll-to-top-right";
                        break;
                }

                return className;
            })

            const buttonStyle = computed(() => {
                const style: { [k: string]: string } = {};

                style["bottom"]       = `${props.dist.bottom}px`;
                style[props.position] = `${props.dist.side}px`;
                style["width"]        = `${props.radius * 2}px`;
                style["height"]       = `${props.radius * 2}px`;

                return style;
            });

            return {
                scrollToTop,
                posClassName,
                buttonStyle
            }
        }
    })
</script>

<style lang="scss" scoped>
    .scroll-to-top {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: aquamarine;
        position: fixed;
        bottom: 20px;
        transition: all .5s;
        // right: 20px;

        &:hover {
            cursor: pointer;
            // background-color: aqua;
        }
    }

    .scroll-to-top-left {
        left: 20px;
    }

    .scroll-to-top-right {
        right: 20px;
    }
</style>