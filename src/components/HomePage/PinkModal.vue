<script setup>

import { defineEmits, defineProps } from 'vue'
import LoginForm from './LoginForm.vue'

const emit = defineEmits(['close', 'login-success'])

const props = defineProps({
    show: Boolean
})


function close() {
    emit('close')
}

function handleLoginSuccess() {
  emit('login-success')
  emit('close') // ✅ 登入成功自動關閉 modal
}



// function closeModal() {
//     document.getElementById("myModal").style.display = "none";
// }
</script>

<template>
    <!-- 遮罩背景 -->
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="myModal" @click.self="close"
        >
        <!-- Modal 內容 -->
        <div class="bg-backColor rounded-lg shadow-xl p-6 w-[90%] max-w-md relative animate-fade-in" style="border: 10px solid rgba(255, 255, 255, 0.3);">

            <!-- 關閉按鈕 -->
            <button @click="close"
                class="absolute top-2 right-2 text-pink-500 hover:text-pink-700 text-xl font-bold">&times;</button>

            <h2 class="text-2xl font-bold text-pink-600 text-center">🌸 WishGo</h2>
            <p class="text-pink-700"><LoginForm @close="close" @login-success="handleLoginSuccess" /></p>

            <!-- <div class="mt-6 text-right">
                <button @click="close"
                    class="bg-pinky hover:bg-pink-500 text-white font-semibold px-4 py-2 rounded shadow">關閉</button>
            </div> -->
        </div>
    </div>
    <!-- 開啟 Modal 的按鈕 -->
    <!-- <button @click="openModal()" class="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded shadow">
        開啟夢幻 Modal
    </button> -->

</template>
