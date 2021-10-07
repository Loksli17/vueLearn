<template>
    <div class="add-button" @click.prevent="clickHandler">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({

    emits: ["clicked"],

    setup(props, { emit }) {
        const clickHandler = () => {
            emit("clicked");
        }

        return {
            clickHandler
        }
    },
})
</script>


<style lang="scss">
    .add-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: cadetblue;
        background-image: url("../../assets/img/logo.png");
        background-size: contain;
        background-repeat: no-repeat;

        &:hover {
            cursor: pointer;
        }
    }
</style>