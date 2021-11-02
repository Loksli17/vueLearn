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
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import AnimalService       from '../../services/AnimalService';
    import Table               from '../../components/table/Table.vue';
    import { Action, Column }  from '../../components/table/types';
    import FlashMessageData    from '../../libs/flashMessage';

    export default defineComponent({

        components: {
            Table,
        },

        data(){
            return {
                animals      : [] as Array<Record<string, any>>,
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
        
        async mounted(){
            await this.getAnimals({take: this.take, skip: this.skip});
            await this.amount();
        },


        methods: {

            async getAnimals(data: {take: number, skip: number}){
               this.animals = await AnimalService.getAnimals(data);
            },

            async amount(){
                this.amountAnimals = await AnimalService.amount();
            },

            async removeAnimal(id: number){
                await AnimalService.removeOne(id);

                this.amountAnimals--;
                this.getAnimals({ take: this.take, skip: this.skip });

                this.$flashMessage.show(FlashMessageData.successMessage('Removing of animal', `Animal with id = ${id} was removed`));
            }
        }
    })
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