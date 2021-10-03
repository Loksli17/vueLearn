<template>
    <teleport to="body">
        <div class="page-progress-bar-wrapper" :style="{ marginTop }">
            <div class="page-progress-bar" :style="computedStyles"></div>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, ref } from 'vue'

    export default defineComponent({
        name: "page-progress-bar",

        props: {
            barColor: {
                type: String,
                default: "green"
            },
            marginTop: {
                type: String,
                default: "0"
            }
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

            const barPercentage = computed(() => (userScrolledY.value / documentHeight.value) * 100)

            onMounted(() => {
                documentHeight.value = getDocHeight();
                userScrolledY.value  = window.pageYOffset;

            });

            const computedStyles = computed(() => {
                return {
                    width          : `${barPercentage.value}%`,
                    backgroundColor: props.barColor,
                }
            })

            return {
                computedStyles
            }
        },
    })
</script>