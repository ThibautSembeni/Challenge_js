<script setup>
import { onMounted, reactive, onUnmounted, ref } from 'vue'
import store from '@/stores/store'
import AmountByDay from '@/components/KPI/AmountByDay.vue'
import TransactionsNumberByDay from '@/components/KPI/TransactionsNumberByDay.vue'
import TransactionsNumberByYear from '@/components/KPI/TransactionsNumberByYear.vue'

import { generateHourlyData, getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/date'
import { generateValue, generateLabelsData } from '@/utils/dashboardKpis'
import axios from 'axios'
const user = store.state.user

const statsData = reactive({
  amountByDay: [],
  numberByYear: [],
  numberByDays: { labels: [], datasets: [] }
})

onMounted(async () => {
  await subscribeToSSETransaction()
})

onUnmounted(async () => {
  if (eventSource.value) {
    eventSource.value.close()
  }
})

const eventSource = ref(null)

async function subscribeToSSETransaction() {
  const params = new URLSearchParams()
  params.set('id', user.id)
  eventSource.value = new EventSource(
    `${import.meta.env.VITE_API_URL}/transactions/stats/subscribe?` + params
  )
  bindEventSource(eventSource.value)
}

function bindEventSource(eventSource) {
  eventSource.addEventListener('amountByDay', (event) => {
    // if (inputData.date === new Date().toISOString().split('T')[0]) {
    const message = JSON.parse(event.data)
    statsData.amountByDay = generateHourlyData(message)
    // }
  })
  eventSource.addEventListener('numberByYear', (event) => {
    const message = JSON.parse(event.data)
    statsData.numberByYear = generateValue(message)
  })
  eventSource.addEventListener('numberByDays', (event) => {
    const message = JSON.parse(event.data)
    const { labels, datasets } = generateLabelsData(
      message,
      getFirstDayOfMonth(),
      getLastDayOfMonth()
    )
    statsData.numberByDays = { labels, datasets }
  })
}
</script>

<template>
  <section class="py-4 flex flex-col space-y-2 gap-2">
    <AmountByDay :height="50" :width="250" :statsData="statsData" />
    <div class="flex w-full"></div>
    <TransactionsNumberByDay :height="50" :width="250" :statsData="statsData" />
    <TransactionsNumberByYear :height="50" :width="250" :statsData="statsData" />
  </section>
</template>
