import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface LoadingCardProps {
  title: string;
  message: string;
  isLoading?: boolean;
  onRetry?: () => void;
  retryText?: string;
}

export default function LoadingCard({ 
  title, 
  message, 
  isLoading = true, 
  onRetry, 
  retryText = 'पुन्हा प्रयत्न करा' 
}: LoadingCardProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {isLoading ? (
        <>
          <ActivityIndicator 
            size="large" 
            color={Colors[colorScheme ?? 'light'].tint} 
            style={styles.loader}
          />
          <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>
        </>
      ) : (
        <>
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          <ThemedText type="subtitle" style={styles.title}>त्रुटी</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>
          {onRetry && (
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={onRetry}
            >
              <ThemedText style={styles.retryButtonText}>{retryText}</ThemedText>
            </TouchableOpacity>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 200,
  },
  loader: {
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});