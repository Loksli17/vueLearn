<template>
  <div class="home">
      <h1>Start page</h1>

      <div class="wrap-link">
          <div class="link" v-for="link in links" :key="link.route">
              <router-link :to="link.route">
                  <div class="col-1"><img :src="require(`@/assets/img/home-page/${link.img}`)" alt=""></div>
                  <div class="col-2">
                      <h2>{{link.header}}</h2>
                      <p>{{link.text}}</p>
                  </div>
              </router-link>
          </div>
      </div>
  </div>
</template>


<script lang="ts">
    import {defineComponent} from 'vue';


    interface linkObject{
        route: string;
        img: string;
        text: string;
        header: string;
    }

    export default defineComponent({

        data: function(){
            return {
                links: [
                    {route: '/crud',       img: 'crud-img.svg',     text: 'CRUD for articles with material design from GOOGLE',                                        header: 'CRUD'},
                    {route: '/seq-crud',   img: 'seq-crud-img.svg', text: 'CRUD for articles with material design from GOOGLE and SEQUENCE ORM. Sequence orm in back', header: 'Sequlize CRUD'},
                    {route: '/long',       img: 'long-page.svg',    text: 'Page for test scrollToTop component',                                                       header: 'Scroll To Top component'},
                    {route: '/books-crud', img: 'crud-img.svg',     text: 'CRUD from BlackLirium'              ,                                                       header: 'Book'},
                ] as Array<linkObject>,
            }
        },

    });

</script>


<style lang="scss" scoped>

    .wrap-link{
        margin-top: 40px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
        gap: 20px;

        .link a{
            display: grid;
            grid-template-columns: 200px auto;
            text-decoration: none;
            background: rgb(233, 227, 233);
            padding: 20px;
            color: #000;
            border: 2px dashed #000;

            &:hover{
                border: 2px solid rgb(7, 161, 141);
            }

            p{
                font-size: 18px;
            }

            img{
                width: 100%;
            }
        }
    }
</style>
