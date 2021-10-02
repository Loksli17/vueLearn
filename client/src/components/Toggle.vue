<template>
    <div class="toggle-container" tabindex="1">
        <input 
            v-if="required" 
            id="id" 
            type="checkbox" 
            :name="name" 
            v-model="computedValue" 
            required hidden>

        <input
            v-else 
            id="id" 
            type="checkbox" 
            :name="name" 
            v-model="computedValue" hidden>

        <span class="toggle" @click="toggle">
            <span 
                v-if="showState" 
                class="toggle-state"
                >
                {{ computedValue ? "on" : "off" }}
            </span>
        </span>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue'

    export default defineComponent({
        name: "toggle",

        props: {
            modelValue: {
                type: Boolean,
                required: true
            },
            showState: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ""
            },
            name: {
                type: String,
                default: "toggle"
            },
            required: {
                type: Boolean,
                default: false
            }
        },

        emits: ["update:modelValue"],

        setup(props, { emit }) {
            const computedValue = computed({
                get(): boolean {
                    return props.modelValue;
                },
                set(val: boolean) {
                    emit("update:modelValue", val);
                }
            });

            const toggle = () => {
                computedValue.value = !computedValue.value;
            }

            return {
                computedValue,
                toggle
            }
        },
    })
</script>

<style lang="scss" scoped>
    .toggle-container {
        --switch-container-width: 50px;
        --switch-size: calc(var(--switch-container-width) / 2);
        --switch-off-color: gray;
        --switch-on-color: green;
        --switch-text-off-color: white;
        --switch-text-on-color: white;
        --switch-toggle-element-color: white;
        --switch-toggle-element-focus-color: rgb(2, 48, 2);
        --switch-font: 'Arial';

        width: var(--switch-container-width);
        display: flex;
        align-items: center;

        input:checked {
            &+ .toggle {
                background-color: var(--switch-on-color);

                .toggle-state {
                    font-size: 10pt;
                    margin-left: calc(var(--switch-container-width) / 10);
                    color: var(--switch-text-on-color);
                }

                &::before {
                    transform: translateX(calc(var(--switch-container-width) - var(--switch-size)));
                }
            }
        }

        // &:focus .toggle::before {
        //     border: 2px solid var(--switch-toggle-element-focus-color);
        // }

        .toggle {
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;
            height: var(--switch-size);
            flex-basis: var(--switch-container-width);

            border-radius: var(--switch-size);
            background-color: var(--switch-off-color);
            transition: background-color .1s ease-in-out;

            .toggle-state {
                font-family: var(--switch-font);
                user-select: none;
                font-size: 10pt;
                margin-left: calc(calc(var(--switch-container-width) / 2));
                color: var(--switch-text-off-color);

                transition: margin-left .1s ease-in-out;;
            }

            &::before {
                content: "";
                position: absolute;
                box-sizing: border-box;
                left: 2px;
                height: calc(var(--switch-size) - 4px);
                width: calc(var(--switch-size) - 4px);

                border-radius: 50%;
                background-color: var(--switch-toggle-element-color);

                transition: transform .1s ease-in-out;
            }
        }
    }
</style>
