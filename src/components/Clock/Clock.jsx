import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import './Clock.scss'

const Clock = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000);

        return () => clearInterval(interval);
    }, [time])

    return <div className="clock-widget">
        <label className='hours'>{format(time, 'HH')}</label>
        <label className='minutes'>{format(time, 'mm')}</label>
    </div>
}

export default Clock