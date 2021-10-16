<template>
    <div class="set-in-range">
        <div class="range-current">
            <input 
                type="number" 
                v-model="current"
                disabled="editable"
                min="0" 
                :max="total">
        </div>
        /
        <div class="range-total">
            {{ total }}
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue'

    export default defineComponent({
        
        props: {
            modelValue: {
                type: Number,
                default: 0,
            },
            total: {
                type: Number,
                required: true,
                default: 0
            },
            editable: {
                type: Boolean,
                default: true
            }
        },

        emits: ["update:modelValue"],

        setup(props, { emit }) {

            const current = computed({
                get(): number {
                    return props.modelValue;
                },
                set(newVal: number): void {
                    let temp = newVal;
                    if (typeof temp === "string") {
                        temp = parseInt(temp);

                        if (isNaN(temp)) {
                            temp = props.modelValue;
                        }
                    }

                    temp = temp > props.total ? props.total : temp;
                    temp = temp < 0 ? 0 : temp;

                    emit("update:modelValue", temp);
                }
            });


            return {
                current
            }
        },
    })
</script>

<style lang="scss">
    .set-in-range {
        display: grid;

        grid-template-columns: repeat(3, max-content);
        gap: 5px;
        align-items: center;

        .range-current {
            input {
                padding: 10px;
                width: 2ch;
                text-align: center;
            }

            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                /* display: none; <- Crashes Chrome on hover */
                -webkit-appearance: none;
                margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
            }

            input[type=number] {
                -moz-appearance:textfield; /* Firefox */
            }
        }

        .range-total {
            padding: 10px;
        }
    }
</style>