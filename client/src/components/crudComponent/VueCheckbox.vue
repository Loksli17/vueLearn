<template>
    <div class="checkbox">
        <div 
            class="checkbox-content" 
            :class="{ 'checkbox-active': valueComputed }"
            @click="change"
            ></div>
        <input type="checkbox" :name="name" v-model="valueComputed" hidden>
    </div>
</template>


<script lang="ts">
    import { computed, defineComponent, WritableComputedRef } from 'vue'

    export default defineComponent({
        
        name: "checkbox",

        emits: ["update:modelValue", "change"],

        props: {
            modelValue: {
                type: Boolean,
                default: false
            },
            name: {
                type: String,
                default: "checkbox"
            }
        },

        setup(props, { emit }) {

            const valueComputed: WritableComputedRef<boolean> = computed({
                get(): boolean {
                    return props.modelValue;
                },
                set(newVal: boolean): void {
                    emit("update:modelValue", newVal);
                }
            });

            const change = () => {
                valueComputed.value = !valueComputed.value;
                emit("change", valueComputed.value);
            }

            return {
                valueComputed,
                change
            }
        },
    })
</script>