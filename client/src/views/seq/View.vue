<template>
    
    <div class="seq-view">
        <h1>View item page</h1>

        <div class="add-line">
            <router-link :to="'/'">Go home</router-link>
            <router-link :to="'/seq-crud'">Go index-crud</router-link>
            <router-link class="create-btn" :to="'/crud/create'">Create item</router-link>
        </div>

        <div class="table-wrap">
            <GridView
                v-if="user"
                :data="user"
                :fields="fields"
                :keysHandler="this.$filters.upperFirst"
            />
        </div>

        <div class="img-wrap">
            <img :src="`http://localhost:3000/seq/avatars/${user.avatar}`" alt="">
        </div>
    </div>
</template>


<script lang="ts">
    import {defineComponent} from 'vue';
    import GridView          from '../../components/GridView/GridView.vue';
    import UserService       from '../../services/UserService';


    export default defineComponent({

        components: {
            GridView,
        },

        data: function(){
            return {
                id    : 0 as number,
                user  : {} as Record<string, any> | null,
                fields: ['id', 'animal', 'login', {email: 'E-mail'}, 'avatar'],
            }
        },

        mounted: async function(){
            this.id   = Number(this.$route.params.id);
            const res: Record<string, any> | null = await UserService.getOne({id: this.id});
            if(res == null) return;
            this.user = res.user;
        },
    });

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

    .seq-view{
        .img-wrap{
            width: 40%;
            margin-top: 30px;

            img{
                width: 100%;
            }
        }
    }
</style>