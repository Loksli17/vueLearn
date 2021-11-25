<template>
    
    <div class="add-line">
        <router-link :to="'/'">Go home</router-link>
        <router-link class="create-btn" :to="'/animals/create'">Create item</router-link>
    </div>

    <Table
        v-if="animals"
        :column-names="columnNames" 
        :row-data="animals" 
        :actions="tableActions"
        :config="tableConfig"
        >
    </Table> 


    <Pagination 
        :element-amount="amountAnimals" 
        v-model:skip="skip" 
        v-model:take="take"
        :start-button="true"
        :end-button="true"
        class-name="custom-pagination"
        item-class="custom-pagination-item"
        active-page-class="custom-pagination-item-active"
        next-page-content=">"
        prev-page-content="<"
        :next-page-src="'@/assets/img/logo.png'"
        :page-gap="7" />

</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import AnimalService       from '@/services/AnimalService';
    import Table               from '@/components/table/Table.vue';
    import { Action, Column }  from '@/components/table/types';
    import Pagination          from "@/components/Pagination/Pagination.vue";
    import FlashMessageData    from '@/libs/flashMessage';

    export default defineComponent({

        components: {
            Table,
            Pagination
        },

        data(){
            return {
                animals      : [] as Array<Record<string, unknown>>,
                amountAnimals: 0 as number,
                take         : 10 as number,
                skip         : 0 as number,

                columnNames: [
                    { displayedName: 'Id',      fieldName: 'id' },
                    { displayedName: 'Name',    fieldName: 'name' },
                    { displayedName: 'Type',    fieldName: 'type'},
                    { displayedName: "Actions", fieldName: "actions" },
                ] as Array<Column>,
                tableConfig: {dropDownActions: true},
                tableActions: [
                        { name: "Edit",   path: (id: number) => `/animals/${id}/edit`, iconPath: require("./../../assets/img/table-icons/edit.svg") }, 
                        { name: "Delete", handler: this.removeAnimal,                  iconPath: require("./../../assets/img/table-icons/delete.svg") },
                ] as Array<Action>,
            }
        },
        
        async mounted() {
            this.skip = (+(this.$route.query.page ?? 0) - 1) * 10;
            await this.getAnimals({take: this.take, skip: this.skip});
            await this.amount();
        },


        methods: {

            async getAnimals(data: {take: number, skip: number}){
               this.animals = await AnimalService.getAnimals(data) || [];
            },

            async amount(){
                const res = await AnimalService.amount();

                if (res) this.amountAnimals = res;
            },

            async removeAnimal(id: number){
                await AnimalService.removeOne(id);

                this.amountAnimals--;
                this.getAnimals({ take: this.take, skip: this.skip });

                this.$flashMessage.show(FlashMessageData.successMessage('Record deleted', `Record with an id = ${id} was removed`));
            }
        }
    })
</script>


<style lang="scss">
    @import "@/assets/scss/button.scss";
    @import "@/assets/scss/add-line.scss";

    .add-line {
        @extend %add-line;

        a {
            @extend %button;
        }

        .create-btn {
            @extend %create-button;
        }
    }

    .custom-pagination {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        column-gap: 5px;
        
        .custom-pagination-item {
            background-color: white;
            padding: 10px 15px;
            border: 2px solid black;
            border-radius: 10px;
            text-decoration: none;
            color: black;

            &:hover {
                background-color: gray;
                color: white;
            }
        }

        .custom-pagination-item-active {
            background-color: #ccc;
        }
    }

</style>