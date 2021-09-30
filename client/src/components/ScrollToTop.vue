<template>
    <teleport to="body">
        <div class="scroll-to-top" :class="parsePos()" @click.prevent="scrollToTop">
        </div>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    type ScrollBehavior = "auto" | "smooth" | undefined;

    export default defineComponent({
        name: "scroll-to-top",

        props: {
            behavior: {
                type: String,
                default: "auto",
                validator: (behavior: string) => {
                    return (behavior !== "smooth" && behavior !== "auto")
                }
            },
            position: {
                type: String,
                default: "right"
            }
        },

        setup(props) {
            const scrollToTop = (): void => {
                window.scrollTo({ top: 0, behavior: (props.behavior as ScrollBehavior) });
            }

            const parsePos = (): string => {
                const pos = props.position;
                let className = "";

                switch (pos) {
                    case "left":
                        className = "scroll-to-top-left";
                        break;
                    case "right":
                        className = "scroll-to-top-right";
                        break;
                    default:
                        className = "scroll-to-top-right";
                        break;
                }

                return className;
            }

            return {
                scrollToTop,
                parsePos
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
        // right: 20px;

        &:hover {
            cursor: pointer;
        }
    }

    .scroll-to-top-left {
        left: 20px;
    }

    .scroll-to-top-right {
        right: 20px;
    }
</style>