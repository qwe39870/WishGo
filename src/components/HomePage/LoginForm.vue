<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'
import { defineEmits } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const emit = defineEmits(['login-success'])

// const emit = defineEmits(['submit'])

const username = ref('')
const password = ref('')

const loginMessage = ref('')
const errorMessage = ref('')
const logoutMessage = ref('')

async function onSubmit() {
    console.log("登入被按了");
    console.log("登入帳號 = ", username.value);
    console.log("登入密碼 = ", password.value);
    if (username.value === "") {
        username.value = null;
    }
    if (password.value === "") {
        password.value = null;
    }
    const body = {
        "username": username.value,
        "password": password.value,
    };

    userStore.setToken("");
    userStore.setEmail("");
    userStore.setLogin(false);
    userStore.setNickName("");

    try {
        const response = await axios.post("/base/login", body);
        console.log("response1", response);
        if (response.data.success) {
            await Swal.fire({
                text: response.data.success,
                icon: "success",
            });
            console.log("res="+response.data);
            userStore.setToken(response.data.token);
            userStore.setEmail(response.data.email);
            userStore.setLogin(true);
            userStore.setNickName(response.data.nickname);
            emit('login-success')
            
        } else {
            Swal.fire({
                text: response.data.message,
                icon: "warning",
            });
        }
    } catch (error) {
        console.log("error", error);
        Swal.fire({
            text: error.response.data.error,
            icon: "error",
        })
    }

}

const apiUrl = import.meta.env.VITE_API_URL

async function onGoogleLogin() {
    console.log("Google登入被按了");
    // console.log(apiUrl);
    window.location.href = 'https://5def834ceef2.ngrok-free.app/youbike/oauth2/authorization/google';

}
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4 p-6 max-w-full mx-auto">
        <!-- <h2 class="text-2xl font-bold text-pink-700 mb-4 text-center drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]">
            登入商城
        </h2> -->

        <!-- 帳號 -->
        <input id="username" v-model="username" type="text" placeholder="帳號" required
            class="w-full px-4 py-2 rounded-full border-2 border-pink-200 placeholder-pink-300 text-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-md transition" />

        <!-- 密碼 -->
        <input id="password" v-model="password" type="password" placeholder="密碼" required
            class="w-full px-4 py-2 rounded-full border-2 border-pink-200 placeholder-pink-300 text-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent shadow-md transition" />

        <!-- 記住我 -->
        <div class="flex justify-center items-center space-x-2">
            <input id="rememberMe" type="checkbox" v-model="rememberMe"
                class="w-4 h-4 text-pink-600 bg-pink-100 rounded border-pink-200 focus:ring-pink-400" />
            <label for="rememberMe" class="text-pink-700 font-medium select-none cursor-pointer">記住我</label>
            <button type="button" @click="onForgotPassword"
                class="ml-auto text-sm text-pink-500 hover:text-pink-700 transition underline">
                忘記密碼？
            </button>
        </div>

        <!-- 登入按鈕 -->
        <button type="submit"
            class="w-full bg-pinky text-white py-2 rounded-full shadow hover:bg-pink-500 transition font-semibold">
            登入
        </button>

        <!-- 或社群登入 -->
        <div class="text-center text-pink-500 font-semibold mt-3">或用以下方式登入</div>

        <div class="flex justify-center space-x-4 mt-2">
            <button type="button" @click="onGoogleLogin"
                class="flex bg-white items-center space-x-2 border-2 border-pink-200 rounded-full px-4 py-1 hover:bg-pink-200 transition">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5" />
                <span class="text-pink-700 font-medium">Google</span>
            </button>
            <button type="button" @click="onFacebookLogin"
                class="flex bg-white items-center space-x-2 border-2 border-pink-200 rounded-full px-4 py-1 hover:bg-pink-200 transition">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" class="w-5 h-5" />

                <span class="text-pink-700 font-medium">Facebook</span>
            </button>
        </div>

        <!-- 註冊 -->
        <div class="text-center mt-4">
            <span class="text-pink-700 font-semibold">還沒有帳號？</span>
            <button type="button" @click="onRegister" class="text-pink-600 font-semibold hover:underline ml-2">
                註冊
            </button>
        </div>

        <!-- 訊息區 -->
        <div v-if="loginMessage" class="mt-2 text-green-600 font-medium text-center">{{ loginMessage }}</div>
        <div v-if="errorMessage" class="mt-2 text-red-600 font-medium text-center">{{ errorMessage }}</div>
        <div v-if="logoutMessage" class="mt-2 text-pink-600 font-medium text-center">{{ logoutMessage }}</div>
    </form>
</template>