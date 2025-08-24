import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';

// Display search results
export default function ResultsScreen({ route, navigation }) {
  // Search parameters from route
  const { query, classification, dateFrom, dateTo } = route.params || {};

  // Search results and loading indicator
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to build the string for the API
  const buildQuery = () => {
    let searchParams = [`q=${encodeURIComponent(query)}`];

    // Add date-Range Filter if present
    if (dateFrom && dateTo) {
      searchParams.push(`date_start=${dateFrom}&date_end=${dateTo}`);
    }

    return searchParams.join('&');
  };

  // Fetch results from the API
  const fetchResults = async () => {
    setLoading(true);
    try {
      //Build API query
      const queryString = buildQuery() + '&limit=100&fields=id,title,artist_display,image_id,date_start,classification_title,description,dimensions';
      const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?${queryString}`);
      const json = await response.json();

      let filteredResults = json.data;

      // Apply extra filtering in case API returns more results
      if (dateFrom) {
        filteredResults = filteredResults.filter((item) => {
          const year = item.date_start;
          return year >= parseInt(dateFrom);
        });
      }

      if (dateTo) {
        filteredResults = filteredResults.filter((item) => {
          const year = item.date_start;
          return year <= parseInt(dateTo);
        });
      }

      if (classification) {
        filteredResults = filteredResults.filter((item) =>
          item.classification_title?.toLowerCase() === classification.toLowerCase()
        );
      }

      setResults(filteredResults);
    } catch (error) {
      console.error('Error: Call Data:', error);
    }
    setLoading(false);
  };

  // Re-Fetch results if filter changes
  useEffect(() => {
    fetchResults();
  }, [query, classification, dateFrom, dateTo]);

  // Render item in the result list
  const renderItem = ({ item }) => {
    const imageUrl = item.image_id
      ? `https://www.artic.edu/iiif/2/${item.image_id}/full/200,/0/default.jpg`
      : null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { artworkId: item.id })}
        style={{ marginBottom: 20 }}
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: 200, marginBottom: 10 }}
            resizeMode="cover"
          />
        )}
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
        <Text style={{ color: '#555' }}>{item.artist_display}</Text>

      </TouchableOpacity>
    );
  };

  //UI rendering
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Search Results</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : results.length === 0 ? (
        <Text>No Results Found.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
