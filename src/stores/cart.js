// stores/cart.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios.js'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
    const cartItemCount = ref(0)
    const cartItems = ref([])
    const userStore = useUserStore()

    async function fetchCart() {
        try {
            const res = await axios.get('/cart/cart', {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            })
            // console.log("Cart Store:"+res);
            cartItems.value = res.data.cart
            cartItemCount.value = res.data.cartItem

            console.log("已找到使用者購物車");
        } catch (err) {
            console.error('取得購物車失敗:', err)
        }
    }

    async function clearCart() {
        cartItems.value = []
        cartItemCount.value = 0

        try {
            const res = await axios.delete('/cart/clear', {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            })
            console.log("已清空購物車");
        }

        catch (err) {
            console.error('清空購物車失敗:', err)
        }

    }




    async function updateCartQuantity(productId, quantity) {
        try {
            const response = await axios.put('/cart/quantity', null, {
                headers: {
                    'Authorization': `Bearer ${userStore.token}`
                },
                params: {
                    productId,
                    quantity
                }
            })

            console.log('更新成功:', response.data)

            // 👉 更新前端 cartItems 中的對應商品數量
            const target = cartItems.value.find(item => item.productId === productId)
            if (target) {
                target.quantity = quantity
            }

        } catch (error) {
            console.error('更新失敗:', error.response?.data || error.message)
        }
    }

    async function removeCart(productId) {
        try {
            const response = await axios.delete('/cart/remove', {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                },
                params: {
                    productId
                }
            })

            console.log('移除成功:', response.data)

            // 前端同步移除該商品
            cartItems.value = cartItems.value.filter(item => item.productId !== productId)
            cartItemCount.value = cartItems.value.length // 或重新計算總數

        } catch (error) {
            console.error('移除失敗:', error.response?.data || error.message)
        }
    }

    return {
        cartItems,
        cartItemCount,
        fetchCart,
        clearCart,
        updateCartQuantity,
        removeCart
    }
}, {
    persist: true
})
