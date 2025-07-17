<template>
  <Header />
  <Nav :isVisible="isNavVisible" />
  <Categories />
  <CreditCard />

  <!-- 🛡️ 防詐提醒區 -->
  <div class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mx-auto max-w-6xl rounded-xl mt-2">
    <p class="font-medium">🔔 提醒您：</p>
    <p class="text-sm mt-1">WishGo 絕不會主動以電話或簡訊通知顧客變更付款方式，更不會以任何理由要求您操作 ATM 或提供個人金融資訊。若接獲可疑電話或簡訊，請撥打 165 反詐騙專線查證，保障您的權益！</p>
  </div>

  <!-- 🐰 會員中心頁面 -->
  <div class="max-w-6xl mx-auto p-6">
    <!-- 上方分類 Tabs -->
    <div class="flex flex-wrap justify-center md:justify-center gap-1 border-b-4 border-pink-500 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="currentTab = tab.key"
        class="px-4 py-2 rounded-t-[4px] text-sm font-medium transition shadow border-x border-t  border-pink-500"
        :class="currentTab === tab.key
          ? 'bg-pink-500 text-white border-pink-500'
          : 'bg-white text-pink-500 border-pink-200 hover:bg-pink-50'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 下方對應內容 -->
    <div v-if="currentTab === 'orders'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TabCard title="🧾 訂單查詢" desc="查看您過去的訂單紀錄。" to="/orderList" />
      <TabCard title="🚚 配送進度查詢" desc="查看您的商品目前配送狀態。" to="/delivery-tracking" />
      <TabCard title="🔁 申請換貨" desc="針對符合條件商品申請換貨。" to="/return-apply" />
      <TabCard title="⭐ 追蹤清單" desc="查看您追蹤的商品清單。" to="/favorites" />
      <TabCard title="📢 補貨通知" desc="您設定的缺貨補貨提醒。" to="/restock-alerts" />
    </div>

    <div v-else-if="currentTab === 'account'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TabCard title="👤 個人帳戶管理" desc="變更密碼、帳號設定等。" to="/account" />
      <TabCard title="📝 資料修改" desc="更新您的個人基本資料。" to="/edit-profile" />
      <TabCard title="📬 地址管理" desc="設定與管理您的收件地址。" to="/addresses" />
      <TabCard title="📨 電子報管理" desc="取消或訂閱電子報。" to="/newsletter" />
    </div>

    <div v-else-if="currentTab === 'rewards'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TabCard title="🎁 折價券查詢" desc="管理與使用您的優惠券。" to="/coupons" />
      <TabCard title="💰 momo幣查詢" desc="您目前擁有的 momo幣。" to="/points" />
      <TabCard title="🎉 活動登記查詢" desc="查看您參加過的活動紀錄。" to="/campaigns" />
      <TabCard title="💳 momo卡申請" desc="申請與管理 momo 卡。" to="/momo-card" />
    </div>

    <div v-else-if="currentTab === 'invoice'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TabCard title="🧾 電子發票載具" desc="綁定載具與查詢中獎發票。" to="/invoices" />
      <TabCard title="🏆 中獎發票列印" desc="超商列印中獎發票。" to="/invoice-print" />
    </div>

    <div v-else-if="currentTab === 'service'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TabCard title="💬 線上客服" desc="即時聯繫客服人員。" to="/chat" />
      <TabCard title="❓ 常見問答 FAQ" desc="解答您常見的問題。" to="/faq" />
      <TabCard title="📄 客服聯絡紀錄" desc="查看您曾聯絡客服的紀錄。" to="/contact-history" />
      <TabCard title="🔒 隱私權政策" desc="了解我們如何保護您的資訊。" to="/privacy" />
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '@/components/HomePage/Header.vue'
import Nav from './Nav.vue'
import Categories from '@/components/Categories.vue'
import Footer from '@/components/Footer.vue'
import TabCard from '@/components/TabCard.vue'
import CreditCard from '@/components/CreditCard.vue'

const isNavVisible = ref(false)

function handleScroll() {
  // 只要不在頂部就顯示
  isNavVisible.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})


const currentTab = ref('orders')

const tabs = [
  { key: 'orders', label: '訂單查詢' },
  { key: 'account', label: '顧客中心' },
  { key: 'rewards', label: '優惠好康' },
  { key: 'invoice', label: '服務說明' },
  { key: 'service', label: '客服中心' },
]
</script>
