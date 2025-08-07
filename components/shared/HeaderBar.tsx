import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  rightButton?: {
    text: string;
    onPress: () => void;
    color?: string;
  };
  leftButton?: {
    text: string;
    onPress: () => void;
    color?: string;
  };
}

export default function HeaderBar({ 
  title, 
  subtitle, 
  rightButton, 
  leftButton 
}: HeaderBarProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.leftSection}>
        {leftButton && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: leftButton.color || Colors[colorScheme ?? 'light'].tint }]}
            onPress={leftButton.onPress}
          >
            <ThemedText style={styles.buttonText}>{leftButton.text}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.centerSection}>
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.rightSection}>
        {rightButton && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: rightButton.color || Colors[colorScheme ?? 'light'].tint }]}
            onPress={rightButton.onPress}
          >
            <ThemedText style={styles.buttonText}>{rightButton.text}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});