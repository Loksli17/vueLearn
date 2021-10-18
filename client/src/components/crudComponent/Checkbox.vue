<template>
    
    <div class="checkbox">
        <div class="content" :class="{'checkbox-active': computedValue}" @click="change"></div>
        <input type="checkbox" :name="name" v-model="computedValue" hidden>
    </div>

</template>


<script lang="ts">

    import { computed, defineComponent, WritableComputedRef } from 'vue';


    export default defineComponent({

        name: "checkbox",

        emits: ["update:value", "change"],

        props: {
            value: {
                type: Boolean,
                default: false,
            },
            name: {
                type   : String,
                default: 'checkbox',
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
                computedValue.value = !computedValue.value;
                emit("change", computedValue.value, props.name);
            }

            return {
                computedValue,
                change
            }
        },

        // data: function(){
        //     return {
        //         checked: this.value as boolean,
        //     }
        // },
        
        // methods: {
            
        //     setValue: function(): void{
        //         this.checked = !this.checked;
        //         this.$emit('emitValue', this.checked, this.name);
        //     },

        //     getValue: function(): boolean{
        //         return this.checked;
        //     },
        // },
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
    }
</style>