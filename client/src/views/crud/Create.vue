<template>
    <div class="crud-index">
        <h1>Create item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/crud'">Go index-crud</router-link>
        </div>

        <div class="from-wrap">
            <DropDawnList ref="dropList"/>
        </div>

    </div>    
</template>


<script lang="ts">
    import {defineComponent} from 'vue';
    import axios             from '../../libs/axios';
    import DropDawnList      from '../../components/DropDawnList.vue';
    import { AxiosResponse } from 'axios;'
    

    export default defineComponent({

        components: {
            DropDawnList,
        },


        data: function(){
            return {
                types         : [] as Array<Record<string, unknown>>,
                currentValueId: 0 as number,
                article       : {} as Record<string, unknown>,
            }
        },

        mounted: async function(){
            await this.getTypes();
            this.initDropDawnList();
        },

        methods: {
            
            getTypes: async function(){

                await axios.get({
                    url: '/crud/types',
                    flashMessage: this.$flashMessage,
                    status: 200,
                    handler: (res: AxiosResponse) => {
                        this.types = res.data.types;
                    }
                });

                this.types.map(item => {
                    item.value = item.title;
                    delete item.title;
                    return item;
                });
            },

            initDropDawnList: function(){
                this.currentValueId = this.types[0].id;
                const dropList = this.$refs.dropList! as any;
                dropList.setListItems(this.types);
                dropList.setCurrentValueId(this.types[0].id);
            }
        },
    });
</script>