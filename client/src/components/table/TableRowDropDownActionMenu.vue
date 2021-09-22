<template>
    <div class="table-row-dropdown-action-menu-container">
        <ul>
            <template v-for="action in actions"  :key="action.id">
                <li>
                    <router-link 
                        v-if="action.path !== undefined"
                        :class="action.cssClassName" 
                        :to="action.path(itemId)"
                    >
                        {{ action.name }}
                    </router-link>
                    <a 
                        v-else-if="action.handler !== undefined" 
                        :class="action.cssClassName"
                        href="" 
                        @click.prevent="action.handler(itemId)"
                    >
                        {{ action.name }}
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Action } from "./types";

    export default defineComponent({
        props: {
            itemId: {
                type: Number,
                required: true
            },
            actions: {
                type: Object as PropType<Array<Action>>,
                required: true
            }
        }
    });
</script>

<style lang="scss" scoped>
    .table-row-dropdown-action-menu-container {
        position: fixed;
        background-color: #FFF;
        padding: 15px 20px 15px 30px;
        border-radius: 10px;
        box-shadow: 3px 3px 8px #000;
        margin-left: 1%;

        ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
    }
</style>

