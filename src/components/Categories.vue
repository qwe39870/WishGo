<template>
  <div class="relative bg-white border-b shadow-sm"
       @mouseenter="cancelLeave"
       @mouseleave="startLeave">
    <div class="max-w-screen-xl mx-auto px-4 flex space-x-6 h-10 justify-center items-center">
      <div
        class="relative"
        v-for="(cat, i) in categories"
        :key="i"
        @mouseenter="hovered = i"
      >
        <button class="text-sm font-medium hover:text-pink-600">
          {{ cat.name }} |
        </button>

        <div
          v-show="hovered === i"
          class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] bg-white/90 border shadow-sm rounded-lg p-4 z-20 transition-all duration-200"
        >
          <div class="grid grid-cols-3 gap-4">
            <div v-for="(sub, j) in cat.subs" :key="j" class="hover:bg-pink-50 p-2 rounded transition">
              <div class="text-pink-600 font-semibold">{{ sub.title }}</div>
              <ul class="text-sm text-gray-700 space-y-1 mt-1">
                <li v-for="(item, k) in sub.items" :key="k">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const hovered = ref(null)
let leaveTimeout = null

const startLeave = () => {
  leaveTimeout = setTimeout(() => {
    hovered.value = null
  })
}
const cancelLeave = () => {
  clearTimeout(leaveTimeout)
}


const categories = [
  {
    name: '3C商品',
    subs: [
      { title: '電腦周邊', items: ['滑鼠', '鍵盤', '耳機'] },
      { title: '筆記型電腦', items: ['Apple', 'ASUS', 'Lenovo'] },
      { title: '螢幕', items: ['BenQ', 'MSI', 'LG'] }
    ]
  },
  {
    name: '家電',
    subs: [
      { title: '廚房家電', items: ['微波爐', '氣炸鍋', '咖啡機'] },
      { title: '清潔家電', items: ['吸塵器', '掃地機器人'] },
      { title: '季節家電', items: ['電風扇', '冷氣', '除濕機'] }
    ]
  },
  {
    name: '日用',
    subs: [
      { title: '清潔工具', items: ['拖把', '洗衣精', '清潔劑'] },
      { title: '浴室用品', items: ['牙刷', '毛巾', '洗面乳'] },
      { title: '收納用品', items: ['收納盒', '掛鉤', '置物架'] }
    ]
  },
  {
    name: '時尚',
    subs: [
      { title: '服飾', items: ['洋裝', '上衣', '褲子'] },
      { title: '配件', items: ['髮箍', '項鍊', '戒指'] },
      { title: '鞋類', items: ['靴子', '涼鞋', '帆布鞋'] }
    ]
  },
  {
    name: '居家',
    subs: [
      { title: '寢具', items: ['枕頭', '棉被', '床罩'] },
      { title: '家具', items: ['書桌', '椅子', '衣櫃'] },
      { title: '裝飾品', items: ['掛畫', '小夜燈', '地毯'] }
    ]
  },
  {
    name: '生活',
    subs: [
      { title: '文具', items: ['筆記本', '原子筆', '便利貼'] },
      { title: '餐廚', items: ['碗盤', '杯子', '筷子'] },
      { title: '戶外用品', items: ['雨傘', '水壺', '野餐墊'] }
    ]
  },
  {
    name: '休閒',
    subs: [
      { title: '玩具', items: ['拼圖', '積木', '娃娃'] },
      { title: '運動用品', items: ['瑜珈墊', '跳繩', '啞鈴'] },
      { title: '音樂', items: ['耳機', '音響', '樂器'] }
    ]
  },
  {
    name: '保健',
    subs: [
      { title: '保健食品', items: ['維他命', '膠原蛋白', '益生菌'] },
      { title: '醫療用品', items: ['口罩', '體溫計', '酒精'] },
      { title: '護理用品', items: ['護手霜', '眼罩', '貼布'] }
    ]
  }
]
</script>

<style scoped></style>
