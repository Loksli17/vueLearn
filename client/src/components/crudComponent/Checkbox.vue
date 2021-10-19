<template>
    
    <div class="checkbox" tabindex="1">

        <input 
            :id="id"
            type="checkbox" 
            :name="name" 
            v-model="computedValue"
            :required="required" 
            hidden>
        
        <div v-if="!toggle" class="content" :class="{'checkbox-active': computedValue}" @click="change"></div>

        <span v-else class="toggle" @click="change">
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

    import { computed, defineComponent, WritableComputedRef } from 'vue';


    export default defineComponent({

        name: "checkbox",

        emits: ["update:value", "change"],

        props: {
            value: {
                type   : Boolean,
                default: false,
            },
            name: {
                type   : String,
                default: 'checkbox',
            },
            toggle: {
                type   : Boolean,
                default: false,
            },
            required: {
                type   : Boolean,
                default: false
            },
            class: {
                type   : String,
                default: "toggle",
            },
            showState: {
                type   : Boolean,
                default: false
            },
            id: {
                type   : String,
                default: ""
            },
        },

        setup(props, { emit }) {

            const computedValue: WritableComputedRef<boolean> = computed({
                get(): boolean {
                    return props.value;
                },
                set(newVal: boolean): void {
                    emit("update:value", newVal);
                }
            });

            const change = () => {
                //! it is awesome important hack of js object working shit
                emit("change", computedValue.value = !computedValue.value, props.name);
            }

            return {
                computedValue,
                change
            }
        },
    });

</script>



<style lang="scss" scoped>  

    .checkbox{

        .content{
            width: 20px;
            height: 20px;
            border: 2px solid;
            cursor: pointer;
        }

        .checkbox-active{
            background: darkturquoise;
        }

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