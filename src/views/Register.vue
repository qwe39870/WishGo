<template>
    <Header />
    <Categories />
    <div
        class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 flex items-start justify-center p-4">
        <div class="w-full max-w-md mt-12 bg-backColor backdrop-blur-md rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-pink-600 mb-4 text-center">註冊帳號</h2>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Email & 驗證碼區塊 -->
                <!-- Email 輸入 + 發送驗證碼（整合倒數功能） -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700">Email</label>
                    <div class="flex gap-2">
                        <input v-model="form.email" type="email" required
                            class="flex-1 px-4 py-2 rounded-md border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                        <button type="button" @click="sendCode" :disabled="countdown > 0"
                            class="whitespace-nowrap px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 shadow-sm disabled:opacity-50">
                            {{ countdown > 0 ? `${countdown} 秒後可重發` : '發送驗證碼' }}
                        </button>
                    </div>
                </div>

                <!-- 驗證碼 + 驗證按鈕（同一行） -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">輸入驗證碼</label>
                    <div class="flex gap-2">
                        <input v-model="form.verificationCode" type="text" maxlength="6" required
                            class="flex-1 px-4 py-2 rounded-md border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                        <button type="button" @click="verifyCode" :disabled="verifying"
                            class="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 whitespace-nowrap disabled:opacity-50">
                            {{ verifying ? '驗證中...' : '驗證' }}
                        </button>
                    </div>

                    <p v-if="!isVerified && triedVerify" class="text-red-500 text-sm font-semibold mt-1">
                        驗證失敗，請確認驗證碼是否正確
                    </p>
                    <p v-if="isVerified" class="text-green-600 text-sm font-semibold mt-1">
                        ✅ 驗證成功
                    </p>
                </div>





                <!-- 其他欄位：只有驗證成功後才顯示 -->
                <div v-if="isVerified">
                    <!-- 其餘欄位同前略 -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700">稱呼</label>
                        <input v-model="form.nickname" type="nickname" required
                            class="w-full px-4 py-2 rounded-md border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700">帳號</label>
                        <input v-model="form.username" type="username" required
                            class="w-full px-4 py-2 rounded-md border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                        <p v-if="form.username.length > 0 && form.username.length < 6"
                            class="text-red-500 font-semibold text-sm mt-1">
                            帳號至少需 6 字元</p>

                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700">密碼</label>
                        <div class="relative">
                            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required
                                placeholder="請輸入密碼"
                                class="w-full px-4 py-2 border border-pink-200 rounded-md pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                            <button type="button" @click="togglePassword"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
                                aria-label="切換密碼可見">
                                <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="w-5 h-5" />
                            </button>
                        </div>

                        <!-- 額外提示 -->
                        <p v-if="form.password.length > 0 && form.password.length < 6"
                            class="text-red-500 font-semibold text-sm mt-1">
                            密碼至少需 6 字元</p>

                        <!-- 強度條 -->
                        <div v-if="form.password.length >= 6" class="h-2 mt-2 rounded-full bg-gray-200 overflow-hidden">
                            <div :class="strengthColor" class="h-full transition-all duration-300"
                                :style="{ width: strengthWidth }"></div>
                        </div>

                        <!-- 強度文字 -->
                        <p v-if="form.password.length >= 6" :class="textColor" class="text-sm font-semibold mt-1">
                            {{ strengthText }}
                        </p>
                    </div>



                    <div>
                        <label class="block text-sm font-semibold text-gray-700">確認密碼</label>
                        <input v-model="form.confirmPassword" type="password" name="confirmPassword" required
                            class="w-full px-4 py-2 rounded-md border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                        <p v-if="form.confirmPassword && form.password !== form.confirmPassword"
                            class="text-red-500 font-semibold text-sm mt-1">密碼不一致</p>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700">手機號碼</label>
                        <input v-model="form.phone" type="tel" required pattern="^09\d{8}$"
                            class="w-full px-4 py-2 rounded-md border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700">地址</label>
                        <input v-model="form.address" type="text"
                            class="w-full px-4 py-2 rounded-md border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none" />
                    </div>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="form.agree" required class="accent-pink-500" />
                        <label class="text-sm text-gray-600">我同意 <a href="#"
                                class="text-pink-600 underline">使用者條款</a></label>
                    </div>


                </div>
                <button type="submit"
                    class="w-full bg-pinky text-white py-2 rounded-full shadow hover:bg-pink-500 transition font-semibold">
                    註冊
                </button>
            </form>

            <p class="mt-4 text-center text-sm text-gray-600">
                已有帳號？
                <a href="/login" class="text-pink-500 font-semibold hover:underline">前往登入</a>
            </p>
        </div>
    </div>
</template>


<script setup>

import { reactive, computed, ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import Header from '@/components/HomePage/Header.vue'
import Categories from '@/components/Categories.vue'
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'
import axios from '@/plugins/axios.js'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const isVerified = ref(false)
const triedVerify = ref(false)

const countdown = ref(0)
let timer = null
const verifying = ref(false)

const showPassword = ref(false)
const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const form = reactive({
    email: '',
    verificationCode: '',
    nickname: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    agree: false
})

async function handleSubmit() {
    console.log("註冊被按了");

    if (isVerified)

        // 基本欄位空值處理
        if (!form.email || !form.username || !form.password || !form.confirmPassword) {
            Swal.fire({
                icon: "warning",
                text: "請填寫所有必填欄位",
            });
            return;
        }

    // 帳號與密碼長度限制
    if (form.username.length < 6) {
        Swal.fire({
            icon: "warning",
            text: "帳號長度需至少 6 字元",
        });
        return;
    }

    if (form.password.length < 6) {
        Swal.fire({
            icon: "warning",
            text: "密碼長度需至少 6 字元",
        });
        return;
    }

    // 密碼強度檢查（至少中等）
    if (strengthScore.value <= 2) {
        Swal.fire({
            icon: "warning",
            text: "密碼強度太弱，請提升密碼複雜度（至少包含大小寫、數字與符號）",
        });
        return;
    }

    // 密碼一致性
    if (form.password !== form.confirmPassword) {
        Swal.fire({
            icon: "warning",
            text: "密碼與確認密碼不一致",
        });
        return;
    }

    // 身分送出資料
    const body = {
        email: form.email,
        nickname: form.nickname,
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        address: form.address
    };

    try {
        const response = await axios.post("/base/register", body);
        console.log("response1", response);

        if (response.data.success) {
            await Swal.fire({
                text: response.data.success || "註冊成功！",
                icon: "success",
            });

            router.push("/");
        } else {
            Swal.fire({
                text: response.data.message,
                icon: "warning",
            });
        }
    } catch (error) {
        console.log("error", error);
        Swal.fire({
            text: error.response?.data?.error || "註冊時發生錯誤",
            icon: "error",
        });
    }
}




const strengthScore = computed(() => {
    const pwd = form.password
    let score = 0

    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[\W_]/.test(pwd)) score++

    return score
})

const strengthWidth = computed(() => {
    return `${(strengthScore.value / 5) * 100}%`
})

const strengthText = computed(() => {
    if (form.password.length === 0) return ''
    if (strengthScore.value <= 2) return '密碼強度：弱'
    if (strengthScore.value <= 4) return '密碼強度：中等'
    return '密碼強度：強'
})

const strengthColor = computed(() => {
    if (strengthScore.value <= 2) return 'bg-red-400'
    if (strengthScore.value <= 4) return 'bg-yellow-400'
    return 'bg-green-400'
})

const textColor = computed(() => {
    if (strengthScore.value <= 2) return 'text-red-500'
    if (strengthScore.value <= 4) return 'text-yellow-500'
    return 'text-green-500'
})


const sendCode = async () => {
    if (!form.email) {
        Swal.fire({
            icon: 'warning',
            title: '請輸入Email',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: '知道了！',
            background: '#fff0f6',
            color: '#7d1c4e',
            customClass: {
                title: 'text-pink-600 text-xl font-bold',
                htmlContainer: 'text-base leading-relaxed',
                popup: 'glass-alert p-6 rounded-xl shadow-xl',
            },

        });
        return
    }
    try {
        Swal.fire({
            title: '請稍候...',
            html: `<div class="pink-spinner"></div>
      <p class="text-pink-600 font-medium">正在努力組織驗證咒語 ✨</p>
      
    `,
            allowOutsideClick: false,
            showConfirmButton: false,
            background: '#fff0f0',
            customClass: {
                popup: 'glass-alert p-6 rounded-xl shadow-xl',
                title: 'text-pink-500 text-lg font-bold',
                htmlContainer: 'text-center'
            }
        });



        await axios.post('/base/register/request', { email: form.email })

        Swal.fire({
            icon: 'success',
            title: '大成功！',
            html: '<p>驗證咒語已寄出<br>請前往信箱查看</p>',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: '知道了！',
            background: '#fff0f6',
            color: '#7d1c4e',
            customClass: {
                title: 'text-pink-600 text-xl font-bold',
                htmlContainer: 'text-base leading-relaxed',
                confirmButton: 'bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded mt-4'
            },

        });

        // 啟動倒數計時
        countdown.value = 60
        timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) clearInterval(timer)
        }, 1000)


    } catch (error) {
        Swal.fire({ icon: 'error', text: error.response?.data?.error || '寄送失敗' })
    }
}

const verifyCode = async () => {
    verifying.value = true
    triedVerify.value = true
    if (!form.verificationCode) {
        Swal.fire({
            icon: 'warning',
            title: '請輸入驗證碼',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: '知道了！',
            background: '#fff0f6',
            color: '#7d1c4e',
            customClass: {
                title: 'text-pink-600 text-xl font-bold',
                htmlContainer: 'text-base leading-relaxed',
                popup: 'glass-alert p-6 rounded-xl shadow-xl',
            },

        });
        return
    }
    try {
        await axios.post('/base/register/verify-code', {
            email: form.email,
            code: form.verificationCode
        })
        isVerified.value = true
        Swal.fire({ icon: 'success', text: '驗證成功' })
    } catch (error) {
        isVerified.value = false
        Swal.fire({ icon: 'error', text: error.response?.data?.error || '驗證失敗' })
    } finally {
        verifying.value = false
    }
}
</script>
