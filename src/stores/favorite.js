// stores/favorite.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios.js'
import { useUserStore } from './user'
import { useToast } from 'vue-toastification'

export const useFavoriteStore = defineStore('favorite', () => {
    const favoriteItems = ref([])         // 收藏清單
    const favoriteCount = ref(0)          // 收藏數
    const userStore = useUserStore()
    const favoriteIdSet = ref(new Set()) // 裡面放 productId


    const toast = useToast()

    // 取得使用者收藏
    async function fetchFavorites() {
        try {
            const res = await axios.get('/favorites', {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            })

            favoriteItems.value = res.data
            favoriteCount.value = res.data.length
            favoriteIdSet.value = new Set(res.data.map(item => item.productId))

            console.log("✅ 已成功取得使用者收藏")
        } catch (err) {
            console.error('❌ 取得收藏失敗:', err.response?.data || err.message)
        }
    }

    function isInFavorites(productId) {
        return favoriteIdSet.value.has(productId)
    }

    // 移除單筆收藏
    async function removeFavorite(productId) {
        try {
            const res = await axios.delete('/favorites/remove', {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                },
                params: { productId }
            })

            // 前端同步移除
            favoriteItems.value = favoriteItems.value.filter(item => item.productId !== productId)
            favoriteCount.value = favoriteItems.value.length
            favoriteIdSet.value.delete(productId)

            console.log('🗑️ 移除收藏成功:', res.data)
        } catch (err) {
            console.error('❌ 移除收藏失敗:', err.response?.data || err.message)
        }
    }

    async function addFavorite(productId) {
        const token = localStorage.getItem('jwt')
        const params = new URLSearchParams()
        params.append('productId', productId)
        // console.log(userStore.token);
        if (!userStore.token) {
            alert('請先登入會員')
            return
        }

        try {
            // console.log(token);
            const res = await axios.post(
                '/favorites/add',
                params,
                {
                    headers: {
                        Authorization: `Bearer ${userStore.token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            // toast.success('已加入收藏！')

            console.log(res.data)
            if (!res.data.isFavorite) {
                favoriteIdSet.value.add(productId)
                // favoriteItems.value.unshift(res.data.product) // ← 加進陣列最前面
                toast.success('已加入收藏！')
            } else {
                removeFavorite(productId)
                toast.error('已移除收藏！')
            }
            



        } catch (err) {
            console.error('加入收藏失敗：', err)
        }
    }

    return {
        favoriteItems,
        favoriteCount,
        isInFavorites,   
        fetchFavorites,
        removeFavorite,
        addFavorite
    }
}, {
    persist: true
})
