<template>
    <td v-if="!actionsAsDropDownList" class="table-row-action-cell">
        <template v-for="action in actions" :key="action.id">
            <router-link 
                v-if="action.path !== undefined"
                :class="action.cssClassName" 
                :to="action.path(itemId)"
            >
                <img  v-if="action.iconPath" :src="action.iconPath">
                <span v-else>{{ action.name }}</span>
            </router-link>
            <a 
                v-else-if="action.handler !== undefined" 
                :class="action.cssClassName"
                @click.prevent="action.handler(itemId)"
            >
                <img  v-if="action.iconPath" :src="action.iconPath">
                <span v-else>{{ action.name }}</span>
            </a>
        </template>
    </td>
    <td v-else>
        <div 
            class="table-row-action-dropdown-button"
            v-click-outside="() => {showDropDown = false}" 
            @click.prevent="showDropDown = !showDropDown"
        ></div>
        <div v-show="showDropDown">
            <TableRowDropDownActionMenu :actions="actions" :itemId="itemId" />
        </div>
    </td>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Action } from "./types";
    import TableRowDropDownActionMenu from "./TableRowDropDownActionMenu.vue";

    export default defineComponent({
        components: {
            TableRowDropDownActionMenu
        },
        props: {
            itemId: {
                type: Number,
                required: true
            },
            actions: {
                type: Object as PropType<Array<Action>>,
                required: true
            },
            actionsAsDropDownList: {
                type: Boolean
            }
        },
        data() {
            return {
                showDropDown: false
            }
        }
    });
</script>

<style lang="scss" scoped>
    .table-row-action-cell {
        display: grid;
        grid-auto-flow: column;
        gap: 5px;

        a {
            display: grid;
            grid-template-columns: max-content auto;
            align-items: center;
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

    .table-row-action-dropdown-button {
        cursor: pointer;
        text-align: right;

        &:after {
            content: '\2807';
            font-size: 20px;
        }
    }
</style>