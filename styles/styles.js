import { StyleSheet } from 'react-native';

const colors = {
  primary: '#1B95E0',
  secondary: '#999',
  background: '#fff',
  border: '#eee',
  text: '#000',
  error: '#FF5A5F',
};

export default StyleSheet.create({
  // General Container
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  // Headers and Titles
  headertitle: {
    fontSize: 30,
    textAlign: 'left',
    marginVertical: 20,
    color: colors.text,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    color: colors.text,
  },
  // Input Styles
  input: {
    height: 50,
    borderColor: colors.secondary,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  // Link/Touchable Text
  link: {
    color: colors.primary,
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
  },
  // Button Styles
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Error Message
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginVertical: 5,
    textAlign: 'center',
  },
  // Todo List Styles
  todoContainer: {
    padding: 15,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    backgroundColor: colors.background,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginVertical: 5,
  },
  todoText: {
    fontSize: 18,
    color: colors.text,
  },
  // Loading Indicator
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Centered Content
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
