<template>
    <div
        class="scroll-to-top"
        @click.prevent="scrollToTop"
        >
        </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

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
            radius: {
                type: Number,
                default: 30
            }
        },

        setup(props) {
            const scrollToTop = (): void => {
                window.scrollTo({ top: 0, behavior: (props.behavior as ScrollBehavior) });
            }

            return {
                scrollToTop
            }
        },
    })
</script>

<style lang="scss">
    .scroll-to-top {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: aquamarine;

        &:hover {
            cursor: pointer;
        }
    }
</style>
