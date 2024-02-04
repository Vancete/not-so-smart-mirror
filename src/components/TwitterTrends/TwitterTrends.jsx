import { CapacitorHttp } from "@capacitor/core"
import { useEffect, useState } from "react"
import './TwitterTrends.scss'

const TwitterTrends = ({ country }) => {
    const [time, setTime] = useState(new Date())
    const [trends, setTrends] = useState(null)

    useEffect(() => {
        getTrendsData()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getTrendsData()
            setTime(new Date())
        }, 1800000);

        return () => clearInterval(interval);
    }, [time])

    const getTrendsData = () => {
        CapacitorHttp.get({url:`https://www.twitter-trending.com/${country}/en`})
        .then(response => {
            const ldStart = response.data.indexOf('<script type="application/ld+json">') + '<script type="application/ld+json">'.length
            const ldEnd = response.data.indexOf('</script>', ldStart)
            const ldContent = JSON.parse(response.data.substr(ldStart, ldEnd - ldStart))
            setTrends(ldContent.itemListElement)
        })
        .catch(e => {
            console.log(e)
        })
    }

    return <div className="twitter-widget">{trends && trends.slice(0,7).map(item => <label key={item.name}>{item.name}</label>)}</div>
}

export default TwitterTrends