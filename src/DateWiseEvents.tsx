import moment from 'moment'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars'
import { ReservationListProps } from 'react-native-calendars/src/agenda/reservation-list'
import { requestEvents } from './utils/EventHelper'

const today = moment()

export default function DateWiseEvents({ onNavigate }: { onNavigate: any }): React.JSX.Element {

    const [selectedDate, setSelectedDate] = useState<string | any>(null)
    const [currentMonth, setCurrentMonth] = useState<string>(today.format('MMM-YYYY'))
    const [events, setEvents] = useState<object | any>({})
    const [CalendarRefresh, setCalendarRefresh] = useState<boolean>(false)
    const [filteredItems, setFilteredItems] = useState<AgendaSchedule | undefined>({})

    useEffect(() => {
        CurrentMonthYear()
        dayEvents()
    }, [])

    useEffect(() => {
        if (Object.keys(events).length > 0) {
            const monthItems: any = {}
            Object.keys(events).forEach((date) => {
                const dd = moment(date).clone()
                if (dd.isSame(selectedDate)) {
                    monthItems[date] = events[date]
                }
            })
            setFilteredItems(monthItems)
        }
    }, [selectedDate])

    const CurrentMonthYear = () => {
        setCurrentMonth(today.format('MMM-YYYY'))
    }

    const dayEvents = async () => {
        try {
            const startOfMonth = moment().startOf('month')
            const endOfMonth = moment().endOf('month')
            setCalendarRefresh(true)
            // const ev = await RNCalendarEvents.findEventById("2693")
            // const ev = await RNCalendarEvents.findCalendars()

            const calendarEvents: any = await requestEvents(startOfMonth, endOfMonth)
            const formattedEvents: any = {}

            formattedEvents[today.format('YYYY-MM-DD')] = []

            calendarEvents.forEach((event: any) => {
                const dateKey = moment(event.startDate).format('YYYY-MM-DD')
                if (!formattedEvents[dateKey]) {
                    formattedEvents[dateKey] = []
                }
                formattedEvents[dateKey].push({
                    name: event.title,
                    height: 50,
                })
            })

            setEvents(formattedEvents)

            // show data on current date base
            if (Object.keys(formattedEvents).length > 0) {
                const dateString = today.format('YYYY-MM-DD')
                setSelectedDate(dateString)

                const monthItems: any = {}
                Object.keys(formattedEvents).forEach((date) => {
                    const dd = moment(date).clone()
                    if (dd.isSame(dateString)) {
                        monthItems[date] = events[date]
                    }
                })
                setFilteredItems(monthItems)
            }

        } catch (error) {
            console.warn('Failed to load events', error)
        } finally {
            setCalendarRefresh(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.monthHeader}>{currentMonth}</Text>

            <Agenda
                selected={selectedDate}
                items={filteredItems}
                loadItemsForMonth={(month) => {
                    const monthString = moment(`${month.year} - ${month.month}`, 'YYYY-M').format('YYYY-MM')
                    const formatted = moment(monthString, 'YYYY-MM').format('MMM YYYY')
                    setCurrentMonth(formatted)
                }}

                onDayPress={(item: DateData) => { setSelectedDate(item.dateString) }}
                onDayChange={() => { console.log('day changed') }}

                renderItem={(item: AgendaEntry, isFirst: boolean) => {
                    if (!item || !item.name) return null
                    return (
                        <View style={styles.item}>
                            <Text style={styles.text}>{"item.name"}</Text>
                        </View>
                    )
                }}

                renderList={(listProps: ReservationListProps) => {
                    let items: AgendaSchedule | any = listProps.items
                    // console.log("===> list", items)
                    const isAllEmpty = !items || Object.values(items).every((arr: any) => arr?.length == 0);

                    if (isAllEmpty) {
                        return (
                            <View style={styles.item}>
                                <View style={styles.item2}>
                                    <Text style={styles.text}>{"No events for today"}</Text>
                                </View>
                            </View>
                        );
                    }

                    return (
                        <View style={styles.item}>
                            {Object.keys(items).map((date) => {
                                // console.log("items[date] ===>  ", items[date]?.length);
                                return (
                                    <View key={date}>
                                        {items[date]?.length == 0 ? (
                                            <View style={styles.item2}>
                                                <Text style={styles.text}>{"No events for today"}</Text>
                                            </View>
                                        ) : (
                                            items[date]?.map((item: AgendaSchedule | any, index: number) => (
                                                <View key={index} style={styles.item2}>
                                                    <Text style={styles.text}>{item.name}</Text>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                )
                            })}
                        </View>
                    )
                }}

                renderEmptyData={() => {
                    return (
                        <View style={styles.item}>
                            <Text style={styles.text}>{"Data is empty"}</Text>
                        </View>)
                }}
                rowHasChanged={(r1, r2) => r1.name !== r2.name}
                // hideKnob={true}
                showClosingKnob={true}
                disabledByDefault={true}
                refreshing={CalendarRefresh}
            />

            <View style={{ marginBottom: 20, marginHorizontal: 10, justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ backgroundColor: 'skyblue', borderRadius: 5, padding: 10, marginBottom: 10 }}
                    onPress={() => onNavigate('today')}
                >
                    <Text style={{}}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'skyblue', borderRadius: 5, padding: 10 }}
                    onPress={() => onNavigate('all')}
                >
                    <Text style={{}}>All events</Text>
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
