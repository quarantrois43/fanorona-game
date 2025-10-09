import React, { ReactNode } from 'react';
import { Modal as RNModal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

interface ModalProps {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: Array<{ title: string; onPress: () => void; variant?: 'primary' | 'secondary' }>;
}

export const Modal: React.FC<ModalProps> = ({ visible, title, children, onClose, actions }) => {
  const { theme } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, theme.typography.h2, { color: theme.colors.text }]}>
            {title}
          </Text>
          
          <View style={styles.content}>{children}</View>
          
          {actions && (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  title={action.title}
                  onPress={action.onPress}
                  variant={action.variant || 'primary'}
                  style={styles.actionButton}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});