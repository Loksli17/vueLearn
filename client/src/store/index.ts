import store from 'vuex';


export default store({

    state: {
        userIdentity : localStorage.getItem('userIdentity')  == "undefined" ? null : JSON.parse(localStorage.getItem('userIdentity')!) as Record<string, unknown> | null,
        jwt          : localStorage.getItem('jwt')           == "undefined" ? null : localStorage.getItem('jwt') as string | null,
    }
});