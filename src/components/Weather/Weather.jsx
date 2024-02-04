import { format, parse } from 'date-fns'
import { CapacitorHttp } from '@capacitor/core'
import { useState, useEffect } from 'react'
import './Weather.scss'

import sunnyIcon from './icons/clear-day.svg'
import moonIcon from './icons/clear-night.svg'
import rainIcon from './icons/rain.svg'
import snowIcon from './icons/snow.svg'
import sleetIcon from './icons/sleet.svg'
import windIcon from './icons/wind.svg'
import fogIcon from './icons/mist.svg'
import cloudyIcon from './icons/cloudy.svg'
import cloudyDayIcon from './icons/partly-cloudy-day.svg'
import cloudyNightIcon from './icons/partly-cloudy-night.svg'
import unknownIcon from './icons/undefined.svg'
import sunriseIcon from './icons/sunrise.svg'
import moonriseIcon from './icons/moonrise.svg'

const Weather = ({ pirateweatherApiKey, name, lat, lon, units }) => {
    const [weatherData, setWeatherData] = useState(null)
    const [sunData, setSunData] = useState(null)

    const statusTranslation = {
        'clear-day': 'Despejado', 
        'clear-night' : 'Despejado',
        'rain': 'Ta lloviendo',
        'snow': 'Nieva 😯',
        'sleet': 'Aguanieve',
        'wind': 'Ventisca',
        'fog': 'Neblina',
        'cloudy': 'Pinta feo',
        'partly-cloudy-day': 'Nublaillo',
        'partly-cloudy-night': 'Nublaillo'
    }
    const statusIcons = {
        'clear-day': sunnyIcon,
        'clear-night' : moonIcon,
        'rain': rainIcon,
        'snow': snowIcon,
        'sleet': sleetIcon,
        'wind': windIcon,
        'fog': fogIcon,
        'cloudy': cloudyIcon,
        'partly-cloudy-day': cloudyDayIcon,
        'partly-cloudy-night': cloudyNightIcon
    }

    const fetchWeatherData = () => {
        CapacitorHttp.get({url:`https://api.pirateweather.net/forecast/${pirateweatherApiKey}/${lat},${lon}?units=${units ? units : 'si'}&exclude=minutely,hourly,daily`})
        .then(response => {
            if (response.data) {
                setWeatherData(response.data)
            }
        })
        .catch(e => {
            console.log(e)
        })
    }

    const fetchSunData = () => {
        console.log(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`)
        CapacitorHttp.get({url:`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`})
        .then(response => {
            if (response.data && response.data.results) {
                setSunData(response.data.results)
            }
        })
        .catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        if (!weatherData) {
            fetchWeatherData()
            fetchSunData()
        }

        const interval = setInterval(() => {
            fetchWeatherData()
            fetchSunData()
        }, 900000);

        return () => clearInterval(interval);
    }, [weatherData])

    return <div className="weather-widget">
        <div className='main-data'>
            <div className='icon'>
                <img src={weatherData && weatherData.currently ? statusIcons[weatherData.currently.icon] ? statusIcons[weatherData.currently.icon] : unknownIcon : unknownIcon}/>
            </div>
            <div className='info'>
                <label>{weatherData && weatherData.currently ? Math.round(weatherData.currently.temperature) : '?'}º</label>
                <label>{name}</label>
                <label>{weatherData && weatherData.currently ? statusTranslation[weatherData.currently.icon] : '...'}</label>
            </div>
        </div>
        <div className='day-data'>
            <div>
                <img src={sunriseIcon}/>
                <label>{sunData ? format(parse(sunData.dawn, 'hh:mm:ss aa', new Date()), 'HH:mm') : '?'}</label>
            </div>
            <div>
                <img src={moonriseIcon}/>
                <label>{sunData ? format(parse(sunData.dusk, 'hh:mm:ss aa', new Date()), 'HH:mm') : '?'}</label>
            </div>
        </div>
    </div>
}

export default Weather