import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, Animated, StyleSheet} from 'react-native';
import ModalSelector from 'react-native-modal-selector';

export default function HomeScreen({ navigation }) {
  // Variables for the search query and filters
  const [query, setQuery] = useState('');
  const [showArtist, setShowArtist] = useState(false);
  const [showClassification, setShowClassification] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const [artist, setArtist] = useState('');
  const [classification, setClassification] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shaking Animation Function
  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Called when User using "Search"
  const handleSearch = () => {
    if (query.trim() === '') {
      startShake();
    } else {
      // Navigate to Results screen passing filters as param
      navigation.navigate('Results', {
        query,
        artist: showArtist ? artist : null,
        classification: showClassification ? classification : null,
        dateFrom: showDateRange ? dateFrom : null,
        dateTo: showDateRange ? dateTo : null,
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Welcome to MuseumSearch!</Text>

      //Search Term Field with Animation
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <TextInput
          placeholder="Enter search term"
          value={query}
          onChangeText={setQuery}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
      </Animated.View>

      //optional Artist Filter
      {showArtist && (
        <TextInput
          placeholder="Artist"
          value={artist}
          onChangeText={setArtist}
          style={styles.input}
        />
      )}

       //optional Classification Filter
       {showClassification && (
             <View style={styles.pickerContainer}>
               <Text style={styles.pickerLabel}>Choose Classification:</Text>
               <ModalSelector
                 data={[
                   { key: 'Ceramic', label: 'Ceramic' },
                    { key: 'Costume', label: 'Costume' },
                    { key: 'Drawing', label: 'Drawing' },
                    { key: 'Furniture', label: 'Furniture' },
                    { key: 'Modern and Contemporary Art', label: 'Modern and Contemporary Art' },
                    { key: 'Oil on Canvas', label: 'Oil on Canvas' },
                    { key: 'Painting', label: 'Painting' },
                    { key: 'Photography', label: 'Photography' },
                    { key: 'Print', label: 'Print' },
                    { key: 'Sculpture', label: 'Sculpture' },
                    { key: 'Watercolor', label: 'Watercolor' },
                 ]}
                 initValue="Select a classification"
                 onChange={(option) => setClassification(option.label)}
               />
             </View>
           )}

      //optional Date-Range Filter
      {showDateRange && (
        <View>
          <TextInput
            placeholder="Year from (for example 1920)"
            value={dateFrom}
            onChangeText={setDateFrom}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Year to (for example 2020)"
            value={dateTo}
            onChangeText={setDateTo}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      )}

      //optional Filter Buttons
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        <Button title="Artist" onPress={() => setShowArtist(!showArtist)} />
        <Button title="Classification" onPress={() => setShowClassification(!showClassification)} />
        <Button title="Date" onPress={() => setShowDateRange(!showDateRange)} />
      </View>

      //Search Button
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 5,
  },
   pickerContainer: {
      marginBottom: 10,
    },
    pickerLabel: {
      fontSize: 16,
      marginBottom: 5,
    },
    picker: {
      borderWidth: 1,
      padding: 10,
      borderColor: '#ccc',
      borderRadius: 5,
    },
});
