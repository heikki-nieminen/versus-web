export const combineDateAndTime = (date, time) => {
    const combinedDateAndTime = new Date(date)
    combinedDateAndTime.setHours(time.getHours())
    combinedDateAndTime.setMinutes(time.getMinutes())
    return combinedDateAndTime
}

export const dateAndTimeToLocale = (dateTime) => {
    const date = dateTime.toLocaleDateString('fi-FI')
    const time = dateTime.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'})
    return `${date} ${time}`
}