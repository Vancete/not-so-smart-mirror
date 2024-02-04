import { format, isBefore, parse } from 'date-fns'
import { CapacitorHttp } from '@capacitor/core'
import { useEffect, useState } from 'react'
import './MetroValencia.scss'

import trainIcon from './icons/train.svg'

const MetroValencia = ({ title, color, reverse, origin, destination }) => {
    const [time, setTime] = useState(new Date())
    const [hours, setHours] = useState(null)
    const [nextHours, setNextHours] = useState(null)

    useEffect(() => {
        getMetrovalenciaData()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
            getNextHours()
        }, 5000);

        return () => clearInterval(interval);
    }, [time])

    useEffect(() => {
        const interval = setInterval(() => {
            getMetrovalenciaData()
        }, 900000);

        return () => clearInterval(interval);
    }, [hours])

    const getMetrovalenciaData = () => {
        CapacitorHttp.post({
            url:'https://www.metrovalencia.es/wp-content/themes/metrovalencia/functions/ajax-no-wp.php',
            headers: {
                'Host': 'www.metrovalencia.es',
                'Origin': 'https://www.metrovalencia.es',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'PHPSESSID=323thhfc70s2n5c4osssifanad'
            },
            data: {
                action: 'formularios_ajax',
                data: `auth_token=3aa630cb8235d791ab16b2b92d87898d&action=horarios-ruta&origen=${origin}&destino=${destination}&dia=${format(new Date(), 'yyyy-MM-dd')}&horaDesde=00%3A00&horaHasta=23%3A59`
            }
        })
        .then(response => {
            if (response.data) {
                try {
                    const responseData = JSON.parse(response.data)
                    let hoursData = []
                    Object.keys(responseData.result[0].pasos[0].horarios).forEach((key) => {
                        hoursData = [...hoursData, ...responseData.result[0].pasos[0].horarios[key]]
                    })
                    hoursData = hoursData.sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0)
                    setHours(hoursData.map(item => parse(item, 'HH:mm', new Date())))
                } catch(e) {
                    console.log(e)
                }
            }
        })
    }

    const getNextHours = () => {
        if (hours && hours.length) {
            let filterNextHours = hours.filter(item => isBefore(new Date(), item))
            setNextHours(filterNextHours.slice(0, 3))
        }
    }

    return <div className='metrovalencia-widget' style={color ? {'backgroundColor': color} : {}}>
        <img src={trainIcon} className={`icon ${reverse ? 'reverse' : ''}`} />
        <label className='title'>{title}</label>
        <div className='spacer'></div>
        <div className='times'>
            {nextHours && nextHours.length ? nextHours.map(item => <label key={format(item, 'HH:mm')}>{format(item, 'HH:mm')}</label>) : <label>?</label>}
        </div>
    </div>
}

export default MetroValencia