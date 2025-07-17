<template>
    <div>
        <!-- 浮動客服按鈕 -->
        <!-- <button @click="toggleChat"
            class="fixed bottom-6 left-6 w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 hover:scale-110 transition-transform duration-300 hover:border-white/50"
            aria-label="客服聊天">
            <img src="https://cdn.discordapp.com/emojis/1296881026408382514.webp?size=96&animated=true" alt="客服GIF"
                class="w-36 h-36 object-contain drop-shadow-md" />
            <h2 class="text-xl text-pink-600 font-semibold">我是客服</h2>
        </button> -->

        <button @click="toggleChat"
            class="bg-purple-100 fixed bottom-6 left-6 w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 backdrop-blur-md shadow-lg hover:scale-110 transition-transform duration-300 hover:border-white/50"
            aria-label="客服聊天">
            <ChatBubbleLeftEllipsisIcon class="w-12 h-12 text-pink-400 drop-shadow-md" />
            <h2 class="text-lg text-pink-600 font-semibold">聯繫客服</h2>
        </button>





        <!-- 聊天視窗 -->
        <!-- 聊天視窗 -->
        <transition name="fade">
            <div v-if="chatOpen"
                class="fixed bottom-0 left-[8.5rem] w-80 max-w-full h-96 bg-white rounded-lg shadow-lg flex flex-col z-50">
                <!-- 標題列 -->
                <div
                    class="flex justify-between items-center p-3 border-b bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 shadow-sm rounded-t-lg text-white">
                    <h3 class="font-semibold text-lg">客服聊天室</h3>
                    <button @click="toggleChat" aria-label="關閉聊天視窗"
                        class="text-white hover:text-pink-300 text-xl focus:outline-none">
                        &times;
                    </button>
                </div>

                <!-- 訊息顯示區 -->
                <div class="flex-1 p-4 overflow-y-auto" ref="chatContent">
                    <div v-for="(msg, i) in messages" :key="i" class="mb-2">
                        <div :class="msg.from === 'user' ? 'text-right' : 'text-left'">
                            <span :class="msg.from === 'user'
                                ? 'inline-block bg-pink-200 text-pink-800 rounded-2xl px-3 py-1'
                                : 'inline-block bg-gray-200 text-gray-800 rounded-2xl px-3 py-1'">
                                {{ msg.text }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 輸入區 -->
                <form @submit.prevent="sendMessage" class="p-3 border-t flex gap-2 items-center">
                    <input v-model="newMessage" type="text" placeholder="輸入訊息..."
                        class="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                    <button type="submit"
                        class="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-md font-semibold transition duration-300 ease-in-out">
                        送出
                    </button>
                </form>
            </div>
        </transition>


    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/solid'
const chatOpen = ref(false);
const messages = ref([
    { from: 'bot', text: '您好！需要什麼幫忙嗎？' },
]);
const newMessage = ref('');

const toggleChat = () => {
    chatOpen.value = !chatOpen.value;
    if (chatOpen.value) {
        scrollToBottom();
    }
};

const sendMessage = () => {
    if (!newMessage.value.trim()) return;
    messages.value.push({ from: 'user', text: newMessage.value });
    newMessage.value = '';

    // 模擬客服回覆
    setTimeout(() => {
        messages.value.push({ from: 'bot', text: '謝謝您的訊息，我們會盡快回覆您。' });
        scrollToBottom();
    }, 1000);

    scrollToBottom();
};

const chatContent = ref(null);
const scrollToBottom = () => {
    nextTick(() => {
        if (chatContent.value) {
            chatContent.value.scrollTop = chatContent.value.scrollHeight;
        }
    });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 美化滾動條 */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f9fafb;
}

::-webkit-scrollbar-thumb {
    background-color: #ec4899;
    border-radius: 3px;
}
</style>