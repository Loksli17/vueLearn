<template>
    <td v-if="!actionsAsDropDownList">
        <template v-for="action in actions" :key="action.id">
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
        </template>
    </td>
    <td v-else>
        <div 
            class="table-row-action-dropdown-button"
            href="" 
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
    .table-row-action-dropdown-button {
        cursor: pointer;
        text-align: right;

        &:after {
            content: '\2807';
            font-size: 20px;
        }
    }
</style>