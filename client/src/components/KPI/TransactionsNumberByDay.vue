<script setup>
import { onMounted, defineProps, reactive, ref, watch } from 'vue'
import httpClient from '@/services/httpClient'
import ChartGraph from '@/components/charts/ChartGraph.vue'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils/date'
import { generateLabelsData } from '../../utils/dashboardKpis'

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

const dateInput = ref()

var labels = []

for (var i = 0; i < 30; i++) {
  var date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
  labels.push(
    date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  )
}

const defaultValue = {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Nombre de transactions par jour',
        data: props.statsData.numberByDays.datasets,
        borderColor: 'rgba(98, 90, 250, 1)',
        backgroundColor: 'rgba(98, 90, 250, 0.7)'
      }
    ]
  },
  options: {}
}

const config = reactive({ ...defaultValue })

const loading = ref(true)

const inputData = reactive({
  start_date: getFirstDayOfMonth(),
  end_date: getLastDayOfMonth()
})

dateInput.value = [inputData.start_date, inputData.end_date]

onMounted(async () => {
  await getStats()
})

watch(
  () => props.statsData.numberByDays,
  async (newValue) => {
    config.data.datasets[0].data = newValue.datasets
    config.data.labels = newValue.labels
  }
)

async function getStats() {
  const params = new URLSearchParams()

  params.set('start_date', inputData.start_date)
  params.set('end_date', inputData.end_date)

  const response = await httpClient.get(`/transactions/stats/numberbyday?${params}`)
  if (response.status === 200) {
    const { labels, datasets } = generateLabelsData(
      response.data,
      inputData.start_date,
      inputData.end_date
    )

    config.data.datasets[0].data = datasets
    config.data.labels = labels
    loading.value = false
  } else {
    throw new Error(
      `Error: ${response.status} - Une erreur s'est produite lors de la récupération des données.`
    )
  }
}

function onSelectDate(date) {
  inputData.start_date = formatDate(date[0])
  inputData.end_date = formatDate(date[1])
  getStats()
}
</script>

<template>
  <article>
    <div class="flex items-center space-x-2">
      <label for="date" class="block text-sm font-medium text-gray-700">Filtrer entre :</label>
      <VueDatePicker
        class="max-w-xs"
        v-model="dateInput"
        range
        @update:model-value="onSelectDate"
        format="yyyy-MM-dd"
      />
    </div>

    <ChartGraph :config="config" :loading="false" :width="width" :height="height" />
  </article>
</template>
