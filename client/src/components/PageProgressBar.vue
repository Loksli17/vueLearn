<template>
    <teleport to="body">
        <div class="page-progress-bar-wrapper" :style="{ marginTop }">
            <div :style="computedStyles" :class="barClass"></div>
        </div>
    </teleport>
</template>


<script lang="ts">
    import { computed, defineComponent, onMounted, ref } from 'vue'

    export default defineComponent({
        name: "page-progress-bar",

        props: {
            barClass: {
                type: String,
                default: "page-progress-bar",
            },
            marginTop: {
                type: String,
                default: "0",
            },
        },

        setup(props) {
            const 
                documentHeight = ref(0),
                userScrolledY  = ref(0);

            const getDocHeight = (): number => {
                return document.body.clientHeight - window.innerHeight;
            }

            document.addEventListener("scroll", () => {
                userScrolledY.value = window.pageYOffset;
            });

            window.addEventListener("resize", () => {
                documentHeight.value = getDocHeight();
                userScrolledY.value = window.pageYOffset;
            });

            const barPercentage = computed(() => { 
                let height = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                ) - document.documentElement.clientHeight;
                
                return (userScrolledY.value / height) * 100;
            });

            onMounted(() => {
                documentHeight.value = getDocHeight();
                userScrolledY.value  = window.pageYOffset;
            });

            const computedStyles = computed(() => {
                return {
                    width: `${barPercentage.value}%`,
                }
            });

            return {
                computedStyles
            }
        },
    })
</script>