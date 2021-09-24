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
                        <img v-if="action.iconPath" :src="action.iconPath">
                        <span>{{ action.name }}</span>
                    </router-link>
                    <a 
                        v-else-if="action.handler !== undefined" 
                        :class="action.cssClassName"
                        @click.prevent="action.handler(itemId)"
                    >
                        <img v-if="action.iconPath" :src="action.iconPath">
                        <span>{{ action.name }}</span>
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
        padding: 15px 20px 15px 20px;
        border-radius: 10px;
        box-shadow: 3px 3px 8px #000;
        margin-left: 1%;

        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                padding: 10px 15px;

                a {
                    display: grid;
                    grid-template-columns: max-content auto;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    color: #000;
                    // justify-content: center;

                    &:hover {
                        cursor: pointer;
                    }
                    
                    img {
                        width: 20px;
                        height: 20px;
                    }
                }
            }
        }
    }
</style>

