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
    @import 'style.scss';
</style>