<template>
    
    <div class="crud-seq-index">

        <h1>Index page of SEQUELIZE CRUD</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
        </div>

        <div class="buttons-wrap">
            <router-link :to="'/seq-crud/create'">Create item</router-link>
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
                    :current-page=currentPage
                    :page-gap="7"
                    :end-button="true"
                    :start-button="true"
                    :element-amount="amountUsers"
                    @page-change="pageChangeEvt"
                />
            </div>
        </div>
    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue';
    import Table               from '../../components/table/Table.vue';
    import Pagination          from '../../components/Pagination/Pagination.vue';
    import { Action, Column }  from '../../components/table/types';
    import UserService         from '../../services/UserService';
    import FlashMessageData    from '../../libs/flashMessage';


    export default defineComponent({
        
        components: {
            Pagination,
            Table,
        },

        data: function(){
            return {

                users: [] as Array<Record<string, any>>,

                columnNames: [
                    { displayedName: 'Id',      fieldName: 'id' },
                    { displayedName: 'E-mail',  fieldName: 'email' },
                    { displayedName: 'Login',   fieldName: 'login'},
                    { displayedName: 'Avatar',  fieldName: 'avatar'},
                    { displayedName: "Actions", fieldName: "actions" },
                ] as Array<Column>,
                tableConfig: {dropDownActions: true},
                tableActions: [
                        { name: "View",   path: (id: number) => `/seq-crud/${id}/view`, iconPath: require("./../../assets/img/table-icons/view.svg") }, 
                        { name: "Edit",   path: (id: number) => `/seq-crud/${id}/edit`, iconPath: require("./../../assets/img/table-icons/edit.svg") }, 
                        { name: "Delete", handler: this.removeUser,                     iconPath: require("./../../assets/img/table-icons/delete.svg") },
                ] as Array<Action>,

                take       : 10 as number,
                skip       : 0 as number,
                currentPage: 1 as number,
                amountUsers: 0 as number,
            }
        },

        mounted: async function(){
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

            pageChangeEvt: function(){
                this.getUsers({ take: this.take, skip: this.skip });
            },

            removeUser: async function(id: number){
                await UserService.removeOne({id: id});

                this.amountUsers--;
                this.getUsers({take: this.take, skip: this.skip});

                this.$flashMessage.show(FlashMessageData.successMessage('Removing of user', `User with id = ${id} was removed`));
            }
        }

    });


</script>