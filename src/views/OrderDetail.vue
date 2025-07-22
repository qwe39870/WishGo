<script setup>
import axios from '@/plugins/axios.js'
import Header from '@/components/HomePage/Header.vue'
import StoreSelector from '@/components/StoreSelector.vue'


async function goToPayment() {
    const res = await axios.post('/ecpay/test', null, {
        params: {
            orderId: 'ORDER001',
            amount: 200
        }
    })

    const container = document.createElement('div')
    container.innerHTML = res.data
    document.body.appendChild(container)

    container.querySelector('form').submit()
}
</script>

<template>
    <Header />
    <button @click="goToPayment">前往綠界付款</button>
    
    <StoreSelector />

</template>