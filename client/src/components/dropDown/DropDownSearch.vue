<template>
    <div class="drop-down-search">
        <input type="search" v-model="searchQueryLocal">
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        emits: ["update:search-query"],
        props: {
            searchQuery: {
                type: String,
                default: ""
            }
        },
        computed: {
            searchQueryLocal: {
                get(): string {
                    return this.searchQuery;
                },
                set(newVal: string): void {
                    this.$emit("update:search-query", newVal);
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
    .drop-down-search {
        width: 100%;
        padding: 10px;
        box-sizing:  border-box;

        input {
            width: 100%;
            font-size: 18px;
            padding: 8px;
            box-sizing: border-box;
        }
    }
</style>