<template>
    
    <div class="checkbox">
        <div ref="div" class="content" :class="{'checkbox-active': checked}" @click.prevent="setValue"></div>
        <input type="checkbox" v-model="checked" hidden>
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
        },

        data: function(){
            return {
                checked: this.value as boolean,
            }
        },

        created: function(){
            console.log('checkbox:', this.value);
            console.log('checked: ', this.checked);
        },
        
        methods: {
            
            setValue: function(): void{
                this.checked = !this.checked;
                console.log(this.checked, !this.checked);
            },

            getValue: function(): boolean{
                return this.checked;
            },
        }
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