<template>
    <teleport to="body">
        <div 
            class="floating-button-wrapper"
            :class="posClassName"
            :style="buttonStyle">
            <slot>

            </slot>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue'

    export default defineComponent({

        props: {
            position: {
                type: String,
                default: "right"
            },
            side: {
                type: Number,
                default: 40
            },
            bottom: {
                type: Number,
                default: 40
            }
        },

        setup(props) {
            const posClassName = computed(() => {
                let className = "";

                switch (props.position) {
                    case "left":
                        className = "floating-button-left";
                        break;
                    case "right":
                    default:
                        className = "floating-button-right";
                        break;
                }

                return className;
            })

            const buttonStyle = computed(() => {
                const style: { [k: string]: string } = {};

                style["bottom"]       = `${props.bottom}px`;
                style[props.position] = `${props.side}px`;

                return style;
            });

            return {
                posClassName,
                buttonStyle
            }
        },
    })
</script>


<style lang="scss">
    .floating-button-wrapper {
        position: fixed;

        width: max-content;
        height: max-content;
        bottom: 20px;
    }

    .floating-button-left {
        left: 20px;
    }

    .floating-button-right {
        right: 20px;
    }
</style>