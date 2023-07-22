<script setup>
import { onMounted, reactive } from 'vue'
import store from '@/stores/store'
import AmountByDay from '@/components/KPI/AmountByDay.vue'
import TransactionsNumberByDay from '@/components/KPI/TransactionsNumberByDay.vue'
import TransactionsNumberByYear from '@/components/KPI/TransactionsNumberByYear.vue'

import { generateHourlyData, getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/date'
import { generateValue, generateLabelsData } from '@/utils/dashboardKpis'
const user = store.state.user

const statsData = reactive({
  amountByDay: [],
  numberByYear: [],
  numberByDays: { labels: [], datasets: [] }
})

onMounted(async () => {
  await subscribeToSSETransaction()
})

async function subscribeToSSETransaction() {
  const params = new URLSearchParams()
  params.set('id', user.id)
  const eventSource = new EventSource(
    `${import.meta.env.VITE_API_URL}/transactions/stats/subscribe?` + params
  )
  bindEventSource(eventSource)
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
  <AmountByDay :height="50" :width="250" :statsData="statsData" />
  <TransactionsNumberByDay :height="50" :width="250" :statsData="statsData" />
  <TransactionsNumberByYear :height="50" :width="250" :statsData="statsData" />
</template>
