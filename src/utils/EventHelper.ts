import { PermissionsAndroid, Platform } from "react-native"
import RNCalendarEvents from 'react-native-calendar-events'

export async function requestCalendarPermission() {
    try {
        let status = ""
        if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALENDAR)
            status = granted === PermissionsAndroid.RESULTS.GRANTED ? 'authorized' : 'denied'
        } else {
            status = await RNCalendarEvents.requestPermissions()
        }

        return status
    } catch (error) {
        console.warn('Permission error', error)
    }
}


export async function requestEvents(start: any, end: any) {
    try {
        // const ev = await RNCalendarEvents.findEventById("2693")
        // const ev = await RNCalendarEvents.findCalendars()
        const calendarEvents = await RNCalendarEvents.fetchAllEvents(start.toISOString(), end.toISOString())
        return calendarEvents
    } catch (error) {
        console.warn('Failed to load events', error)
    }
}