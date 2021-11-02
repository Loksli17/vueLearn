<template>

    <div class="crud-seq-index">

        <button @click="showMenu = true">open menu</button>
        <SideMenu :buttons-list="sideMenuButtons" v-model:show-menu="showMenu">
            <template #header>
                <h1>Header</h1>
                <p>content</p>
            </template>
            <template #footer>
                <h4>Footer</h4>
                <p>some text here</p>
            </template>
        </SideMenu>

        <h1>Index page of SEQUELIZE CRUD</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link class="create-btn" :to="'/seq-crud/create'">Create item</router-link>
        </div>

        <div class="section">
            
            <div class="table-wrap">
                <Table
                    v-if="users"
                    :column-names="columnNames" 
                    :row-data="users" 
                    :actions="tableActions"
                    :config="tableConfig"
                    >
                    <template #footer>
                        <div> This is a footer </div>
                    </template>
                </Table> 
            </div>

            <div class="pagination">
                <Pagination
                    v-model:take=take
                    v-model:skip="skip"
                    :page-gap="7"
                    :end-button="true"
                    :start-button="true"
                    :element-amount="amountUsers"
                />
            </div>
        </div>
    </div>
</template>


<script lang="ts">
    import { defineComponent }       from 'vue';
    import Table                     from '../../components/table/Table.vue';
    import Pagination, { countSkip } from '../../components/Pagination/Pagination.vue';
    import { Action, Column }        from '../../components/table/types';
    import UserService               from '../../services/UserService';
    import FlashMessageData          from '../../libs/flashMessage';
    import SideMenu                  from "@/components/sideMenu/SideMenu.vue";
    import { Button }                from "@/components/sideMenu/types";


    export default defineComponent({
        
        components: {
            Pagination,
            Table,
            SideMenu
        },

        data: function(){
            return {

                users: [] as Array<Record<string, any>>,

                columnNames: [
                    { displayedName: 'Id',      fieldName: 'id' },
                    { displayedName: 'E-mail',  fieldName: 'email' },
                    { displayedName: 'Login',   fieldName: 'login'},
                    { displayedName: 'Avatar',  fieldName: 'avatar'},
                    { displayedName: 'Animal',  fieldName: 'animal'},
                    { displayedName: "Actions", fieldName: "actions" },
                ] as Array<Column>,
                tableConfig: {dropDownActions: true},
                tableActions: [
                        { name: "View",   path: (id: number) => `/seq-crud/${id}/view`, iconPath: require("./../../assets/img/table-icons/view.svg") }, 
                        { name: "Edit",   path: (id: number) => `/seq-crud/${id}/edit`, iconPath: require("./../../assets/img/table-icons/edit.svg") }, 
                        { name: "Delete", handler: this.removeUser,                     iconPath: require("./../../assets/img/table-icons/delete.svg") },
                ] as Array<Action>,

                showMenu: false as boolean,
                sideMenuButtons: [
                    { text: "crud",     path: "/crud" },
                    { text: "seq-crud", path: "/seq-crud" }
                ] as Array<Button>,

                take       : 10 as number,
                skip       : 0 as number,
                currentPage: 1 as number,
                amountUsers: 0 as number,
            }
        },


        created: async function(){
            // ! i don't like this variant
            // ? i want get computed skip from pagination component, case count skip in VIEW is not good idea!!!
            // ? for this idea we should use ref and create getSkip method from pagination.
            
            this.skip = countSkip(Number(this.$route.query.page), this.take);
            await this.getUsers({ take: this.take, skip: this.skip });
            await this.getUsersAmount();
        },


        methods: {
            
            getUsers: async function(data: {take: number; skip: number}){
                this.users = await UserService.getAll(data) || [];
            },

            getUsersAmount: async function(){
                this.amountUsers = await UserService.getAmount() || 0;
            },

            removeUser: async function(id: number){
                await UserService.removeOne({id: id});

                this.amountUsers--;
                this.getUsers({ take: this.take, skip: this.skip });

                this.$flashMessage.show(FlashMessageData.successMessage('Removing of user', `User with id = ${id} was removed`));
            },
        }

    });


</script>


<style lang="scss">
    @import "@/assets/scss/button.scss";
    @import "@/assets/scss/add-line.scss";

    .add-line{
        @extend %add-line;

        a{
            @extend %button;
        }

        .create-btn{
             @extend %create-button;
        }
    }
</style>