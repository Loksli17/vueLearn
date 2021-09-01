<template>
    
    <div class="checkbox">
        <div ref="div" class="content" :class="{'checkbox-active': checked}" @click="setValue"></div>
        <input type="checkbox" v-model="checked" hidden>
    </div>

</template>


<script lang="ts">

    import {defineComponent} from 'vue';

    export default defineComponent({

        data: function(){
            return {
                checked: false as boolean,
            }
        },
        
        methods: {
            
            setValue: function(): void{
                this.checked = !this.checked;
            },

            getValue: function(): boolean{
                return this.value;
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