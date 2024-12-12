import { date } from 'quasar'

const dateHandler = {
  formatDayMonth: (dateString:string | Date)=>{
    return date.formatDate(dateString, 'D MMM.')
  },
  formatShortDateAndTime(date: string | Date | number): string {
    try {
      const d =  new Date(date)
      
      if (isNaN(d.getTime())) {
        throw new Error('Invalid date');
      }
  
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear().toString().slice(-2);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
  
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
      throw new Error('Failed to parse date');
    }
  },
  formatYearMonthDay: (dateString: string | Date) => {
    return date.formatDate(dateString, 'D MMM. YYYY')
  },
  countWeekdays : (start: Date, end: Date): number => {
    let count = 0
    let current = new Date(start)
    
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    
    return count
  },
  dateToESTTimestamp(date: string | Date | number): number {
    // Convert input to Date object
    const inputDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(inputDate.getTime())) {
        throw new Error('Invalid date format');
    }

    // Get UTC timestamp and add 5 hours
    const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;
    return inputDate.getTime() + FIVE_HOURS_IN_MS;
  }
}

export default dateHandler