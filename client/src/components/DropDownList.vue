<template>

    <div class="drop-dawn-list-wrap" v-click-outside="hideList">

        <div class="current-value" @click.prevent="statusList = !statusList">
            
            <div class="arrow"></div>
            
            <div class="item">
                <img width="25" v-if="currentItemData.img" :src="require(`@/assets/img/article-types/${currentItemData.img}`)" alt="">
                <span>{{currentItemData.value || choiceMessegeData}}</span>
            </div>
            
            <div class="reset-button" @click.stop="resetChoice"><span>&#10006;</span></div>
        </div>

        <input type="hidden" :name="name" v-model="currentItemData.id">

        <transition-group name="list-content-animation">
            <div v-if="statusList" class="list-content">

                <div v-if="search" class="search-wrap">
                    <input type="search" v-model="searchData">
                </div>

                <div  class="list-item-wrap">
                    <div class="item" v-for="item in listItemsData" :key="item" @click="setCurrentItem(item)">
                        <img width="25" v-if="item.img" :src="require(`@/assets/img/article-types/${item.img}`)" alt="">
                        <span class="value">{{item.value}}</span>
                    </div>
                </div>
            </div>
        </transition-group>
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
                currentItemData  : {} as ListItem | undefined,
                currentIdData    : 0 as number,
                statusList       : false as boolean,
                choiceMessegeData: this.choiceMessege as string,
                searchData       : "" as string, 
            }
        },

        props: {
            listItems: {
                type   : Array as () => Array<ListItem>,
                default: () => [],
            },
            choiceMessege: {
                type   : String,
                default: 'Please, choose item',
            },
            search: {
                type   : Boolean,
                default: false,
            },
            name: {
                type: String,
                default: 'select',
            }
        },

        computed: {
            listItemsData: function(): Array<ListItem>{
                return this.listItems.filter((item: ListItem) => item.value.toString().includes(this.searchData)).slice();
            },
        },

        methods: {

            setListItems: function(data: Array<ListItem>){
                this.listItemsData = data.slice();
            },

            setCurrentItemId: function(id: number){
                this.currentIdData   = id;
                this.currentItemData = this.listItemsData.find(item => item.id == this.currentIdData);
            },

            setCurrentItem: function(listItem: ListItem){
                this.currentIdData   = listItem.id;
                this.currentItemData = listItem;
                this.statusList      = false;
            },

            resetChoice: function(){
                this.currentItemData = {} as ListItem; 
            },

            hideList: function(): void{
                this.statusList = false;
            }
        }
    });
</script>


<style lang="scss" scoped>

    .list-content-animation-enter-active, .list-content-animation-leave-active{
        transition: all 0.2s ease;
    }

    .list-content-animation-enter-from{
        transform: translateY(20px);
        opacity: 0;
    }

    .list-content-animation-leave-to{
        transform: translateY(20px);
        opacity: 0;
    }

    .list-content{
        width: 100%;
        background: white;
        position: absolute;
        border: 2px solid rgb(237, 237, 243);;
        box-sizing: border-box;
    }

    .drop-dawn-list-wrap{

        position: relative;
        margin-top: 30px;
        max-width: 340px;

        .current-value{
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: 10px 1fr 40px;
            justify-content: space-between;
            background: rgb(237, 237, 243);
            cursor: pointer;

            &:hover{
                transition: 0.4s;
                background: gainsboro;
            }

            .reset-button{
                display: grid;
                justify-content: center;
                align-items: center;

                span{
                    font-size: 24px;
                }
            }
        }

        .list-content{
            height: max-content;
            max-height: 270px;
            overflow-y: auto;

            .search-wrap{
                width: 100%;
                padding: 10px;
                box-sizing:  border-box;

                input{
                    width: 100%;
                    font-size: 18px;
                    padding: 8px;
                    box-sizing: border-box;
                }
            }

            .item:hover{
                transition: 0.4s;
                background: rgb(212, 212, 238);
                cursor: pointer;
            }
        }

        .item{
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: max-content auto;
            column-gap: 12px;
            align-items: center;
            padding: 13px 16px;
            font-size: 20px;
        }
    }

</style>