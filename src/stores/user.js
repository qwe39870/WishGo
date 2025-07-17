// // stores/user.js
// import { defineStore } from 'pinia'

// export const useUserStore = defineStore('user', {
//   state: () => ({
//     isLoggedIn: false,
//     user: null
//   }),
//   actions: {
//     login(userData) {
//       this.user = userData
//       this.isLoggedIn = true
//     },
//     logout() {
//       this.user = null
//       this.isLoggedIn = false
//     }
//   }
// })

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCartStore } from './cart';

export const useUserStore = defineStore('user', function () {

    const nickName = ref("");
    function setNickName(data) {
        nickName.value = data;
    }

    const email = ref("");
    function setEmail(data) {
        email.value = data;
    }

    const token = ref("");
    function setToken(data) {
        const tokenOauth = localStorage.getItem('jwt')
        if (tokenOauth) {
            token.value = tokenOauth;
            // console.log("tokenOauth:"+token.value);
        }else{
            token.value = data;
        }

    }

    const isLogin = ref(false);
    async function setLogin(data) {
        isLogin.value = data;
        if (data) {
            const cartStore = useCartStore()
            await cartStore.fetchCart()
        }
    }

    function logout() {
        email.value = ''
        token.value = ''
        isLogin.value = false
        nickName.value = '';

        const cartStore = useCartStore()
        
    }


    return {
        nickName,setNickName,
        email, setEmail,
        token, setToken,
        isLogin, setLogin,
        logout
    }
}, {

    persist: true

});
