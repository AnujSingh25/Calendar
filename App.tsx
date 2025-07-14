import moment from 'moment'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import { requestCalendarPermission } from './src/utils/EventHelper'
import TodayaEvent from './src/TodayEvent'
import AllEvents from './src/AllEvents'
import DateWiseEvents from './src/DateWiseEvents'


let persistor = persistStore(store);

function App(): React.JSX.Element {

  const [permission, setPermission] = useState<string>('undetermined')
  const [screen, setScreen] = useState<'today' | 'all' | 'datewise'>('today')

  useEffect(() => { getPermission() }, [])

  const getPermission = async () => {
    try {
      let status: any = await requestCalendarPermission()
      setPermission(status)
    } catch (error) {
      console.warn('Permission error', error)
    }
  }

  if (permission !== 'authorized') {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Waiting for calendar permission...</Text>
          </SafeAreaView>
        </PersistGate>
      </Provider>
    )
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          {screen === 'today' && <TodayaEvent onNavigate={setScreen} />}
          {screen === 'all' && <AllEvents onNavigate={setScreen} />}
          {screen === 'datewise' && <DateWiseEvents onNavigate={setScreen} />}
        </SafeAreaView>
      </PersistGate>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'black',
  }
});

export default App;
