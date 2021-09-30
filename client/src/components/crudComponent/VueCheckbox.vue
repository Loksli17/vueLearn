<template>
    <div class="checkbox">
        <div 
            class="checkbox-content" 
            :class="{ 'checkbox-active': valueComputed }"
            @click="valueComputed = !valueComputed"
            ></div>
        <input type="checkbox" :name="name" v-model="valueComputed" hidden>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, WritableComputedRef } from 'vue'

    export default defineComponent({
        
        name: "checkbox",

        emits: ["update:modelValue"],

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

            return {
                valueComputed
            }
        },
    })
</script>

<style lang="scss" scoped>
    .checkbox {
        .checkbox-content {
            width: 20px;
            height: 20px;
            border: 2px solid;
            cursor: pointer;
        }

        .checkbox-active {
            background-color: darkturquoise;
        }
    }
</style>
