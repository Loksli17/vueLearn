<template>
    <teleport to="body">
        <div class="popup-wrapper" v-if="showPopup">
            <div class="popup-wrapper-background" @click="clickedOnBackground"></div>
            <div class="popup-wrapper-body">
                <slot>

                </slot>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: "popup-wrapper",
        emits: ["update:show-popup"],
        props: {
            showPopup: {
                type:     Boolean,
                required: true
            }
        },
        mounted() {
            document.body.style.overflow = "hidden";
        },
        methods: {
            clickedOnBackground() {
                document.body.style.overflow = "initial";
                this.$emit("update:show-popup", false);
            }
        }
    })
</script>

<style lang="scss" scoped>
    .popup-wrapper {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .popup-wrapper-body {
            position: fixed;
            align-self: center;
            width: 80%;
            padding: 40px;
            border-radius: 20px;
            background-color: #FFF;
        }

        .popup-wrapper-background {
            width: 100%;
            height: 100%;
            background-color: #000000e1;
        }
    }
</style>