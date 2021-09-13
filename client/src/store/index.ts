import {createStore} from 'vuex';

const store = createStore({

    state: {
        userIdentity : localStorage.getItem('userIdentity')  == "undefined" ? null : JSON.parse(localStorage.getItem('userIdentity')!) as Record<string, unknown> | null,
        jwt          : localStorage.getItem('jwt')           == "undefined" ? null : localStorage.getItem('jwt') as string | null,
    },

    getters: {
        isAuth: function(state): boolean{
            const jsonUser: string | null = localStorage.getItem('userIdentity');
            return jsonUser != 'undefined' ? true : false;
        },

        getUser: function(state): Record<string, unknown> | null{
            const jsonUser: string | null = localStorage.getItem('userIdentity');
            return (jsonUser && jsonUser != 'undefined') ? JSON.parse(jsonUser) : null;
        },

        getJWT: function(state): string | null{
            const jwt: string | null = localStorage.getItem('jwt');
            return (jwt && jwt != 'undefined') ? jwt : null;
        }
    },

    mutations: {
        setUserIdentity: function(state, user: Record<string, unknown> | null){
            if(user == null){
                localStorage.setItem('userIdentity', "undefined");
                state.userIdentity = null;
            }else{
                localStorage.setItem('userIdentity', JSON.stringify(user));
                state.userIdentity = Object.assign({}, user);
            }
        },

        
        setJWT: function(state, jwt: string | null){
            if(jwt == null){
                localStorage.setItem('jwt', "undefined");
            }else{
                localStorage.setItem('jwt', jwt);   
            }
            state.jwt = jwt;
        },
    }
});

export default store;