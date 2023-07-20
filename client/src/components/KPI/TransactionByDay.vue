<script setup>
import { onMounted, defineProps, reactive, ref } from 'vue'
import httpClient from '@/services/httpClient'
import ChartGraph from '@/components/charts/ChartGraph.vue'

defineProps({
  width: {
    type: [String, Number],
    default: '400'
  },
  height: {
    type: [String, Number],
    default: '200'
  }
})

const defaultValue = {
  type: 'line',
  data: {
    labels: [
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
      '23:59'
    ],
    datasets: [
      {
        label: 'Montant des transactions par heure',
        data: [],
        borderColor: 'rgba(98, 90, 250, 1)',
        backgroundColor: 'rgba(98, 90, 250, 0.2)',
        fill: false
      }
    ]
  },
  options: {
    xAxis: {
      tickInterval: 1,
      tickFormat: function (value) {
        return new Date(value * 1000).toLocaleString('fr-FR', {
          hour12: false,
          timeZone: 'Europe/Paris'
        })
      }
    },
    scales: {
      y: {
        grid: {
          display: false
        }
      }
    }
  }
}

const config = reactive({ ...defaultValue })

const loading = ref(true)

const inputData = reactive({
  date: new Date().toISOString().split('T')[0]
})

onMounted(async () => {
  await getStats(inputData.date)
})

async function getStats(date) {
  const response = await httpClient.get(`/transactions/stats/nbbyday?date=${date}`)
  if (response.status === 200) {
    const responseData = generateHourlyData(response.data)
    config.data.datasets[0].data = responseData
    loading.value = false
  } else {
    throw new Error(
      `Error: ${response.status} - Une erreur s'est produite lors de la récupération des données.`
    )
  }
}

function generateHourlyData(data) {
  const result = []
  const hoursInDay = 24

  for (let i = 0; i < hoursInDay; i++) {
    result.push(0)
  }

  data.forEach((item) => {
    const hour = item._id
    if (hour >= 0 && hour < hoursInDay) {
      result[hour] = item.totalAmount
    }
  })

  return result
}

async function handleDateChange(event) {
  await getStats(event.target.value)
}
</script>

<template>
  <input
    type="date"
    v-model="inputData.date"
    placeholder="Date"
    v-bind:min="new Date()"
    @change="handleDateChange"
  />

  <!-- <div class="relative max-w-sm">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
        />
      </svg>
    </div>
    <input
      datepicker
      datepicker-format="yyyy-mm-dd"
      :v-model="inputData.date"
      :locale="{ language: 'fr' }"
      type="text"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Select date"
      @change="handleDateChange"
      :close-on-select="true"
    />
  </div> -->

  <!-- <vue-tailwind-datepicker as-single i18n="fr" v-model="dateValue" defaultdate="2023-07-20" /> -->

  <ChartGraph :config="config" :loading="false" :width="width" :height="height" />
</template>
