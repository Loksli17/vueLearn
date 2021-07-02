<template>

    <div class="drop-dawn-list-wrap">

        <div class="current-value" @click="statusList = !statusList">
            <img src="" alt="">
            <span>{{currentItem.value}}</span>
        </div>

        <input type="hidden" v-model="currentItem.id">

        <div v-if="statusList" class="list-item-wrap">
            <div class="item" v-for="item in listItems" :key="item" @click="setCurrentValue(item.id)">
                <span class="img">{{item.img}}</span>
                <span class="value">{{item.value}}</span>
            </div>
        </div>
    </div>

</template>


<script lang="ts">
    import {defineComponent} from 'vue';

    export interface ListItem{
        id: number;
        value: string | number;
        img?: string;
    }

    export default defineComponent({

        data: function(){
            return {
                currentItem: {} as ListItem,
                listItems  : [] as Array<ListItem>,
                currentValueId: 0 as number,
                statusList: false as boolean,
            }
        },

        methods: {

            setListItems: function(data: Array<ListItem>){
                this.listItems = data.slice();
                console.log(this.listItems);
            },

            setCurrentValueId: function(value: number){
                this.currentValueId = value;
                this.currentItem = this.listItems.find(item => item.id == this.currentValueId);
            },

            setCurrentValue: function(value: number){
                this.currentValueId = value;
                this.currentItem = this.listItems.find(item => item.id == this.currentValueId);
                this.statusList = false;
            },
        }
    });
</script>