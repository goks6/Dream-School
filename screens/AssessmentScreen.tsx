import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  Student, 
  Assessment, 
  subjects, 
  classes, 
  assessmentTypes, 
  calculateGrade, 
  calculatePercentage,
  validateMarks,
  generateId 
} from '@/utils/common';
import { firebaseOps } from '@/utils/firebase';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function AssessmentScreen() {
  const colorScheme = useColorScheme();
  const [selectedClass, setSelectedClass] = useState('१');
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showMarksEntry, setShowMarksEntry] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [marksData, setMarksData] = useState({
    subject: 'marathi',
    assessmentType: 'fa1',
    marks: '',
    totalMarks: '25',
  });

  useEffect(() => {
    loadStudents();
    loadAssessments();
  }, [selectedClass]);

  const loadStudents = () => {
    // Mock student data - will be replaced with Firebase calls
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'राहुल शर्मा',
        class: '१',
        rollNo: 1,
        birthDate: '2018-01-15',
        parentName: 'संजय शर्मा',
        contact: '9876543210'
      },
      {
        id: '2',
        name: 'प्रिया पाटील',
        class: '१',
        rollNo: 2,
        birthDate: '2018-03-22',
        parentName: 'राज पाटील',
        contact: '9876543211'
      },
      {
        id: '3',
        name: 'अर्जुन देशमुख',
        class: '१',
        rollNo: 3,
        birthDate: '2018-05-10',
        parentName: 'विकास देशमुख',
        contact: '9876543212'
      }
    ];
    setStudents(mockStudents.filter(s => s.class === selectedClass));
  };

  const loadAssessments = () => {
    // Mock assessment data
    const mockAssessments: Assessment[] = [
      {
        id: 'a1',
        studentId: '1',
        subject: 'marathi',
        assessmentType: 'fa1',
        marks: 20,
        totalMarks: 25,
        date: '2024-01-15',
        class: '१'
      },
      {
        id: 'a2',
        studentId: '1',
        subject: 'english',
        assessmentType: 'fa1',
        marks: 18,
        totalMarks: 25,
        date: '2024-01-16',
        class: '१'
      }
    ];
    setAssessments(mockAssessments.filter(a => a.class === selectedClass));
  };

  const openMarksEntry = (student: Student) => {
    setSelectedStudent(student);
    setShowMarksEntry(true);
  };

  const saveMarks = () => {
    if (!selectedStudent) return;

    const marks = parseInt(marksData.marks);
    const totalMarks = parseInt(marksData.totalMarks);

    if (!validateMarks(marks, totalMarks)) {
      Alert.alert('चूक', 'कृपया योग्य गुण प्रविष्ट करा');
      return;
    }

    const newAssessment: Assessment = {
      id: generateId(),
      studentId: selectedStudent.id,
      subject: marksData.subject,
      assessmentType: marksData.assessmentType,
      marks,
      totalMarks,
      date: new Date().toISOString().split('T')[0],
      class: selectedClass,
    };

    // Add to local state (will be Firebase in production)
    setAssessments(prev => [...prev, newAssessment]);
    
    // Reset form
    setMarksData({ ...marksData, marks: '' });
    setShowMarksEntry(false);
    setSelectedStudent(null);
    
    Alert.alert('यशस्वी', 'गुण यशस्वीपणे जतन झाले');
  };

  const getStudentAssessments = (studentId: string) => {
    return assessments.filter(a => a.studentId === studentId);
  };

  const calculateStudentAverage = (studentId: string) => {
    const studentAssessments = getStudentAssessments(studentId);
    if (studentAssessments.length === 0) return 0;
    
    const total = studentAssessments.reduce((sum, assessment) => {
      return sum + calculatePercentage(assessment.marks, assessment.totalMarks);
    }, 0);
    
    return total / studentAssessments.length;
  };

  const generateReportCard = async (student: Student) => {
    const studentAssessments = getStudentAssessments(student.id);
    const average = calculateStudentAverage(student.id);
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .school-name { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .report-title { font-size: 18px; margin: 10px 0; }
            .student-info { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
            .marks-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .marks-table th, .marks-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .marks-table th { background-color: #f2f2f2; }
            .grade { font-weight: bold; color: #27ae60; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">🏫 Dream School</div>
            <div class="report-title">📋 विद्यार्थी रिपोर्ट कार्ड</div>
          </div>
          
          <div class="student-info">
            <p><strong>विद्यार्थ्याचे नाव:</strong> ${student.name}</p>
            <p><strong>वर्ग:</strong> ${student.class}</p>
            <p><strong>गुंडाळी क्रमांक:</strong> ${student.rollNo}</p>
            <p><strong>पालकांचे नाव:</strong> ${student.parentName}</p>
          </div>
          
          <table class="marks-table">
            <thead>
              <tr>
                <th>विषय</th>
                <th>मूल्यांकन प्रकार</th>
                <th>गुण</th>
                <th>एकूण गुण</th>
                <th>टक्केवारी</th>
                <th>श्रेणी</th>
              </tr>
            </thead>
            <tbody>
              ${studentAssessments.map(assessment => `
                <tr>
                  <td>${subjects[assessment.subject as keyof typeof subjects]}</td>
                  <td>${assessmentTypes[assessment.assessmentType as keyof typeof assessmentTypes]}</td>
                  <td>${assessment.marks}</td>
                  <td>${assessment.totalMarks}</td>
                  <td>${calculatePercentage(assessment.marks, assessment.totalMarks).toFixed(1)}%</td>
                  <td class="grade">${calculateGrade(assessment.marks, assessment.totalMarks)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p><strong>एकूण सरासरी:</strong> <span class="grade">${average.toFixed(1)}%</span></p>
            <p><strong>एकूण श्रेणी:</strong> <span class="grade">${calculateGrade(average, 100)}</span></p>
          </div>
          
          <div class="footer">
            <p>📅 रिपोर्ट तयार केली: ${new Date().toLocaleDateString('mr-IN')}</p>
            <p>🏫 Dream School Management System</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `${student.name} चा रिपोर्ट कार्ड`,
        });
      } else {
        Alert.alert('यशस्वी', 'रिपोर्ट कार्ड तयार झाला');
      }
    } catch (error) {
      Alert.alert('त्रुटी', 'रिपोर्ट कार्ड तयार करताना त्रुटी झाली');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>📊 गुण व्यवस्थापन</ThemedText>
      </ThemedView>

      {/* Class Selector */}
      <ThemedView style={styles.classSelector}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>वर्ग निवडा:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classContainer}>
          {classes.map(cls => (
            <TouchableOpacity
              key={cls}
              style={[
                styles.classButton,
                selectedClass === cls && styles.selectedClassButton
              ]}
              onPress={() => setSelectedClass(cls)}
            >
              <ThemedText 
                style={[
                  styles.classButtonText,
                  selectedClass === cls && styles.selectedClassButtonText
                ]}
              >
                वर्ग {cls}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Students List */}
      <ThemedView style={styles.studentsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          वर्ग {selectedClass} चे विद्यार्थी
        </ThemedText>
        
        {students.map(student => {
          const average = calculateStudentAverage(student.id);
          const assessmentCount = getStudentAssessments(student.id).length;
          
          return (
            <ThemedView key={student.id} style={styles.studentCard}>
              <ThemedView style={styles.studentInfo}>
                <ThemedText type="defaultSemiBold" style={styles.studentName}>
                  {student.name}
                </ThemedText>
                <ThemedText style={styles.studentDetails}>
                  गुंडाळी क्रमांक: {student.rollNo} | मूल्यांकन: {assessmentCount}
                </ThemedText>
                {assessmentCount > 0 && (
                  <ThemedText style={styles.studentAverage}>
                    सरासरी: {average.toFixed(1)}% ({calculateGrade(average, 100)})
                  </ThemedText>
                )}
              </ThemedView>
              
              <ThemedView style={styles.studentActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => openMarksEntry(student)}
                >
                  <ThemedText style={styles.actionButtonText}>गुण टाका</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.reportButton]}
                  onPress={() => generateReportCard(student)}
                >
                  <ThemedText style={styles.actionButtonText}>रिपोर्ट</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>

      {/* Marks Entry Modal */}
      <Modal
        visible={showMarksEntry}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMarksEntry(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              गुण प्रविष्टी - {selectedStudent?.name}
            </ThemedText>
            
            <ThemedView style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>विषय:</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.entries(subjects).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.optionButton,
                      marksData.subject === key && styles.selectedOption
                    ]}
                    onPress={() => setMarksData({ ...marksData, subject: key })}
                  >
                    <ThemedText style={styles.optionText}>{value}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>

            <ThemedView style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>मूल्यांकन प्रकार:</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.entries(assessmentTypes).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.optionButton,
                      marksData.assessmentType === key && styles.selectedOption
                    ]}
                    onPress={() => setMarksData({ ...marksData, assessmentType: key })}
                  >
                    <ThemedText style={styles.optionText}>{value}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>

            <ThemedView style={styles.marksInputContainer}>
              <ThemedView style={styles.marksField}>
                <ThemedText style={styles.fieldLabel}>गुण:</ThemedText>
                <TextInput
                  style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].text }]}
                  value={marksData.marks}
                  onChangeText={(text) => setMarksData({ ...marksData, marks: text })}
                  keyboardType="numeric"
                  placeholder="गुण टाका"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                />
              </ThemedView>
              
              <ThemedView style={styles.marksField}>
                <ThemedText style={styles.fieldLabel}>एकूण गुण:</ThemedText>
                <TextInput
                  style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].text }]}
                  value={marksData.totalMarks}
                  onChangeText={(text) => setMarksData({ ...marksData, totalMarks: text })}
                  keyboardType="numeric"
                  placeholder="एकूण गुण"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowMarksEntry(false)}
              >
                <ThemedText style={styles.cancelButtonText}>रद्द करा</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveMarks}
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  classSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  classContainer: {
    flexDirection: 'row',
  },
  classButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedClassButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  classButtonText: {
    fontSize: 14,
  },
  selectedClassButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  studentsSection: {
    marginBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  studentAverage: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  studentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  reportButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 12,
  },
  marksInputContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  marksField: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
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