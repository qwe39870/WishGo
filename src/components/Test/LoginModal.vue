<script setup>
import { defineEmits, defineProps } from 'vue'
import LoginForm from './HomePage/LoginForm.vue'

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close'])

function close() {
  emit('close')
}

function handleSubmit(data) {
  console.log('收到登入資料:', data)
  // 登入成功後關閉彈窗
  close()
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">X</button>
      <LoginForm />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  position: relative;
  min-width: 300px;
}
.close-btn {
  position: absolute;
  top: 5px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>
