<template>
    <div>
        <button @click="openCvsMap" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow">
            選擇超商門市
        </button>

        <div v-if="store.name" class="mt-3 text-sm text-pink-700">
            📍 已選門市：{{ store.name }}<br />
            🏠 地址：{{ store.address }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const store = ref({
    name: '',
    address: '',
    id: '',
    type: ''
})

// 1. onMounted 載入 SDK script
onMounted(() => {
    const existing = document.querySelector('script[src="https://emap.pcsc.com.tw/EMapSDK/SDKLoader.js"]')
    if (!existing) {
        const script = document.createElement('script')
        script.src = 'https://emap.pcsc.com.tw/EMapSDK/SDKLoader.js'
        script.async = true
        document.head.appendChild(script)
    }

    // 2. 實作 SDK 呼叫會觸發的全域函式
    window.GetStore = function (storeID, storeName, storeAddress, storeType) {
        store.value = {
            name: storeName,
            address: storeAddress,
            id: storeID,
            type: storeType
        }
    }
})

// 3. 點選按鈕，開啟 SDK 地圖視窗
function openCvsMap() {
    const url = `https://emap.pcsc.com.tw/EMapSDK/EMapSDK.aspx?`
        + `cvsid=UNIMART`                     // 超商代碼：UNIMART=全家，FAMI=全家，OK=OK，HILIFE=萊爾富
        + `&cvstype=FAMI`                     // 超商類型（通常跟 cvsid 一樣）
        + `&tempvar=123`                      // 任意值，會被帶入回傳用
        + `&lang=zh-TW`                       // 語言
        + `&showflag=1`                       // 強制顯示門市地圖
        + `&mapwidth=600&mapheight=500`      // 地圖尺寸
        + `&webpara=yourAppFlag`             // 你的應用名稱，可任意填
    window.open(url, 'store', 'width=800,height=600,scrollbars=yes,resizable=yes')
}

</script>