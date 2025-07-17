<template>
    <div class="min-h-screen bg-gradient-to-b from-pinky to-soft flex flex-col items-center justify-center p-6">
        <h1 class="text-4xl font-bold text-white drop-shadow mb-6">夢幻貼圖展示</h1>

        <input type="file" accept="image/*" @change="onFileChange"
            class="block text-pinky bg-white border-2 border-pinky rounded-lg px-4 py-2 cursor-pointer hover:bg-pinky hover:text-white transition" />

        <div v-if="previewUrl" class="mt-6">
            <img :src="previewUrl" alt="預覽圖片" class="w-72 h-auto rounded-2xl shadow-lg border-4 border-white" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const previewUrl = ref('')

function onFileChange(event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            previewUrl.value = reader.result
        }
        reader.readAsDataURL(file)
    }
}
</script>