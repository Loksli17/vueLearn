<template>
    <teleport to="body">
        <template v-if="transitionName.length !== 0">
            <transition :name="transitionName">
                <div class="modal-wrapper" :class="modalWrapperClass" v-if="showModalComputed">
                    <div class="modal-wrapper-background" :class="modalBackgroundClass" @click="clickedOnBackground"></div>
                    <div class="modal-wrapper-body" :class="modalBodyClass">
                        <slot>

                        </slot>
                    </div>
                </div>
            </transition>
        </template>
        <template v-else>
            <div class="modal-wrapper" :class="modalWrapperClass" v-if="showModalComputed">
                <div class="modal-wrapper-background" :class="modalBackgroundClass" @click="clickedOnBackground"></div>
                <div class="modal-wrapper-body" :class="modalBodyClass">
                    <slot>

                    </slot>
                </div>
            </div>
        </template>
    </teleport>
</template>

<script lang="ts">
    import { computed, defineComponent, onBeforeUnmount, onMounted } from 'vue';

    export default defineComponent({
        name: "modal-wrapper",

        emits: ["update:show-modal"],

        props: {
            showModal: {
                type:     Boolean,
                required: true
            },
            /**
             * Name of the transition
             */
            transitionName: {
                type: String,
                default: ""
            },
            /**
             * Custom class for the modal wrapper
             */
            modalWrapperClass: {
                type: String,
                default: ""
            },
            /**
             * Custom class for the modal background
             */
            modalBackgroundClass: {
                type: String,
                default: ""
            },
            /**
             * Custom class for the modal body
             */
            modalBodyClass: {
                type: String,
                default: ""
            }
        },

        setup(props, { emit }) {

            const showModalComputed = computed({
                get(): boolean {
                    return props.showModal;
                },
                set(newVal: boolean): void {
                    emit("update:show-modal", newVal);
                }
            })
            
            onMounted(() => {
                document.body.style.overflow = "hidden";
            });

            onBeforeUnmount(() => {
                document.body.style.overflow = "initial";
            });

            const clickedOnBackground = () => {
                document.body.style.overflow = "initial";
                showModalComputed.value = false;
            }


            return {
                showModalComputed,
                clickedOnBackground
            }
        }

        // mounted() {
        //     document.body.style.overflow = "hidden";
        // },

        // beforeUnmount() {
        //     document.body.style.overflow = "initial";
        // },
        
        // methods: {
        //     clickedOnBackground() {
        //         document.body.style.overflow = "initial";
        //         this.$emit("update:show-modal", false);
        //     }
        // }
    })
</script>

<style lang="scss">
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