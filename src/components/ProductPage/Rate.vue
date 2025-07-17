<template>
  <div class="max-w-6xl mx-auto min-h-screen flex justify-center items-start">
    <div class="max-w-xl p-6 w-full">
      <!-- bg-white shadow-md -->
      <!-- 平均評價 -->
      <div class="text-center mb-6">
        <h3 class="text-2xl font-bold text-pink-600">商品評價</h3>
        <div class="text-pink-400 text-3xl mt-2">
          <span v-for="n in 5" :key="n">
            <i :class="n <= averageRating ? 'fas fa-star' : 'far fa-star'"></i>
          </span>
        </div>
        <p class="text-gray-600 mt-1">
          平均 {{ averageRating.toFixed(1) }} 分，共 {{ totalReviews }} 筆評價
        </p>
      </div>

      <!-- 各星等百分比條 -->
      <div class="space-y-2 mb-6">
        <div v-for="item in ratingData" :key="item.star" class="flex items-center gap-2 cursor-pointer hover:opacity-80"
          @click="selectRating(item.star)">
          <span class="text-sm w-10">{{ item.star }} 星</span>
          <div class="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300/70"
              :style="{ width: `${item.percent}%` }"></div>
          </div>
          <span class="text-sm text-gray-500 w-12 text-right">{{ item.percent }}%</span>
        </div>
      </div>

      <!-- 留言板 -->
      <div class="space-y-4 mb-4">
        <div v-for="(comment, index) in paginatedComments" :key="index" class="bg-gray-50 rounded-lg p-4 border">
          <!-- 頂部：左上是名字+星星，右上是時間+讚 -->
          <div class="flex justify-between items-start">
            <!-- 左側：名字 + 星等（同一行） -->
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-pink-600">{{ comment.nickname }}</p>
              <div class="text-pink-400 text-sm">
                <i v-for="n in 5" :key="n" :class="n <= comment.rating ? 'fas fa-star' : 'far fa-star'"></i>
              </div>
            </div>


            <!-- 右側：時間 + 讚 -->
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>{{ comment.date }}</span>
              <div class="flex items-center gap-1 text-sm">
                <i :class="comment.liked ? 'fas fa-thumbs-up text-pink-500' : 'far fa-thumbs-up cursor-pointer'"
                  @click="toggleLike(comment)"></i>
                <span>{{ comment.likeCount }}</span>
              </div>
            </div>
          </div>

          <!-- 留言內容 -->
          <p class="mt-2 text-gray-800">{{ comment.text }}</p>
        </div>
      </div>




      <!-- 分頁按鈕 -->
      <div class="flex justify-center gap-2 mb-6">
        <button v-for="n in totalPages" :key="n" @click="currentPage = n"
          :class="n === currentPage ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-3 py-1 rounded-md hover:bg-pink-400 hover:text-white">
          {{ n }}
        </button>
      </div>

      <!-- 新增留言 -->
      <form @submit.prevent="addComment" class="border-t pt-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">新增留言</label>
        <div class="flex gap-1 text-xl text-pink-500 mb-2">
          <i v-for="n in 5" :key="n" @click="newRating = n" :class="n <= newRating ? 'fas fa-star' : 'far fa-star'"
            class="cursor-pointer"></i>
        </div>
        <textarea v-model="newText" placeholder="寫下您的評價..."
          class="w-full border rounded-md px-3 py-2 mb-2 focus:ring-2 focus:ring-pink-400" required></textarea>
        <button type="submit" class="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
          送出評價
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/plugins/axios.js'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

const route = useRoute()
const productId = route.params.id

const userStore = useUserStore()

const averageRating = ref(0)
const totalReviews = ref(0)
const ratingData = ref([])
const allComments = ref([])

const fetchLikeInfo = async (reviewId) => {
  try {
    const res = await axios.get(`/reviews/${reviewId}/likes`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    return res.data
  } catch (e) {
    console.error(`取得 review ${reviewId} 讚失敗`, e)
    return { likeCount: 0, liked: false }
  }
}

const fetchAllReviews = async () => {
  try {
    const review = await axios.get(`/reviews/product/${productId}`)
    const reviews = review.data.reviews
    averageRating.value = review.data.averageRating
    totalReviews.value = reviews.length

    if (userStore.token) {
      allComments.value = await Promise.all(
        reviews.map(async (r) => {
          const likeInfo = await fetchLikeInfo(r.reviewId)
          return {
            reviewId: r.reviewId,
            rating: r.rating,
            text: r.comment,
            createdAt: new Date(r.createdAt),
            date: new Date(r.createdAt).toLocaleString('zh-TW', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            nickname: r.nickname || '匿名使用者',
            likeCount: likeInfo.likeCount,
            liked: likeInfo.liked
          }
        })
      )
    } else {

      allComments.value = reviews.map(r => ({
        reviewId: r.reviewId,
        rating: r.rating,
        text: r.comment,
        createdAt: new Date(r.createdAt),
        date: new Date(r.createdAt).toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        nickname: r.nickname || '匿名使用者',
        likeCount: 0,
        liked: false
      }))
    }

    // 排序
    allComments.value.sort((a, b) => b.createdAt - a.createdAt)

    // 計算星等百分比
    const starCount = [0, 0, 0, 0, 0]
    allComments.value.forEach(c => {
      if (c.rating >= 1 && c.rating <= 5) starCount[c.rating - 1]++
    })
    ratingData.value = starCount.map((count, index) => ({
      star: index + 1,
      percent: totalReviews.value === 0 ? 0 : Math.round((count / totalReviews.value) * 100)
    })).reverse()

  } catch (err) {
    console.error('載入評論資料失敗', err)
  }
}
onMounted(() => {
  fetchAllReviews()
})


const selectedStar = ref(null)
const currentPage = ref(1)
const perPage = 10

const filteredComments = computed(() => {
  if (!selectedStar.value) return allComments.value
  return allComments.value.filter((c) => c.rating === selectedStar.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredComments.value.length / perPage)
})

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredComments.value.slice(start, start + perPage)
})

const selectRating = (star) => {
  selectedStar.value = star === selectedStar.value ? null : star
  currentPage.value = 1
}

const newRating = ref(0)
const newText = ref('')



const addComment = async () => {
  if (!newRating.value || !newText.value.trim()) {
    Swal.fire({
      title: '🔮 魔法提醒',
      html: '<p style="font-weight:bold;">記得給星星!</p>',
      icon: 'error',
      background: '#fff0f0',
      showConfirmButton: true,
      confirmButtonText: '知道了！',
      // confirmButtonColor: '#a78bfa', // 紫色系
      iconColor: 'red', // 粉紅 icon

      // 自訂 class，加上玻璃特效
      customClass: {
        popup: 'glass-alert',
      }
    })
    return
  }

  try {

    const token = userStore.token

    const response = await axios.post(
      'http://localhost:7010/youbike/reviews',
      {
        productId: productId, // 🔥 要傳入你目前的商品 ID
        comments: newText.value,
        rating: newRating.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    console.log(response.data);
    // 若成功，前端也可直接顯示
    allComments.value.unshift({
      nickname: response.data.user.nickname,
      rating: response.data.rating,
      text: response.data.comments,
      date: new Date(response.data.createdAt).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })

    })

    newRating.value = 0
    newText.value = ''
    fetchAllReviews()
  } catch (error) {
    console.log("不適使用者流言了");

    Swal.fire({
      title: '🔮 魔法提醒',
      html: '<p style="font-weight:bold;">登入後才能留下評論哦！</p>',
      icon: 'error',
      background: '#fff0f0',
      showConfirmButton: true,
      confirmButtonText: '知道了！',
      // confirmButtonColor: '#a78bfa', // 紫色系
      iconColor: 'red', // 粉紅 icon

      // 自訂 class，加上玻璃特效
      customClass: {
        popup: 'glass-alert',
      }
    })
  }
}

const toggleLike = async (comment) => {
  const reviewId = comment.reviewId
  const url = `http://localhost:7010/youbike/reviews/${reviewId}/like`
  const headers = {
    Authorization: `Bearer ${userStore.token}`
  }

  console.log("comment", comment);
  try {
    if (comment.liked) {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${userStore.token}`
        }
      })
      comment.liked = false
      comment.likeCount--
    } else {
      await axios.post(url, {}, { headers })
      comment.liked = true
      comment.likeCount++
    }
  } catch (err) {
    console.error('讚錯了？', err)
    alert('請確認是否已登入～')
  }
}



</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
</style>
