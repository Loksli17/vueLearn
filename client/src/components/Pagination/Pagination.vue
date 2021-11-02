<template>
    <div v-if="displayStatus" class="pages">
        <div :class="classNameData">

            <div v-if="firstPage">
                <PaginationPage :page="firstPage" @clicked="setCurrentPageEvt(firstPage.link)" :url="url" />
            </div>

            <div v-if="prevPage">
                <PaginationPage :page="prevPage"  @clicked="setCurrentPageEvt(prevPage.link)" :url="url"/>
            </div>

            <template v-for="page in pages" :key="page">
                <div>
                    <PaginationPage :page="page" @clicked="setCurrentPageEvt(page.link)" :url="url"/>
                </div>
            </template>

            <div v-if="nextPage">
                <PaginationPage :page="nextPage" @clicked="setCurrentPageEvt(nextPage.link)" :url="url" />    
            </div>
            <div v-if="lastPage">
                <PaginationPage :page="lastPage" @clicked="setCurrentPageEvt(lastPage.link)" :url="url" />    
            </div>
        </div>
    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue';
    import PaginationPage      from './PaginationPage.vue';
    import { Page }            from './types';

    
    export function countSkip(getParam: number, take: number){
        return (Number(getParam) - 1) * take;
    }
    

    export default defineComponent({
        
        components: {
            PaginationPage
        },

        props: {
            take: {
                type    : Number,
                required: true,
            },
            skip: {
                type: Number,
                required: true
            },
            pageGap: {
                type    : Number,
                required: true,
            },
            className: {
                type: String,
            },
            itemClass: {
                type: String,
            },
            endButton: {
                type: Boolean,
            },
            startButton: {
                type: Boolean,
            },
            activePageClass: {
                type: String,
            },
            elementAmount: {
                type    : Number,
                required: true
            },
            nextPageContent: {
                type   : String,
                default: ">>", 
            },
            nextPageSrc: {
                type   : String,
                default: undefined,
            },
            prevPageContent: {
                type   : String,
                default: "<<", 
            },
            prevPageSrc: {
                type   : String,
                default: undefined,
            },
        },

        emits: ["update:take", "update:skip", "page-change", "query"],
        
        data: function(){
            return {
                pages              : [] as Array<Page>,
                maxPage            : 0 as number,
                localCurrentPage   : 0 as number,
                classNameData      : '' as string,
                itemClassData      : '' as string,
                activePageClassData: '' as string,
                prevPage           : undefined as Page | undefined,
                nextPage           : undefined as Page | undefined,
                lastPage           : undefined as Page | undefined,
                firstPage          : undefined as Page | undefined,
                displayStatus      : true as boolean,
            }
        },

        watch: {
            elementAmount: function(): void {

                //! think about restructed of this methods
                this.init();
                this.render();
                this.$emit("update:take", this.take);
                this.$emit("update:skip", this.skip);
            }
        },

        computed: {
            localSkip: {
                get(): number {
                    console.log('get');
                    return this.skip;
                },
                set(val: number): void {
                    console.log('setter:', val);
                    this.$emit("update:skip", val);
                }
            },

            getParam: function(): number {
                return Number(this.$route.query.page) || Number(this.$route.params.page) || 1;
            },

            url: function(): string {
                return this.$route.name as string;
            }
        },

        methods: {

            init: function(): void{
                this.maxPage = Math.ceil(this.elementAmount / this.take);
                
                this.classNameData       = this.className       == undefined ? 'pages-wrap' : this.className;
                this.itemClassData       = this.itemClass       == undefined ? 'page' : this.itemClass;
                this.activePageClassData = this.activePageClass == undefined ? 'active-page' : this.activePageClass;

                this.localCurrentPage = this.getParam > this.maxPage ? this.maxPage : this.getParam;

                // this.$emit('update:skip', this.take * (this.localCurrentPage - 1));
                
                // // this.skip             = this.take * (this.localCurrentPage - 1);
                // // this.localSkip        = this.take * (this.localCurrentPage - 1);

                console.log('pagination-skip', this.skip, this.localSkip, this.localCurrentPage, this.take * (this.localCurrentPage - 1));
            },

            render: function(): void{
                const pageEndPoints: {first: number; last: number} = this.countEndPoints();
                
                this.pages = this.createPages(pageEndPoints.first, pageEndPoints.last);
                const stepPages: {next: Page | undefined; prev: Page | undefined} = this.createStepPages();
                
                this.nextPage = stepPages.next;
                this.prevPage = stepPages.prev;
                
                const endPointPages: {last: Page | undefined; first: Page | undefined} = this.createEndPointsPages();
                
                if(this.endButton) this.lastPage = endPointPages.last;
                
                if(this.startButton) this.firstPage = endPointPages.first;
            },


            countEndPoints: function(): {first: number; last: number} {

                let 
                    first: number = 0,
                    last : number = 0;
               
                if(Number(this.localCurrentPage) + (this.pageGap / 2) >= this.maxPage) {
                    last  = this.maxPage;
                    first = this.maxPage - this.pageGap + 1;
                }else if(Number(this.localCurrentPage) - (this.pageGap / 2) <= 1){
                    first = 1;
                    last = this.pageGap;
                }else{
                    first = Math.ceil(Number(this.localCurrentPage) - this.pageGap / 2);
                    last = first + this.pageGap - 1;
                }
                
                if(last > this.maxPage) last = this.maxPage
                
                if(first < 1)  first = 1 
                
                return { first: first, last: last};
            },


            createPages: function(first: number, last: number): Array<Page> {
                if(this.elementAmount <= this.take){return [];}
                
                const pages: Array<Page> = [];
                
                for(let i = first; i <= last; i++){
                    const page: Page = { number: i, content: `${i}`, class: this.itemClassData };
                    if(i == this.localCurrentPage){
                        page.current = true;
                        page.class += ` ${this.activePageClassData}`;
                    }
                    pages.push(page);
                }

                return pages;
            },


            createStepPages: function(): {next: Page | undefined; prev: Page | undefined} {
                
                if(this.elementAmount <= this.take){return {next: undefined, prev: undefined};}
                
                const
                    nextNum: number = (this.localCurrentPage + 1) > this.maxPage ? this.maxPage : this.localCurrentPage + 1,
                    prevNum: number = (this.localCurrentPage - 1) < 1            ? 1            : this.localCurrentPage - 1;
                
                return {
                    next: { number: nextNum, content: this.nextPageContent, class: this.itemClassData },
                    prev: { number: prevNum, content: this.prevPageContent, class: this.itemClassData },
                };
            },
            

            createEndPointsPages: function(): {last: Page | undefined; first: Page | undefined}{
                
                if(this.elementAmount <= this.take){ return { last: undefined, first: undefined } }
               
                return {
                    first: { number: 1,            content: 'First', class: this.itemClassData, },
                    last : { number: this.maxPage, content: 'Last',  class: this.itemClassData, },
                };
                
            },

            changeGetParam: function(pageNumber: number){
                //todo: i need in best way of this shit!! it way doesn't work with prev and next page buttons
                //? may be user watch?
                this.$router.push(`${this.url}?page=${pageNumber}`);
            },

            getCurrentPage: function(){
                return this.localCurrentPage;
            },
            

            getSkip: function(){
                return this.skip;
            }
        },
    });
</script>


<style lang="scss" scoped>
    
    .pages{

        margin-top: 30px;

        .pages-wrap{
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: max-content;

            div{
                .page{
                    display: block;
                    padding: 10px 15px;
                    font-size: 20px;
                    color: #000;
                    text-decoration: none;
                    border-top: 2px #85e7ca solid;
                    border-bottom: 2px #85e7ca solid;
                    border-right: 2px #85e7ca solid;

                    &:hover{
                        background: paleturquoise;
                        transition: 0.4s;
                    }
                }

                .active-page{
                    background: #85e7ca;
                }

                &:first-child .page{
                    border-left: 2px #48d8ad solid;
                }
            } 
        }
    }
    

</style>