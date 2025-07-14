import moment from 'moment'
import { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { requestEvents } from './utils/EventHelper'

const today = moment()

export default function TodayaEvent({ onNavigate }: { onNavigate: any }): React.JSX.Element {

    const [events, setEvents] = useState<object | any>({})

    useEffect(() => { getEvents() }, [])

    const getEvents = async () => {
        // const future = moment(today).add(30, 'days')
        // const startOfMonth = moment().startOf('month')
        // const endOfMonth = moment().endOf('month')

        try {

            const startOfDay = moment().startOf('day')
            const endOfDay = moment().endOf('day')

            const data: any = await requestEvents(startOfDay, endOfDay)

            const TodayEvents = data.filter((item: any) => {
                const eventStartDate = moment(item.startDate).format('YYYY-MM-DD');
                return eventStartDate == today.format('YYYY-MM-DD');
            })

            const res = TodayEvents.map((item: any) => ({
                id: item.id,
                title: item.title || 'No Title',
                start: moment(item.startDate).format('HH:mm'),
                end: moment(item.endDate).format('HH:mm'),
            }));

            setEvents(res);

        } catch (error) {
            console.warn('Failed to load events', error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>{"Today's Event"}</Text>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ ...styles.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{item.title}</Text>
                        <Text style={styles.text}>{item.start} :: {item.end}</Text>
                    </View>
                )}
                contentContainerStyle={{ marginHorizontal: 10, alignItems: 'center' }}
            />

            <View style={{ marginBottom: 20, marginHorizontal: 10, justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ backgroundColor: 'skyblue', borderRadius: 5, padding: 10, marginBottom: 10 }}
                    onPress={() => onNavigate('datewise')}
                >
                    <Text style={{}}>Date wise events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'skyblue', borderRadius: 5, padding: 10 }}
                    onPress={() => onNavigate('all')}
                >
                    <Text style={{}}>All events</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
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
    },
    text: {
        fontSize: 16,
        color: 'black'
    },
})
