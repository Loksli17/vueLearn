<template>
    
    <div class="checkbox">
        <div ref="div" class="content" :class="{'checkbox-active': checked}" @click.prevent="setValue"></div>
        <input type="checkbox" :name="name" v-model="checked" hidden>
    </div>

</template>


<script lang="ts">

    import {defineComponent} from 'vue';

    export default defineComponent({

        props: {
            value: {
                type: Boolean,
                default: false,
            },
            name: {
                type: String,
                default: 'checkbox',
            }
        },

        data: function(){
            return {
                checked: this.value as boolean,
            }
        },
        
        methods: {
            
            setValue: function(): void{
                this.checked = !this.checked;
                this.$emit('emitValue', this.checked, this.name);
            },

            getValue: function(): boolean{
                return this.checked;
            },
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
    }
</style>