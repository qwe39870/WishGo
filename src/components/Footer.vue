<template>
    <footer class="bg-gradient-to-br from-pink-100 to-purple-100 text-pink-700">
        <!-- 🚨 防詐騙宣導 -->
        <div class="bg-pink-200 text-pink-800 text-sm text-center py-2 px-4">
            ⚠️ 提醒您：本網站不會以電話、簡訊要求操作ATM或轉帳。
            若接獲可疑訊息，請立即撥打 165 反詐騙專線查證。
        </div>

        <div class="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            <!-- 🐰 品牌介紹 -->
            <div>
                <h2 class="text-lg font-bold mb-2">🌟 WishGo 星願購</h2>
                <p class="text-sm text-pink-600">
                    夢幻、可愛、讓你心動的選物天堂 ✨<br />
                    找到專屬你的療癒小物與浪漫生活。
                </p>
            </div>

            <!-- 🔗 快速連結 -->
            <div>
                <h2 class="text-lg font-bold mb-2">🔗 快速導覽</h2>
                <ul class="space-y-1 text-sm">
                    <li>
                        <RouterLink to="/" class="hover:underline">首頁</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/products" class="hover:underline">全部商品</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/favorites" class="hover:underline">收藏清單</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/member" class="hover:underline">會員中心</RouterLink>
                    </li>
                </ul>
            </div>

            <!-- 📱 聯絡我們 -->
            <div>
                <h2 class="text-lg font-bold mb-2">📱 聯絡我們</h2>
                <ul class="space-y-1 text-sm">
                    <li>Email：WishGo@gmail.com</li>
                    <li>電話：02-1234-5678</li>
                    <li class="flex gap-3 mt-2">
                        <a href="#" class="hover:text-pink-500"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="hover:text-pink-500"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="hover:text-pink-500"><i class="fab fa-line"></i></a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 🔒 底部版權 -->
        <div class="text-center text-xs text-pink-500 py-4 border-t border-pink-200">
            &copy; 2025 WishGo ｜星願購 | 夢幻每一天｜All Rights Reserved.
        </div>

    </footer>
</template>

<script setup>
// 如果你要使用 font-awesome 社群圖標，記得在 main.js 引入：
// import '@fortawesome/fontawesome-free/css/all.css'
</script>
