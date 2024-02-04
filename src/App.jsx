import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen'
import { KeepAwake } from '@capacitor-community/keep-awake'
import './App.css'

import Weather from './components/Weather/Weather'
import MetroValencia from './components/MetroValencia/MetroValencia'
import SimpleMessage from './components/SimpleMessage/SimpleMessage'
import Clock from './components/Clock/Clock'
import TwitterTrends from './components/TwitterTrends/TwitterTrends'
import GoogleCalendar from './components/GoogleCalendar/GoogleCalendar'

function App() {
  AndroidFullScreen.isImmersiveModeSupported()
  .then(() => AndroidFullScreen.immersiveMode())
  .catch(console.warn)
  
  KeepAwake.keepAwake()

  const weatherConfig = {
    pirateweatherApiKey: '',
    name: '',
    lat: '',
    lon: '',
    units: ''
  }

  const googleCalendarConfig = {
    gApiKey: '',
    bearerToken: ''
  }

  return (
      <div className='app'>
        <Weather {...weatherConfig} />
        <GoogleCalendar {...googleCalendarConfig} />
        <TwitterTrends country="spain" />
        <div className='spacer'></div>
        <Clock />
        <MetroValencia title="Aeroport" origin={75} destination={182} reverse />
        <MetroValencia title="Xàtiva" origin={75} destination={71} color="#19a445" />
        <SimpleMessage text="bobo el que lo lea 😧" />
      </div>
  )
}

export default App
