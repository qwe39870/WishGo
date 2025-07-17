<template>
  <!-- 登入表單 -->


  <!-- 原有的聊天視窗 -->
  <div>
    <div class="chat-popup" v-if="isOpen">
      <!-- Chat Header -->
      <div class="chat-header"
        style="display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ff99cc, #b794f4) !important; color: white; padding: 16px;">
        <div class="agent-details"
          style="font-size: 18px; font-weight: bold; color: white; text-align: center; width: auto;">線上客服</div>
        <div class="options-container" style="position: absolute; right: 16px;">
          <el-button type="text" :icon="MoreFilled" class="more-btn" @click="showOptions = !showOptions" />
          <!-- 選項選單 -->
          <div v-if="showOptions" class="options-menu">
            <el-button type="text" @click="handleLogout">登出</el-button>
          </div>
        </div>
      </div>

      <!-- Messages Container -->
      <div class="messages-container" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id"
          :class="['message-wrapper', message.sender === 'user' ? 'user-message' : 'agent-message']">
          <el-avatar v-if="message.sender === 'agent'" :size="32" src="/images/supportfemale.svg"
            class="message-avatar" />

          <div class="message-bubble">
            <div class="message-content">
              {{ message.content }}
            </div>
            <div class="message-meta">
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              <el-icon v-if="message.sender === 'user' && message.read" class="read-receipt" color="#6B47ED">
                <Check />
              </el-icon>
            </div>
          </div>


        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="typing-indicator">
          <el-avatar :size="32" src="/images/supportfemale.svg" class="message-avatar">
            {{ agentName.charAt(0) }}
          </el-avatar>
          <div class="typing-bubble">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="message-input-container">
        <div class="input-wrapper">
          <el-button type="text" :icon="Paperclip" class="attachment-btn" @click="handleFileUpload" />
          <input type="file" ref="fileInput" @change="onFileSelected" style="display: none" multiple
            accept="image/*,.pdf,.doc,.docx,.txt" />

          <el-input v-model="newMessage" placeholder="請輸入訊息..." class="message-input" @keyup.enter="sendMessage"
            @input="handleTyping" :autosize="{ minRows: 1, maxRows: 3 }" type="textarea" resize="none" />

          <el-popover placement="top" :width="300" trigger="click" v-model:visible="showEmojiPicker">
            <template #reference>
              <el-button type="text" :icon="Smile" class="emoji-btn" />
            </template>
            <div class="emoji-picker">
              <div class="emoji-grid">
                <span v-for="emoji in emojis" :key="emoji" class="emoji-item" @click="addEmoji(emoji)">
                  {{ emoji }}
                </span>
              </div>
            </div>
          </el-popover>

          <el-button type="primary" :icon="Promotion" class="send-btn" @click="sendMessage"
            :disabled="!newMessage.trim()" />
        </div>
      </div>
    </div>
  </div>

  <!-- Floating Chat Button -->
  <el-button v-if="userStore.isLogin" type="primary" :icon="ChatDotRound" class="chat-toggle-btn" circle
    @click="toggleChat" />
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import {
  MoreFilled,
  Link as Paperclip,
  ChatRound as Smile,
  Position as Promotion,
  Close,
  ChatDotRound,
  Check,
  Minus
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.js'
import { jwtDecode } from 'jwt-decode'

const userStore = useUserStore()
let decoded = null
if (userStore.token) {
  try {
    decoded = jwtDecode(userStore.token)
  } catch (err) {
    console.error("JWT 解碼失敗：", err)
  }
}




// WebSocket 相關
const ws = ref(null)
const isConnected = ref(false)
const threadId = ref(null) // 修改為 null
const userId = ref(null)





// Reactive data
const isOpen = ref(false)
const newMessage = ref('')
const showEmojiPicker = ref(false)
const showOptions = ref(false)
const isTyping = ref(false)
const messagesContainer = ref(null)
const fileInput = ref(null)

// Agent info
const agentName = ref('客服人員')
const agentAvatar = ref('/placeholder.svg?height=40&width=40')
const agentStatus = ref('線上') // 新增：客服狀態

// 使用 reactive 來管理訊息
const messages = reactive([])

// 保存訊息到 localStorage
const saveMessages = () => {
  try {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
    localStorage.setItem('chatThreadId', threadId.value)
    console.log('💾 已保存聊天訊息到本地存儲')
  } catch (error) {
    console.error('❌ 保存聊天訊息時發生錯誤:', error)
  }
}

// 從 localStorage 恢復訊息
const restoreMessages = () => {
  try {
    const savedMessages = localStorage.getItem('chatMessages')
    const savedThreadId = localStorage.getItem('chatThreadId')

    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      messages.splice(0, messages.length, ...parsedMessages)
      console.log('📂 已恢復聊天訊息:', messages)
    }

    if (savedThreadId) {
      threadId.value = parseInt(savedThreadId)
      console.log('📂 已恢復對話串ID:', threadId.value)
    }
  } catch (error) {
    console.error('❌ 恢復聊天訊息時發生錯誤:', error)
  }
}

// Emoji collection
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
  '❤️', '🧡', '💛', '💚', '💙', '🖤', '🤍'
]

// 登入相關
const isLoggedIn = userStore.isLogin
const loading = ref(false)
const loginForm = reactive({
  username: '',
  password: ''
})

// Methods
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // 開啟聊天視窗時連接 WebSocket
    if (!isConnected.value) {
      connectWebSocket()
    }
    nextTick(() => {
      scrollToBottom()
    })
  } else {
    showEmojiPicker.value = false
    showOptions.value = false
    newMessage.value = '' // 清空輸入框
  }
}


// WebSocket 連接函數
const connectWebSocket = async () => {

  const userId =decoded.userId
  const role = "??"

  if (!userId || !role) {
    console.error('❌ 缺少必要的登入資訊')
    return
  }

  console.log('🔵 開始建立 WebSocket 連接...')
  console.log('連接資訊:', { userId, role })

  // 先查詢現有對話串
  let threadIdToUse = null
  try {
    const getResp = await fetch(`http://localhost:7011/WishGo/api/customer-service/threads?userId=${userId}`)
    if (getResp.ok) {
      const threads = await getResp.json()
      if (threads && threads.length > 0) {
        // 取最新一個 threadId
        threadIdToUse = threads[0].threadId || threads[0].id
        console.log('✅ 找到現有對話串:', threadIdToUse)
      }
    }
  } catch (e) {
    console.error('❌ 查詢現有對話串失敗:', e)
  }

  // 如果沒有現有 threadId，才新建
  if (!threadIdToUse) {
    try {
      const response = await fetch('http://localhost:7011/WishGo/api/customer-service/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          initiatorUserId: parseInt(userId),
          initiatorType: 'USER',
          subject: '客戶諮詢',
          orderId: null,
          productId: null
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `創建對話串失敗 (${response.status})`);
      }

      const data = await response.json();
      if (data.threadId) {
        threadIdToUse = data.threadId
      } else if (data.id) {
        threadIdToUse = data.id
      } else {
        throw new Error('回應中缺少對話串 ID');
      }
      console.log('✅ 新建對話串:', threadIdToUse);
    } catch (error) {
      console.error('❌ 創建對話串失敗:', error);
      ElMessage.error('連接失敗：' + error.message);
      return;
    }
  }

  threadId.value = threadIdToUse

  const serverUrl = `ws://localhost:7011/WishGo/ws-customer-service?userId=${userId}&role=${role}&threadId=${threadId.value}`
  console.log('🔗 準備連接 WebSocket:', serverUrl)

  ws.value = new WebSocket(serverUrl)

  ws.value.onopen = () => {
    console.log('✅ WebSocket 連接成功')
    isConnected.value = true

    // 發送線上狀態
    const statusData = {
      type: 'STATUS_UPDATE',
      userId: parseInt(localStorage.getItem('userId')),
      status: '線上'
    }
    console.log('🔵 發送線上狀態:', statusData)
    ws.value.send(JSON.stringify(statusData))

    // 恢復之前的訊息
    restoreMessages()

    // 發送加入對話串的訊息
    const joinMessage = {
      type: 'JOIN_THREAD',
      threadId: threadId.value,
      userId:userId,
      role: localStorage.getItem('role')
    }
    console.log('🔵 發送加入對話串訊息:', joinMessage)
    ws.value.send(JSON.stringify(joinMessage))
  }

  ws.value.onmessage = (event) => {
    console.log('📨 收到新訊息:', event.data)
    const messageData = JSON.parse(event.data)

    switch (messageData.type) {
      case 'NEW_MESSAGE':
        handleNewMessage(messageData)
        break
      case 'STATUS_UPDATE':
        handleStatusUpdate(messageData)
        break
      case 'ERROR':
        console.error('❌ 收到錯誤:', messageData.message)
        ElMessage.error(messageData.message)
        break
      default:
        console.log('📩 收到其他類型訊息:', messageData)
    }
  }

  ws.value.onclose = () => {
    console.log('🔵 WebSocket 連接關閉')
    isConnected.value = false
    ElMessage.warning('連接已關閉')
  }

  ws.value.onerror = (error) => {
    console.error('❌ WebSocket 錯誤:', error)
    isConnected.value = false
    ElMessage.error('連接發生錯誤')
  }
}

// 處理新訊息
const handleNewMessage = (messageData) => {
  // 檢查是否已經存在相同的訊息（避免重複）
  const existingMessage = messages.find(msg => msg.id === messageData.messageId)
  if (existingMessage) {
    console.log('⚠️ 發現重複訊息，跳過:', messageData.messageId)
    return
  }

  messages.push({
    id: messageData.messageId,
    sender: messageData.senderUserId === userId.value ? 'user' : 'agent',
    content: messageData.content,
    timestamp: new Date(messageData.sentDate),
    read: false
  })

  // 保存訊息到本地存儲
  saveMessages()

  nextTick(() => {
    scrollToBottom()
  })
}

// 發送訊息
const sendMessage = () => {
  if (!newMessage.value.trim() || !isConnected.value || !threadId.value) {
    console.log('❌ 無法發送訊息:', {
      hasMessage: !!newMessage.value.trim(),
      isConnected: isConnected.value,
      threadId: threadId.value,
      wsStatus: ws.value ? ws.value.readyState : 'no websocket'
    })

    if (!threadId.value) {
      ElMessage.error('對話串未創建，請重新連接')
      return
    }
    if (!isConnected.value) {
      ElMessage.error('未連接到伺服器')
      return
    }
    return
  }

  const userId = decoded.userId
  const username = localStorage.getItem('username')
  const role = localStorage.getItem('role')

  const messageData = {
    type: 'SEND_MESSAGE',
    threadId: parseInt(threadId.value),
    senderUserId: userId,
    senderType: 'USER',
    senderRole: role,
    senderName: username,
    content: newMessage.value.trim(),
    sentDate: new Date().toISOString()
  }

  console.log('📤 發送訊息:', messageData)
  try {
    ws.value.send(JSON.stringify(messageData))

    // 不要直接添加到訊息列表，等待 WebSocket 回應
    // 這樣可以確保訊息順序正確，並避免重複

    newMessage.value = ''
  } catch (error) {
    console.error('❌ 發送訊息失敗:', error)
    ElMessage.error('發送訊息失敗')
  }
}

// 處理狀態更新
const handleStatusUpdate = (statusData) => {
  console.log('🔄 處理狀態更新:', statusData)
  const { userId: targetUserId, status } = statusData

  // 如果是客服人員的狀態更新
  if (targetUserId !== parseInt(localStorage.getItem('userId'))) {
    agentStatus.value = status
    console.log(`✅ 已更新客服狀態為 ${status}`)
  }
}

// 在元件卸載前斷開連接
onBeforeUnmount(() => {
  // 保存訊息
  if (isLoggedIn && messages.length > 0) {
    saveMessages()
  }

  if (ws.value && isConnected.value) {
    ws.value.close()
  }

  // 移除事件監聽器
  window.removeEventListener('beforeunload', () => {
    if (isLoggedIn && messages.length > 0) {
      saveMessages()
    }
  })
})

// 其他輔助函數
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleTyping = () => {
  // 可以在這裡添加打字中的邏輯
}

const handleFileUpload = () => {
  fileInput.value.click()
}

const onFileSelected = (event) => {
  // 可以在這裡處理檔案上傳
  const files = event.target.files
  // 處理檔案上傳邏輯
}

const addEmoji = (emoji) => {
  newMessage.value += emoji
  showEmojiPicker.value = false
}

const handleLogin = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:7011/WishGo/staff/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginForm)
    })

    if (response.ok) {
      const data = await response.json()
      // 儲存登入資訊
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('username', data.username)
      localStorage.setItem('role', 'CUSTOMER')
      isLoggedIn = true
      userId.value = data.userId

      // 連接 WebSocket
      connectWebSocket()
    } else {
      ElMessage.error('登入失敗：帳號或密碼錯誤')
    }
  } catch (error) {
    ElMessage.error('系統錯誤：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  // 先發送離開狀態
  if (ws.value && isConnected.value) {
    const statusData = {
      type: 'STATUS_UPDATE',
      userId: userId.value,
      status: '離開'
    }
    try {
      ws.value.send(JSON.stringify(statusData))
      // 等待一小段時間確保訊息發送
      setTimeout(() => {
        ws.value.close()
      }, 100)
    } catch (error) {
      console.error('❌ 發送登出狀態時發生錯誤:', error)
      ws.value.close()
    }
  }

  // 清除本地存儲
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  localStorage.removeItem('chatMessages')
  localStorage.removeItem('chatThreadId')

  // 重置狀態
  isLoggedIn = false
  userId.value = null
  threadId.value = null
  isConnected.value = false
  showOptions.value = false
  messages.length = 0
}

// 在組件掛載時檢查登入狀態
onMounted(() => {
  const storedUserId = localStorage.getItem('userId')
  if (storedUserId) {
    isLoggedIn = true
    userId.value = parseInt(storedUserId)

    // 恢復之前的訊息
    restoreMessages()

    // 如果聊天視窗是開啟的，連接 WebSocket
    if (isOpen.value) {
      connectWebSocket()
    }
  }

  // 監聽頁面關閉事件，保存訊息
  window.addEventListener('beforeunload', () => {
    if (isLoggedIn && messages.length > 0) {
      saveMessages()
    }
  })
})
</script>

<style scoped>
.chat-popup {
  position: fixed;
  bottom: 9px;
  left: 80px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 2px rgba(255, 153, 204, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999;
}

.chat-header {
  background: linear-gradient(135deg, #ff99cc, #b794f4) !important;
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-avatar {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.agent-details {
  display: flex;
  flex-direction: column;
}

.agent-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.agent-status {
  font-size: 12px;
  opacity: 0.8;
}

.options-container {
  position: relative;
}

.options-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  z-index: 1000;
  min-width: 100px;
}

.options-menu .el-button {
  display: block;
  width: 100%;
  text-align: center;
  padding: 8px 16px;
  margin: 0;
  border-radius: 0;
}

.options-menu .el-button:hover {
  background-color: #f5f7fa;
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.user-avatar {
  background: linear-gradient(135deg, #ff99cc, #b794f4) !important;
  color: white;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.agent-message .message-bubble {
  background: #F5F5F5;
  color: #2D3436;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #ff99cc, #b794f4) !important;
  color: white;
}

.message-content {
  margin-bottom: 4px;
  line-height: 1.4;
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.read-receipt {
  font-size: 12px;
}

.typing-indicator {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.typing-bubble {
  background: #F5F5F5;
  padding: 12px 16px;
  border-radius: 18px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #ff66b2 !important;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {

  0%,
  60%,
  100% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-10px);
  }
}

.message-input-container {
  padding: 16px;
  border-top: 1px solid #E5E5E5;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: rgba(255, 153, 204, 0.15);
  border: 1px solid rgba(255, 153, 204, 0.4);
  border-radius: 24px;
  padding: 8px 12px;
}

.attachment-btn,
.emoji-btn {
  color: #ff66b2 !important;
  padding: 8px;
}

.message-input {
  flex: 1;
}

.message-input :deep(.el-textarea__inner) {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 8px 0;
  resize: none;
}

.send-btn {
  background: linear-gradient(135deg, #ff99cc, #b794f4) !important;
  border: none;
  padding: 8px;
  min-width: auto;
}

.send-btn:hover {
  background: linear-gradient(135deg, #ff80bf, #c5a3f5) !important;
}

.emoji-picker {
  max-height: 200px;
  overflow-y: auto;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-item {
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background: #F0F0F0;
}

.chat-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
  padding: 16px;
}

.minimize-btn,
.close-btn {
  color: white;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.minimize-btn:hover,
.close-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  left: 10px;
  background: linear-gradient(135deg, #ff99cc, #b794f4) !important;
  border: none;
  width: 60px !important;
  height: 60px;
  z-index: 998;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 102, 178, 0.3);
  transform-origin: center;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  background: linear-gradient(135deg, #ff80bf, #c5a3f5) !important;
  box-shadow: 0 6px 16px rgba(255, 102, 178, 0.4);
}

.chat-popup[v-if="true"]+.chat-toggle-btn {
  transform: rotate(45deg);
}

.chat-popup[v-if="true"]+.chat-toggle-btn:hover {
  transform: rotate(45deg) scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-popup {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    bottom: 20px;
    right: 20px;
    left: 20px;
  }

  .floating-close-btn {
    bottom: -70px;
  }
}

/* Scrollbar Styling */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #E0E0E0;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #BDBDBD;
}

.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-card {
  width: 300px;
  padding: 20px;
}
</style>