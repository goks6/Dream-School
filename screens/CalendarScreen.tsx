import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import HeaderBar from '@/components/shared/HeaderBar';
import EmptyState from '@/components/shared/EmptyState';
import LoadingCard from '@/components/shared/LoadingCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CalendarEvent, formatDateForCalendar, generateId } from '@/utils/common';
import { firebaseOps } from '@/utils/firebase';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'event' as CalendarEvent['type']
  });

  useEffect(() => {
    // Simulate loading time for better UX
    setTimeout(() => {
      loadCalendarEvents();
      loadBirthdays();
      loadHolidays();
      setIsLoading(false);
    }, 1500);
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
      },
      {
        id: '3',
        title: 'विज्ञान प्रदर्शनी',
        date: '2024-02-05',
        type: 'event',
        description: 'विद्यार्थ्यांची विज्ञान प्रदर्शनी'
      }
    ];
    setEvents(prev => [...prev, ...mockEvents]);
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
      },
      {
        id: 'b2',
        title: 'शिक्षिका सुनीता मॅडम वाढदिवस',
        date: '2024-02-10',
        type: 'birthday',
        description: 'शिक्षिका वाढदिवस'
      }
    ];
    setEvents(prev => [...prev, ...mockBirthdays]);
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
      },
      {
        id: 'h2',
        title: 'महाशिवरात्री',
        date: '2024-03-08',
        type: 'holiday',
        description: 'धार्मिक सुट्टी'
      }
    ];
    setEvents(prev => [...prev, ...mockHolidays]);
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
    if (!selectedDate) {
      Alert.alert('तारीख निवडा', 'कृपया कॅलेंडरमधून तारीख निवडा');
      return;
    }
    setShowEventModal(true);
  };

  const saveNewEvent = () => {
    if (!newEvent.title.trim()) {
      Alert.alert('शीर्षक आवश्यक', 'कृपया कार्यक्रमाचे शीर्षक प्रविष्ट करा');
      return;
    }

    const event: CalendarEvent = {
      id: generateId(),
      title: newEvent.title,
      date: selectedDate,
      type: newEvent.type,
      description: newEvent.description
    };

    setEvents(prev => [...prev, event]);
    markEventDates([event]);
    
    // Reset form
    setNewEvent({ title: '', description: '', type: 'event' });
    setShowEventModal(false);
    
    Alert.alert('यशस्वी', 'नवीन कार्यक्रम जोडला गेला');
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (isLoading) {
    return (
      <LoadingCard 
        title="कॅलेंडर लोड होत आहे..."
        message="कृपया थोडा वेळ प्रतीक्षा करा"
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <HeaderBar 
        title="📅 शैक्षणिक कॅलेंडर"
        subtitle={selectedDate ? `निवडलेली तारीख: ${selectedDate}` : 'तारीख निवडा'}
        rightButton={{
          text: '+ नवीन',
          onPress: addNewEvent,
          color: '#4CAF50'
        }}
      />

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
        <ThemedText type="subtitle" style={styles.sectionTitle}>आगामी कार्यक्रम (७ दिवस)</ThemedText>
        {getUpcomingEvents().length > 0 ? (
          getUpcomingEvents().map(event => (
            <ThemedView key={event.id} style={styles.eventCard}>
              <ThemedView style={[styles.eventDot, { backgroundColor: getEventColor(event.type) }]} />
              <ThemedView style={styles.eventInfo}>
                <ThemedText type="defaultSemiBold">{event.title}</ThemedText>
                <ThemedText style={styles.eventDate}>{event.date}</ThemedText>
                {event.description && (
                  <ThemedText style={styles.eventDescription}>{event.description}</ThemedText>
                )}
              </ThemedView>
            </ThemedView>
          ))
        ) : (
          <EmptyState 
            icon="📅"
            title="कोणतेही आगामी कार्यक्रम नाहीत"
            message="पुढील ७ दिवसांमध्ये कोणतेही कार्यक्रम नियोजित नाहीत"
            actionText="नवीन कार्यक्रम जोडा"
            onAction={() => {
              if (!selectedDate) {
                Alert.alert('तारीख निवडा', 'कृपया कॅलेंडरमधून तारीख निवडा');
              } else {
                addNewEvent();
              }
            }}
          />
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

      {/* Add Event Modal */}
      <Modal
        visible={showEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEventModal(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              नवीन कार्यक्रम जोडा - {selectedDate}
            </ThemedText>
            
            <ThemedView style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>शीर्षक:</ThemedText>
              <TextInput
                style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].text }]}
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                placeholder="कार्यक्रमाचे शीर्षक"
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              />
            </ThemedView>

            <ThemedView style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>तपशील:</ThemedText>
              <TextInput
                style={[styles.textInput, styles.textArea, { color: Colors[colorScheme ?? 'light'].text }]}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                placeholder="कार्यक्रमाचे तपशील"
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                multiline
                numberOfLines={3}
              />
            </ThemedView>

            <ThemedView style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>प्रकार:</ThemedText>
              <ThemedView style={styles.typeSelector}>
                {[
                  { key: 'event', label: '📝 कार्यक्रम', color: '#45b7d1' },
                  { key: 'exam', label: '📊 परीक्षा', color: '#ffa726' },
                  { key: 'holiday', label: '🏖️ सुट्टी', color: '#4ecdc4' },
                  { key: 'birthday', label: '🎂 वाढदिवस', color: '#ff6b6b' }
                ].map(type => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeButton,
                      { backgroundColor: type.color },
                      newEvent.type === type.key && styles.selectedType
                    ]}
                    onPress={() => setNewEvent({ ...newEvent, type: type.key as CalendarEvent['type'] })}
                  >
                    <ThemedText style={styles.typeButtonText}>{type.label}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEventModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>रद्द करा</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveNewEvent}
              >
                <ThemedText style={styles.saveButtonText}>जतन करा</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  eventDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  eventDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    opacity: 0.7,
  },
  selectedType: {
    opacity: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  typeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});