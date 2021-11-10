<template>
    <video width="700" height="700" :poster="src">
        <source :src="src">
    </video>
</template>


<script lang="ts">
    import { defineComponent, onMounted } from 'vue';


    export default defineComponent({
       
       name: 'video-player',

        props: {
            src: {
                type    : String,
                required: true,
            }
        },

        setup(props) {

            onMounted(() => {
                console.log(props);
            });
        }
    });

</script>

<style lang="scss" scoped>

    video{
        height: 100%;
        width: 100%;
    }
</style>