<template>
    <div>
        <!-- this is more native -->
        <Checkbox v-model="checked" :name="'test-checkbox'" />
        <span>{{ checked }}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Checkbox            from "@/components/crudComponent/VueCheckbox.vue";

    export default defineComponent({
        components: {
            Checkbox
        },

        data() {
            return {
                checked: false as boolean
            }
        }
    });
</script>
