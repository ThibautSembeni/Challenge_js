<script setup>
import { onMounted, defineProps, reactive, ref, watch } from 'vue'
import httpClient from '@/services/httpClient'
import ChartGraph from '@/components/charts/ChartGraph.vue'
import { formatDate, generateHourlyData } from '../../utils/date'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '400'
  },
  height: {
    type: [String, Number],
    default: '200'
  },
  statsData: {
    type: Object
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
        data: props.statsData.amountByDay,
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

watch(
  () => props.statsData.amountByDay,
  async (newValue) => {
    config.data.datasets[0].data = newValue
  }
)

async function getStats(date) {
  const response = await httpClient.get(`/transactions/stats/amountbyday?date=${date}`)
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

async function handleDateChange(event) {
  await getStats(formatDate(event))
}
</script>

<template>
  <article>
    <div class="flex items-center space-x-2">
      <label for="date" class="block text-sm font-medium text-gray-700">Filtrer le:</label>
      <VueDatePicker
        class="max-w-xs"
        v-model="inputData.date"
        @update:model-value="handleDateChange"
        format="yyyy-MM-dd"
      />
    </div>

    <ChartGraph :config="config" :loading="false" :width="width" :height="height" />
  </article>
</template>
