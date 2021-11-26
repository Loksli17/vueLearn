<template>
    <div class="card">
        <div class="card-image">
            <slot name="image"></slot>
        </div>
        <div class="card-content-wrapper">
            <slot name="content"></slot>
        </div>
    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({

    })
</script>


<style lang="scss">
    .card {
        width: 300px;
        background-color: #ccc;
        border-radius: 6px;
        padding: 10px;
        box-shadow: 5px 5px 5px gray;

        .card-image {
            width: 300px;
            height: 300px;

            img {
                width: 300px;
                height: 300px;
            }
        }

        .card-content-wrapper {
            width: 100%;
            
        }
    }
</style>
