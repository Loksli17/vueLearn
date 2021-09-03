<template>
    <td>
        <!-- <a href="" @click.prevent="removeArticle(item.id)">Delete</a>
        <router-link :to="`/crud/${item.id}/edit`">Edit</router-link>
        <router-link :to="`/crud/${item.id}/view`">View</router-link> -->
    </td>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    export default defineComponent({
        props: {
            itemId: {
                type: Number,
                required: true
            },
            actions: {
                type: Object as PropType<Array<Record<string, string>>>,
                required: true
            }
        }
    });
</script>