<template>

    <div class="file">
        <img width="50" :src="src" alt="">
        <span>{{file.name}}</span>
        <progress :value="0"></progress>
        <div class="remove-file" @click="removeFile">&#10006;</div>
    </div>
    
</template>


<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        
        props: {
            file: {
                type    : Object as () => File,
                required: true,
            },
            src: {
                type    : String,
                required: true,
            },
            index: {
                type    : Number,
                required: true,
            }
        },

        methods: {
            removeFile: function(){
                this.$emit('remove-file', this.index, this.file);
            }
        }
    });

</script>


<style lang="scss" scoped>
    .file{
        display: grid;
        column-gap: 20px;
        grid-template-columns: 60px 1fr 2fr max-content;
        align-items: center;

        .remove-file{
            font-size: 25px;
            cursor: pointer;
        }

        progress{
            width: 100%;
        }
    }
</style>