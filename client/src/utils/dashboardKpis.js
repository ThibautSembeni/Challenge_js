import { formatDate } from './date';

export function generateLabelsData(data, start_date, end_date) {
    const labels = []
    const datasets = []

    const numOfDays =
        (new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 3600 * 24)
    for (var i = 0; i <= numOfDays; i++) {
        var date = new Date(start_date)
        date.setDate(date.getDate() + i)
        labels.push(
            date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            })
        )
        const currentValue = data.find((item) => item._id === formatDate(date))
        typeof currentValue !== 'undefined' ? datasets.push(currentValue.count) : datasets.push(0)
    }
    return { labels, datasets }

}

export function generateValue(data) {
    const result = Array.from({ length: 12 }, () => 0)

    data.forEach((item) => {
        result[new Date(item._id).getMonth()] = item.count
    })

    return result
}