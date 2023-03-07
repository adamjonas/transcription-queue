export const dateFormat = (date: Date) => {
  const options = {
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit", 
    timeZone: "UTC" 
  } as const
  const _date = new Date(date)
  return new Intl.DateTimeFormat(undefined, options).format(_date)
}

const wordsFormat = new Intl.NumberFormat('en-US', {
  notation: "compact",
  compactDisplay: "short"
});

export const getCount = (number: number) => {
  return wordsFormat.format(number)
}