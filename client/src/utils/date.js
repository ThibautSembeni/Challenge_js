export function formatDate(date) {
    const currentDate = date.toLocaleDateString('fr-FR')
    return (
        currentDate.split('/')[2] + '-' + currentDate.split('/')[1] + '-' + currentDate.split('/')[0]
    )
}

export function getFirstDayOfMonth(today = new Date()) {
    const localDate = new Date(today.getFullYear(), today.getMonth(), 1)
    return formatDate(localDate)
}

export function getLastDayOfMonth(today = new Date()) {
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return formatDate(lastDayOfMonth)
}

export function generateHourlyData(data) {
    const result = Array.from({ length: 24 }, () => 0)

    data.forEach((item) => {
        const hour = item._id
        if (hour >= 0 && hour < 24) {
            result[hour] = item.totalAmount
        }
    })

    return result
}