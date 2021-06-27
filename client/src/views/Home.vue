<template>
  <div class="home">
      <h1>Start page</h1>

      <div class="wrap-link" v-for="link in links" :key="link.route">

          <div class="link">
              <router-link :to="link.route">
                  <div class="col-1"><img :src="require(`@/assets/img/${link.img}`)" alt=""></div>
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
                    {route: '/crud', img: 'logo.png', text: 'CRUD for articles with material design from GOOGLE', header: 'CRUD'},
                ] as Array<linkObject>,
            }
        },

        // created: function(){
            
        // },
    });

    // @Options({

    //     

    //     created: function(){
    //         console.log()
    //     }
    // })

    // export default class Home extends Vue {}
</script>
