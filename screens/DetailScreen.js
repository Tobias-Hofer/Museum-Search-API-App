import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

// Displaying details from an artwork
export default function DetailScreen({ route }) {
  const { artworkId } = route.params;
  const [artworkDetails, setArtworkDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Remove all HTML Tags
  const removePtags = (text) => {
    return text.replace(/<[^>]*>/g, '');
    };

  // Function to fetch details for selected artwork from API
  const fetchArtworkDetails = async () => {
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks/${artworkId}`);
      const json = await response.json();
      setArtworkDetails(json.data);
    } catch (error) {
      console.error('Error: Cannot retrieve Artwork Details:', error);
    }
    setLoading(false);
  };

  // Trigger data fetch when the component or artworkid change
  useEffect(() => {
    fetchArtworkDetails();
  }, [artworkId]);

  // Display loading circle while fetching
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Handle case when no data available
  if (!artworkDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No Details found.</Text>
      </View>
    );
  }

  // Extract relevant fields from fetched artwork data
  const { title, artist_display, image_id, date_start, description, medium_display, dimensions } = artworkDetails;

  // Build image URL with image_id
  const imageUrl = image_id
    ? `https://www.artic.edu/iiif/2/${image_id}/full/800,/0/default.jpg`
    : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title ? `${title}` : 'No Title available'}</Text>
        <Text style={styles.artist}>{artist_display ? `Artist: ${artist_display}` : 'No Artist available'}</Text>
      </View>

      {/* Display Image with zoom component */}
      {imageUrl && (
        <ScrollView
          maximumZoomScale={5}
          minimumZoomScale={1}
          contentContainerStyle={{ alignItems: 'center' }}
          style={{ marginBottom: 20 }}
        >
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </ScrollView>
      )}

      {/* Display additional information about artwork */}
      <View style={styles.infoContainer}>
        <Text style={styles.date}>{date_start ? `Year: ${date_start}` : 'No date available'}</Text>
        <Text style={styles.description}>{description ? `Description: ${removePtags(description)}` : 'No description available'}</Text>
        <Text style={styles.medium}>{medium_display ? `Medium: ${medium_display}` : 'No medium information available'}</Text>
        <Text style={styles.dimensions}>{dimensions ? `Dimensions: ${dimensions}` : 'No dimensions available'}</Text>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  header: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  artist: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  infoContainer: {
    marginTop: 20,
  },
  date: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  medium: {
    fontSize: 16,
    marginBottom: 5,
  },
  dimensions: {
    fontSize: 16,
  },
});
