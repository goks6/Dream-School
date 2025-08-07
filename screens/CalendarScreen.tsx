import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CalendarEvent, formatDateForCalendar } from '@/utils/common';
import { firebaseOps } from '@/utils/firebase';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    // Load calendar events from Firebase
    loadCalendarEvents();
    loadBirthdays();
    loadHolidays();
  }, []);

  const loadCalendarEvents = () => {
    // Mock data for now - will be replaced with Firebase calls
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'शालेय दिन',
        date: '2024-01-15',
        type: 'event',
        description: 'वार्षिक शालेय दिन कार्यक्रम'
      },
      {
        id: '2',
        title: 'अर्धवार्षिक परीक्षा',
        date: '2024-01-20',
        type: 'exam',
        description: 'अर्धवार्षिक परीक्षा सुरू'
      }
    ];
    setEvents(mockEvents);
    markEventDates(mockEvents);
  };

  const loadBirthdays = () => {
    // Mock birthday data
    const mockBirthdays: CalendarEvent[] = [
      {
        id: 'b1',
        title: 'राहुल शर्मा वाढदिवस',
        date: '2024-01-18',
        type: 'birthday',
        description: 'विद्यार्थी वाढदिवस'
      }
    ];
    markEventDates(mockBirthdays);
  };

  const loadHolidays = () => {
    // Mock holiday data
    const mockHolidays: CalendarEvent[] = [
      {
        id: 'h1',
        title: 'गणतंत्र दिन',
        date: '2024-01-26',
        type: 'holiday',
        description: 'राष्ट्रीय सुट्टी'
      }
    ];
    markEventDates(mockHolidays);
  };

  const markEventDates = (eventList: CalendarEvent[]) => {
    const marked: any = {};
    eventList.forEach(event => {
      marked[event.date] = {
        marked: true,
        dotColor: getEventColor(event.type),
        selectedColor: getEventColor(event.type),
      };
    });
    setMarkedDates(prev => ({ ...prev, ...marked }));
  };

  const getEventColor = (type: CalendarEvent['type']): string => {
    switch (type) {
      case 'birthday': return '#ff6b6b';
      case 'holiday': return '#4ecdc4';
      case 'event': return '#45b7d1';
      case 'exam': return '#ffa726';
      default: return '#95a5a6';
    }
  };

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const dayEvents = events.filter(event => event.date === day.dateString);
    if (dayEvents.length > 0) {
      const eventTitles = dayEvents.map(e => e.title).join('\n');
      Alert.alert('या दिवसाचे कार्यक्रम', eventTitles);
    }
  };

  const addNewEvent = () => {
    Alert.alert('नवीन कार्यक्रम', 'नवीन कार्यक्रम जोडण्याची सुविधा लवकरच उपलब्ध होईल');
  };

  const getTodayEvents = () => {
    const today = formatDateForCalendar(new Date());
    return events.filter(event => event.date === today);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>📅 शैक्षणिक कॅलेंडर</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={addNewEvent}>
          <ThemedText style={styles.addButtonText}>+ नवीन</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: Colors[colorScheme ?? 'light'].tint,
            }
          }}
          theme={{
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            calendarBackground: Colors[colorScheme ?? 'light'].background,
            textSectionTitleColor: Colors[colorScheme ?? 'light'].text,
            dayTextColor: Colors[colorScheme ?? 'light'].text,
            todayTextColor: Colors[colorScheme ?? 'light'].tint,
            selectedDayTextColor: '#ffffff',
            monthTextColor: Colors[colorScheme ?? 'light'].text,
            arrowColor: Colors[colorScheme ?? 'light'].tint,
            textDisabledColor: Colors[colorScheme ?? 'light'].icon,
          }}
        />
      </ThemedView>

      <ThemedView style={styles.eventsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>आजचे कार्यक्रम</ThemedText>
        {getTodayEvents().length > 0 ? (
          getTodayEvents().map(event => (
            <ThemedView key={event.id} style={styles.eventCard}>
              <ThemedView style={[styles.eventDot, { backgroundColor: getEventColor(event.type) }]} />
              <ThemedView style={styles.eventInfo}>
                <ThemedText type="defaultSemiBold">{event.title}</ThemedText>
                {event.description && (
                  <ThemedText style={styles.eventDescription}>{event.description}</ThemedText>
                )}
              </ThemedView>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.noEvents}>आज कोणतेही कार्यक्रम नाहीत</ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.legendSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>रंग अर्थ</ThemedText>
        <ThemedView style={styles.legendContainer}>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
            <ThemedText>🎂 वाढदिवस</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#4ecdc4' }]} />
            <ThemedText>🏖️ सुट्टी</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#45b7d1' }]} />
            <ThemedText>📝 कार्यक्रम</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendDot, { backgroundColor: '#ffa726' }]} />
            <ThemedText>📊 परीक्षा</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  calendarContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  noEvents: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
    padding: 20,
  },
  legendSection: {
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});