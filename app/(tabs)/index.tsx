import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🏫 Dream School मध्ये आपले स्वागत!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📅 कॅलेंडर व्यवस्थापन</ThemedText>
        <ThemedText>
          शैक्षणिक कॅलेंडर, विद्यार्थी आणि शिक्षकांचे वाढदिवस, सुट्टी व्यवस्थापन आणि दैनंदिन 
          नोंदी यासाठी{' '}<ThemedText type="defaultSemiBold">कॅलेंडर</ThemedText> टॅब वापरा.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📊 गुण व्यवस्थापन</ThemedText>
        <ThemedText>
          कक्षा १-८ च्या विद्यार्थ्यांच्या गुणांची प्रविष्टी, PDF रिपोर्ट कार्ड तयार करणे 
          आणि CCE pattern नुसार assessment साठी{' '}<ThemedText type="defaultSemiBold">गुण</ThemedText> टॅब वापरा.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🚀 वैशिष्ट्ये</ThemedText>
        <ThemedText>
          ✅ Firebase realtime database integration{'\n'}
          ✅ मराठी भाषा समर्थन{'\n'}
          ✅ Performance analysis आणि ranking{'\n'}
          ✅ PDF रिपोर्ट generation{'\n'}
          ✅ शैक्षणिक कॅलेंडर व्यू
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
