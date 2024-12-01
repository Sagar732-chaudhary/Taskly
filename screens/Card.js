import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ title, imageUri }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: imageUri }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 120,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  cardImage: {
    width: 100, // Fixed width to avoid scaling issues
    height: 100, // Fixed height for consistency
    borderRadius: 8,
    resizeMode: 'cover', // Ensures the image fills the container proportionally
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
});

export default Card;
