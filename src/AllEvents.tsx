import moment from 'moment'
import { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { requestEvents } from './utils/EventHelper'

const today = moment()

export default function AllEvents({ onNavigate }: { onNavigate: any }): React.JSX.Element {

    const [currentMonth, setCurrentMonth] = useState<string>('')
    const [events, setEvents] = useState<object | any>({})

    useEffect(() => { getCurrentMonthEvents() }, [])

    const CurrentMonthYear = () => {
        const month = today.format('MMM-YYYY')
        setCurrentMonth(month)
    }

    const getCurrentMonthEvents = async () => {
        const startOfMonth = moment().startOf('month')
        const endOfMonth = moment().endOf('month')

        try {
            CurrentMonthYear()
            // const ev = await RNCalendarEvents.findEventById("2693")
            // const ev = await RNCalendarEvents.findCalendars()

            const calendarEvents: any = await requestEvents(startOfMonth, endOfMonth)

            const formatted = calendarEvents.map((event: any) => ({
                id: event.id,
                name: event.title || 'No Title',
                start: moment(event.startDate).format('YYYY-MM-DD HH:mm'),
                end: moment(event.endDate).format('YYYY-MM-DD HH:mm'),
            }));

            setEvents(formatted)

        } catch (error) {
            console.warn('Failed to load events', error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.monthHeader}>{currentMonth}</Text>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View style={styles.item}>
                        <Text style={styles.text}>No events this month</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.name}</Text>
                        <Text style={styles.text}>Start: {item.start}</Text>
                        <Text style={styles.text}>End: {item.end}</Text>
                    </View>
                )}
            />

            <View style={{ marginBottom: 20, marginHorizontal: 10, justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ backgroundColor: 'skyblue', borderRadius: 5, padding: 10, marginBottom: 10 }}
                    onPress={() => onNavigate('datewise')}
                >
                    <Text style={{}}>Date wise events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'skyblue', borderRadius: 5, padding: 10 }}
                    onPress={() => onNavigate('today')}
                >
                    <Text style={{}}>Today</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    monthHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: 'black',
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        elevation: 2,
        marginTop: 17,
        borderRadius: 5,
    },
    item2: {
        padding: 10,
    },
    text: {
        fontSize: 16,
        color: 'black'
    },
})
