<template>
    <teleport to="body">
        <div class="modal-wrapper">
            <div class="modal-wrapper-background" @click="clickedOnBackground"></div>
            <div class="modal-wrapper-body">
                <slot>

                </slot>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: "modal-wrapper",

        emits: ["update:show-modal"],

        props: {
            showModal: {
                type:     Boolean,
                required: true
            }
        },

        mounted() {
            document.body.style.overflow = "hidden";
        },

        beforeUnmount() {
            document.body.style.overflow = "initial";
        },
        
        methods: {
            clickedOnBackground() {
                document.body.style.overflow = "initial";
                this.$emit("update:show-modal", false);
            }
        }
    })
</script>

<style lang="scss" scoped>
    .modal-wrapper {
        position: fixed;
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .modal-wrapper-body {
            position: fixed;
            align-self: center;
            width: 80%;
            padding: 40px;
            border-radius: 20px;
            background-color: #FFF;
        }

        .modal-wrapper-background {
            width: 100%;
            height: 100%;
            background-color: #000000e1;
        }
    }
</style>