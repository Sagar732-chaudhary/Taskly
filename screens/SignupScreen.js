import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');

  const onSignupPress = async () => {
    if (!name || !address || !gender) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        name: name,
        address: address,
        gender: gender,
      });
      navigation.replace('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.container}
    >
      <View style={styles.signupBox}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          onChangeText={(text) => setName(text)}
          value={name}
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          onChangeText={(text) => setAddress(text)}
          value={address}
        />

        <Text style={styles.label}>Gender:</Text>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={onSignupPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signupBox: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    fontSize: 14,
    color: '#6a11cb',
    textAlign: 'center',
  },
});

export default SignupScreen;
