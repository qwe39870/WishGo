<template>
    <transition name="slide">
        <div v-if="isOpen" class=" fixed h-screen top-[0px] right-0 w-80 bg-white shadow-lg z-30 p-4 overflow-y-auto">
            
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">購物車</h2>
                <div class="flex gap-2">
                    <button class="bg-pink-500 text-white px-3 py-1 rounded text-sm" @click="goCheckout">前往結帳</button>
                    <button class="border border-pink-500 text-pink-500 px-3 py-1 rounded text-sm"
                        @click="closeSidebar">繼續購物</button>
                </div>
            </div>
            <!-- <button class="absolute top-4 right-4 text-gray-500" @click="closeSidebar">✕</button> -->

            <div v-if="cartStore.cartItemCount === 0 || cartStore.cartItemCount === null"
                class="text-center text-gray-400">
                購物車是空的唷～
            </div>

            <div v-else>
                <div v-for="item in cartStore.cartItems" :key="item.productId"
                    class=" mb-1 p-2 border rounded-md shadow-sm flex items-center gap-3 relative">

                    <!-- 商品圖片 -->
                    <img :src="`${apiUrl}/images/${item.productId}`" alt="商品圖片"
                        class="w-16 h-16 rounded-md object-cover flex-shrink-0" />

                    <!-- 內容區 -->
                    <div class="flex-1 flex flex-col justify-between h-14 relative pr-8">

                        <!-- 商品名稱 -->
                        <p class="font-semibold text-pink-700 text-base truncate" :title="item.productName">{{
                            item.productName }}</p>

                        <!-- 數量調整 -->
                        <div class="flex items-center space-x-1 mt-1">
                            <button @click.stop.prevent="decreaseQuantity(item)" :disabled="item.quantity <= 1"
                                class="w-6 h-6 flex justify-center items-center rounded bg-pink-100 text-pink-600 hover:bg-pink-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed text-lg leading-none">－</button>

                            <span class="w-6 text-center font-medium text-pink-600 select-none text-sm">{{ item.quantity
                            }}</span>

                            <button @click.stop.prevent="increaseQuantity(item)"
                                class="w-6 h-6 flex justify-center items-center rounded bg-pink-100 text-pink-600 hover:bg-pink-400 hover:text-white transition text-lg leading-none">＋</button>
                        </div>

                    </div>

                    <!-- 右下價格 -->
                    <p class="absolute bottom-2 right-2 text-pink-600 font-bold text-sm whitespace-nowrap">
                        NT$ {{ item.price * item.quantity }}
                    </p>

                    <!-- 右上移除按鈕 -->
                    <button @click.stop.prevent="removeItem(item.productId)" aria-label="移除商品"
                        class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow hover:bg-red-500 hover:text-red-900 transition">
                        &times;
                    </button>

                </div>

                



            </div>
            
            
        </div>
        
    </transition>
</template>

<script setup>
import { ref, defineEmits, inject  } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const apiUrl = import.meta.env.VITE_API_URL


const unpinCart = inject('unpinCart')

const emit = defineEmits(['close'])

const cartStore = useCartStore()
const isOpen = ref(false)
const cart = ref([])


function removeItem(productId) {
    console.log("刪除購物車商品被按了="+productId);
    cartStore.removeCart(productId)
}

function increaseQuantity(item) {
    item.quantity += 1
    // updateQuantity(item)
    // console.log(item);
    cartStore.updateCartQuantity(item.productId, item.quantity)
}

function decreaseQuantity(item) {
    if (item.quantity > 1) {
        item.quantity -= 1
        cartStore.updateCartQuantity(item.productId, item.quantity)
    }
}


const openSidebar = async () => {
    // await cartStore.fetchCart()
    cart.value = cartStore.cartItems
    // console.log(cart.value);
    // console.log(cartStore.cartItemCount);

    isOpen.value = true
}

const closeSidebar = () => {
    unpinCart?.()
    emit('close')
    isOpen.value = false
}

const goCheckout = () => {
    router.push('/order') // 替換成你的路由
    isOpen.value = false
}

const router = useRouter()



defineExpose({ openSidebar, closeSidebar })
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}
</style>