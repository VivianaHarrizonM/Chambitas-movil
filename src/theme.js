import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#F4A300',
  primaryDark: '#D88900',
  blue: '#022e86',
  blueLight: '#2F80ED',
  background: '#F5F5F5',
  inputBg: '#fabb8031',
  textMain: '#4F4F4F',
  textSecondary: '#8A8A8A',
  border: '#f1710731',
  white: '#FFFFFF',
  error: '#FF6B6B',
};

export const common = StyleSheet.create({
  // Layouts
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  screenCentered: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    alignItems: 'center',
  },
  screenAuth: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  // Typography
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  label: {
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginTop: 12,
  },
  errorText: {
    color: COLORS.error,
    padding: 16,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  hintText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  link: {
    color: COLORS.blueLight,
    textAlign: 'center',
    marginTop: 16,
  },

  // Inputs
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonPrimaryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonSecondary: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: COLORS.blueLight,
    marginTop: 8,
  },
  buttonSecondaryText: {
    color: COLORS.blueLight,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginTop: 16,
  },
  buttonOutlineText: {
    color: COLORS.blue,
    fontWeight: '600',
  },

  // Chips
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Cards
  card: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
  },

  // Avatar
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  avatarText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '700',
  },

  // Profile rows
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    color: COLORS.textSecondary,
  },
  rowValue: {
    color: COLORS.textMain,
  },

  // Legal screens
  legalTitle: {
    color: COLORS.textMain,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  legalSubtitle: {
    color: COLORS.textMain,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  legalText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
});