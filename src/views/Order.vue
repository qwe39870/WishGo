<!-- <script setup>
import axios from 'axios'
import Header from '@/components/HomePage/Header.vue'

async function goToPayment() {
    const res = await axios.post('http://localhost:7010/youbike/ecpay/test', null, {
        params: {
            orderId: 'ORDER001',
            amount: 200
        }
    })

    const container = document.createElement('div')
    container.innerHTML = res.data
    document.body.appendChild(container)

    container.querySelector('form').submit()
}
</script>

<template>
    <Header />
    <button @click="goToPayment">前往綠界付款</button>
</template> -->
<template>
    <Header />
    <categories />
    <div class="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-2xl shadow-lg border border-pink-200">
        <h2 class="text-2xl font-bold text-pink-600 mb-6">🧾 訂單確認</h2>

        <div v-if="cartItems.length > 0">
            <div v-for="item in cartStore.cartItems" :key="item.productId"
                class="flex items-center mb-4 bg-pink-50 p-4 rounded-xl shadow-sm relative">

                <!-- 商品圖片 -->
                <img :src="`${apiUrl}/images/${item.productId}`" alt="商品圖片"
                    class="w-20 h-20 rounded-md object-cover mr-4" />

                <!-- 商品資訊 + 數量調整 -->
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-pink-700">{{ item.productName }}</h3>
                    <p class="text-sm text-gray-500">單價：NT$ {{ item.price }}</p>
                    <div class="flex items-center mt-2 gap-2">
                        <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1"
                            class="w-6 h-6 flex justify-center items-center rounded bg-pink-100 text-pink-600 hover:bg-pink-400 hover:text-white transition disabled:opacity-50">－</button>
                        <span class="w-8 text-center text-pink-600 font-medium">{{ item.quantity }}</span>
                        <button @click="increaseQuantity(item)"
                            class="w-6 h-6 flex justify-center items-center rounded bg-pink-100 text-pink-600 hover:bg-pink-400 hover:text-white transition">＋</button>
                    </div>
                </div>

                <!-- 價格 -->
                <p class="text-right text-pink-600 font-bold">NT$ {{ item.price * item.quantity }}</p>

                <!-- 右上功能區 -->
                <div class="absolute top-2 right-2 flex gap-1">
                    <!-- 加入追蹤 -->
                    <button @click="addToFavorites(item.productId)"
                        class="text-yellow-500 hover:text-yellow-600 text-xl">⭐</button>
                    <!-- 移除 -->
                    <button @click="removeItem(item.productId)"
                        class="text-red-500 hover:text-red-700 text-lg font-bold">&times;</button>
                </div>
            </div>

            <!-- 總計 + 按鈕 -->
            <div class="mt-6 flex justify-between items-center text-lg font-semibold border-t pt-4">
                <span class="text-gray-600">總金額：</span>
                <span class="text-pink-700">NT$ {{ totalPrice }}</span>
            </div>

            <div class="mt-6 flex justify-end gap-4">
                <button @click="goBack"
                    class="border border-pink-400 text-pink-500 px-6 py-2 rounded-full hover:bg-pink-100 transition">
                    ⬅ 返回購物車
                </button>
                <button @click="confirmOrder"
                    class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition">
                    🎀 確認送出訂單
                </button>
            </div>
        </div>

        <div v-else class="text-center text-gray-400 py-10">
            🐰 訂單無商品，請先加入購物車唷～
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { useRouter } from 'vue-router'
import { computed,onMounted } from 'vue'
import Header from '@/components/HomePage/Header.vue'
import Categories from '@/components/Categories.vue'
import axios from '@/plugins/axios.js'


const apiUrl = import.meta.env.VITE_API_URL

const cartStore = useCartStore()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()
const router = useRouter()

const cartItems = computed(() => cartStore.cartItems)

onMounted(() => {
  cartStore.fetchCart()
})

const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const increaseQuantity = (item) => {
    item.quantity++
    cartStore.updateCartQuantity(item.productId, item.quantity)
}

const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
        item.quantity--
        cartStore.updateCartQuantity(item.productId, item.quantity)
    }
}

const removeItem = (productId) => {
    cartStore.removeCart(productId)
}

const addToFavorites = (productId) => {
    // 假設你有 favoritesStore 或 call API
    favoriteStore.fetchFavorites()
    favoriteStore.addFavorite(productId)
    favoriteStore.fetchFavorites()
    cartStore.removeCart(productId)
    // favoritesStore.add(productId) // ← 實際邏輯
}

const goBack = () => {
    router.push('/')
}

import Swal from 'sweetalert2'

async function confirmOrder() {
    try {
        // 先讓使用者選付款方式
        const { value: method } = await Swal.fire({
            title: '選擇付款方式',
            input: 'select',
            inputOptions: {
                CREDIT_CARD: '綠界',
                COD: '貨到付款',
                BANK_TRANSFER: '銀行轉帳'
            },
            inputPlaceholder: '請選擇...',
            showCancelButton: true,
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            inputValidator: (value) => {
                if (!value) {
                    return '請選擇一種付款方式'
                }
            }
        })

        if (!method) return // 使用者取消

        const payload = {
            paymentMethod: method, // method 是 ENUM 字串（例：'COD'）
            items: cartStore.cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        }

        const res = await axios.post(
            '/orders/create',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            }
        )
        console.log(res.data.orderId);
        Swal.fire({
            title: '請稍候...',
            html: '<div class="pink-spinner"></div><p>正在召喚支付魔法陣</p>',
            allowOutsideClick: false,
            showConfirmButton: false,
            
            background: '#fff0f0',
            customClass: {
                popup: 'glass-alert',
            },
        })


        if (method === 'CREDIT_CARD') {
            cartStore.clearCart()
            goToPayment(res.data.orderId, res.data.totalAmount)
        } else {
            await Swal.fire('訂單已送出 ✨', '', 'success')
            cartStore.clearCart()
            router.push('/orderdetail')
        }
    } catch (err) {
        console.error('下單失敗', err)
        Swal.fire('下單失敗 😢', err.response?.data?.message || '請稍後再試', 'error')
    }
}



async function goToPayment(orderId, amount) {
    try {
        const res = await axios.post('/ecpay/test', null, {
            params: {
                orderId,
                amount
            }
        })

        
        const container = document.createElement('div')
        container.innerHTML = res.data
        document.body.appendChild(container)

        const form = container.querySelector('form')
        if (form) {
            form.submit()
        } else {
            throw new Error('未找到付款表單')
        }

    } catch (err) {
        console.error('跳轉付款頁失敗', err)
        Swal.fire('付款頁開啟失敗', '', 'error')
    }
}
</script>