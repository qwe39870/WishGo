<template>
    <!-- 💖 收藏視窗 -->
    <transition name="fade">
        <div v-if="isOpen && !isMinimized" class="fixed inset-0 z-50 pointer-events-none">
            <div ref="modalRef"
                class="absolute pointer-events-auto bg-white w-[500px] rounded-[5px] border-2 border-pink-300 shadow-lg overflow-hidden"
                :class="{ shake: isShaking }" :style="{ top: `${position.y}px`, left: `${position.x}px` }">
                <!-- 標題列 -->
                <div class="header-bar px-4 py-2 flex items-center relative cursor-move select-none"
                    @mousedown="startDrag">
                    <h2 class="absolute inset-0 flex justify-center items-center text-lg font-bold text-white drop-shadow-md pointer-events-none">
                        我的收藏清單
                    </h2>
                    <div class="ml-auto flex gap-3 z-10">
                        <button @click="minimize" title="最小化" class="text-white hover:text-yellow-300 text-xl">-</button>
                        <button @click="close" class="text-white hover:text-red-300 text-xl">&times;</button>
                    </div>
                </div>

                <div class="p-4 max-h-[400px] overflow-y-auto">
                    <div v-if="favoriteStore.favoriteCount > 0" class="space-y-3">
                        <div v-for="item in favoriteStore.favoriteItems" :key="item.productId"
                            class="flex items-start justify-between bg-pink-50 p-3 rounded-xl shadow-sm">
                            <div class="flex items-center gap-3">
                                <img :src="`${apiUrl}/images/${item.productId}`"
                                    class="w-14 h-14 rounded-md object-cover" />
                                <div class="flex flex-col">
                                    <p class="text-pink-700 font-medium truncate max-w-[10rem]">{{ item.productName }}</p>
                                    <p class="text-sm text-pink-600">NT$ {{ item.price }}</p>
                                    <p class="text-xs text-gray-500">庫存：{{ item.inventory ?? '—' }}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-end gap-1">
                                <button @click="addToCart(item)" class="text-sm text-pink-500 hover:text-pink-700">加入購物車</button>
                                <button @click="remove(item.productId)" class="text-sm text-red-500 hover:text-red-700">移除</button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center text-gray-400 py-10">
                        🐰 目前沒有收藏的商品唷～
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <!-- 🔘 浮球模式 -->
    <div v-if="isMinimized" ref="ballRef" @mousedown="onBallMouseDown"
        class="fixed z-50 bg-gradient-to-tr from-pink-300 to-purple-300 text-white h-16 w-16  px-4 py-2 rounded-full shadow-lg cursor-pointer select-none"
        :style="{ top: `${ballPosition.y}px`, left: `${ballPosition.x}px` }">
        💖收藏
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useFavoriteStore } from '@/stores/favorite.js'
import { useCartStore } from '@/stores/cart.js'
import { useUserStore } from '@/stores/user'
import axios from '@/plugins/axios.js'
import { useToast } from 'vue-toastification'
const apiUrl = import.meta.env.VITE_API_URL
const isOpen = ref(false)
const isMinimized = ref(false)
const favoriteStore = useFavoriteStore()
const cartStore = useCartStore()
const userStore = useUserStore()
const toast = useToast()

const modalRef = ref()
const position = ref({ x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 200 })
const ballRef = ref()
const ballPosition = ref({ x: window.innerWidth - 120, y: window.innerHeight - 80 })

function open() {
    favoriteStore.fetchFavorites()
    isOpen.value = true
    isMinimized.value = false
}
function close() {
    isOpen.value = false
    isMinimized.value = false
}
function minimize() {
    isMinimized.value = true
}
function restore() {
    isMinimized.value = false
}

function remove(productId) {
    favoriteStore.removeFavorite(productId)
}

let offsetX = 0, offsetY = 0
function startDrag(e) {
    offsetX = e.clientX - modalRef.value.offsetLeft
    offsetY = e.clientY - modalRef.value.offsetTop
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
}
function onDrag(e) {
    position.value.x = Math.max(0, Math.min(window.innerWidth - 500, e.clientX - offsetX))
    position.value.y = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - offsetY))
}
function stopDrag() {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
}

let startX = 0, startY = 0, moved = false
function onBallMouseDown(e) {
    startX = e.clientX
    startY = e.clientY
    moved = false

    document.addEventListener('mousemove', onBallMouseMove)
    document.addEventListener('mouseup', onBallMouseUp)
}
function onBallMouseMove(e) {
    const dx = Math.abs(e.clientX - startX)
    const dy = Math.abs(e.clientY - startY)
    if (dx > 5 || dy > 5) {
        moved = true
        ballPosition.value.x = Math.max(0, Math.min(window.innerWidth - 120, e.clientX - 40))
        ballPosition.value.y = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - 40))
    }
}
function onBallMouseUp() {
    document.removeEventListener('mousemove', onBallMouseMove)
    document.removeEventListener('mouseup', onBallMouseUp)
    if (!moved) restore()
}

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('mousemove', onBallMouseMove)
    document.removeEventListener('mouseup', onBallMouseUp)
})

defineExpose({ open, close, isOpen, triggerShake, isMinimized, restore })

const isShaking = ref(false)
function triggerShake() {
    if (isShaking.value) return
    isShaking.value = true
    setTimeout(() => isShaking.value = false, 400)
}

async function addToCart(item) {
    if (!userStore.token) return alert('請先登入會員')

    const params = new URLSearchParams()
    params.append('productId', item.productId)
    params.append('quantity', 1)

    try {
        const res = await axios.post('/cart/add', params, {
            headers: {
                Authorization: `Bearer ${userStore.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        cartStore.fetchCart()
        toast.success('加入購物車成功！')
        console.log(res.data)
    } catch (err) {
        console.error('加入購物車失敗：', err)
    }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    50% { transform: translateX(8px); }
    75% { transform: translateX(-6px); }
    100% { transform: translateX(0); }
}
.shake {
    animation: shake 0.4s ease;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.header-bar {
    background: linear-gradient(135deg, #ff99cc, #f7c2ff, #b794f4);
    background-size: 300% 300%;
    animation: gradientShift 6s ease infinite;
}
</style>
