import { Calendar } from 'typings';
import { weekDay, dateFormat } from 'utils'
import moment from 'moment';
import { extendMoment } from 'moment-range';

const Moment = extendMoment(moment as any);

const calendarInNumber = (calendar: Calendar) => {
  return Object.keys(calendar)
    .filter(k => weekDay.includes(k))
    .reduce((obj: any, d) => {
      switch (d) {
        case 'monday': {
          obj['1'] = calendar[d];
          break;
        }
        case 'tuesday': {
          obj['2'] = calendar[d];
          break;
        }
        case 'wednesday': {
          obj['3'] = calendar[d];
          break;
        }
        case 'thursday': {
          obj['4'] = calendar[d];
          break;
        }
        case 'friday': {
          obj['5'] = calendar[d];
          break;
        }
        case 'saturday': {
          obj['6'] = calendar[d];
          break;
        }
        case 'sunday': {
          obj['7'] = calendar[d];
          break;
        }
        default: {
          break;
        }
      }
      return obj;
    }, {});
  }

export const calculateDaysFromCalendar = (calendar: Calendar) => {
  const calNumber = calendarInNumber(calendar);
  const startDate = moment(calendar.start_date, dateFormat);
  const endDate = moment(calendar.end_date, dateFormat);
  const daysArray = Array.from(Moment.range(startDate, endDate).by('days'));
  const disabledDays = [] as string[]
  const days = daysArray.map(
    (d: moment.Moment) => {
      const isDisabled = calNumber[d.isoWeekday()] === '0'
      if(isDisabled) {
        disabledDays.push(d.format('YYYYMMDD'))
      }
      return d.format('YYYYMMDD')
    }
  )
  return {days: days, disabledDays: disabledDays}
}
