import { CapacitorHttp } from "@capacitor/core"
import { format, formatRFC3339, parse } from "date-fns"
import { useEffect, useState } from "react"
import './GoogleCalendar.scss'

const GoogleCalendar = ({ gApiKey, bearerToken }) => {
    const [time, setTime] = useState(new Date())
    const [events, setEvents] = useState(null)

    useEffect(() => {
        getCalendarData()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getCalendarData()
            setTime(new Date())
        }, 1800000);

        return () => clearInterval(interval);
    }, [time])

    const getCalendarData = () => {
        CapacitorHttp.get({url:`https://www.googleapis.com/calendar/v3/calendars/0b8nagt3cdbdaeatume9rg1ckg%40group.calendar.google.com/events?timeMin=${formatRFC3339(new Date())}&key=${gApiKey}`, headers: {'Authentication': `Bearer ${bearerToken}`}})
        .then(response => {
            const DAY_MSECONDS = 86400000
            let calendarEvents = response.data.items
            calendarEvents.map(event => {
                if (event.recurrence && event.recurrence.length && event.recurrence[0].indexOf('YEARLY') != -1) {
                    event.start.date = parse(event.start.date.substr(5,5), 'MM-dd', new Date())
                    event.end.date = parse(event.end.date.substr(5,5), 'MM-dd', new Date())
                } else {
                    event.start.date = parse(event.start.date, 'yyyy-MM-dd', new Date())
                    event.end.date = parse(event.end.date, 'yyyy-MM-dd', new Date())
                }
                if (event.end.date - event.start.date <= DAY_MSECONDS) {
                    event.singleDay = true
                }
            })
            calendarEvents = calendarEvents.sort((a, b) => a.start.date - b.start.date)
            setEvents(calendarEvents)
        })
        .catch(e => {
            console.log(e)
        })
    }

    return <div className="gcalendar-widget">
        {events ? events.slice(0, 3).map(event => <div key={event.summary}>
            <label className="start">{format(event.start.date, 'dd/MM')}</label>
            {event.singleDay ? null : <label className="end">{format(event.end.date, 'dd/MM')}</label>}
            <label className="summary">{event.summary}</label>
        </div>) : null}
        </div>
}

export default GoogleCalendar