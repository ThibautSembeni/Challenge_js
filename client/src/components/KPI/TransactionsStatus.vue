<script setup>
import { onMounted, defineProps, reactive, ref, watch } from 'vue'
import httpClient from '@/services/httpClient'
import ChartGraph from '@/components/charts/ChartGraph.vue'
import { generateHourlyData } from '../../utils/date'

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
  type: 'doughnut',
  data: {
    labels: props.statsData.status.labels,
    datasets: [
      {
        data: props.statsData.status.datasets,
        backgroundColor: ['green', 'red', 'blue', 'yellow', 'purple']
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: 'Nombre de transactions par statut'
  }
}

const config = reactive({ ...defaultValue })

const loading = ref(true)

onMounted(async () => {
  await getStats()
})

watch(
  () => props.statsData.status,
  async (newValue) => {
    config.data.datasets[0].data = newValue.datasets
    config.data.labels = newValue.labels
  }
)

async function getStats() {
  const response = await httpClient.get(`/transactions/stats/status`)
  if (response.status === 200) {
    const responseData = response.data
    config.data.datasets[0].data = responseData.map((document) => document.count)
    config.data.labels = responseData.map((document) => document._id.status)
    loading.value = false
  } else {
    throw new Error(
      `Error: ${response.status} - Une erreur s'est produite lors de la récupération des données.`
    )
  }
}
</script>

<template>
  <article>
    <ChartGraph :config="config" :loading="false" :width="width" :height="height" />
  </article>
</template>
