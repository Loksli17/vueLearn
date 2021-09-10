<template>
    <div class="drop-down-container" v-click-outside="() => {showList = false}">
        <div class="drop-down-current">
            <div class="arrow"></div>
            <DropDownItem :item="currentOption" :clickable="true" v-on:item-clicked="toggleList"/>
            <div class="reset-button" @click.stop="resetChoice"><span>&#10006;</span></div>
        </div>

        <transition-group name="drop-down-content-animation">
            <div class="drop-down-list" v-if="showList">
                
                <DropDownSearch
                    v-if="enableSearch"
                    v-model:search-query="searchQuery"
                />

                <DropDownItem 
                    v-for="option in options" 
                    :key="option.id" 
                    :item="option"
                    @item-clicked="setCurrentOption"
                />
            </div>
        </transition-group>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import DropDownItem                  from "./DropDownItem.vue";
    import DropDownSearch                from "./DropDownSearch.vue";
    import { ListItem }                  from "./types";

    export default defineComponent({
        name: "DropDown",
        
        components: {
            DropDownItem,
            DropDownSearch
        },
        emits: ["update:current-option-id"],
        props: {
            optionsList: {
                type    : Object as PropType<Array<ListItem>>,
                required: true
            },
            currentOptionId: {
                type    : Number,
                // required: true
            },
            enableSearch: {
                type   : Boolean,
                default: false
            },
            disabledOption: {
                type: String,
                default: 'Please'
            }
        },

        data() {
            return {
                searchQuery: "" as string,
                showList   : false as boolean
            }
        },

        computed: {
            options(): Array<ListItem> {
                return this.optionsList?.filter(item => item.value.toString().includes(this.searchQuery.toLowerCase()));
            },

            currentOption: {

                //! it must work different !!!!!!!
                get(): ListItem {
                    
                    console.log('list currentOptionId', this.currentOptionId);
                    if(!this.currentOptionId) return {id: 0, value: this.disabledOption};
                    
                    let val = this.options?.find(item => item.id === this.currentOptionId);
                    
                    if (!this.options) {
                        val = {id: 1, value: ""}
                    } else if (!val) {
                        val = this.options[0];
                    }
                    return val;
                },

                set(newVal: ListItem): void {
                    this.$emit("update:current-option-id", newVal.id);
                }
            }
        },

        methods: {
            toggleList: function(): void {
                this.showList = !this.showList;
            },

            setCurrentOption: function(newVal: ListItem): void {
                this.currentOption = newVal;
                this.toggleList();
            }
        }
    });
</script>


<style lang="scss" scoped>
    .drop-down-content-animation-enter-active, .drop-down-content-animation-leave-active {
        transition: all 0.2s ease;
    }

    .drop-down-content-animation-enter-from {
        transform: translateY(20px);
        opacity: 0;
    }

    .drop-down-content-animation-leave-to {
        transform: translateY(20px);
        opacity: 0;
    }

    .drop-down-container {
        position: relative;
        margin-top: 30px;
        max-width: 340px;

        .drop-down-list {
            width: 100%;
            height: max-content;
            max-height: 270px;
            overflow-y: auto;
            background: white;
            position: absolute;
            z-index: 9999;
            border: 2px solid rgb(237, 237, 243);;
            box-sizing: border-box;

            
        }

        .drop-down-current {
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

            .reset-button {
                display: grid;
                justify-content: center;
                align-items: center;

                span{
                    font-size: 24px;
                }
            }
        }
    }

</style>