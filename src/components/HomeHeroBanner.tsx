import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

/**
 * HomeHeroBanner
 * MCP-ready hero banner for Home screen personalization
 *
 * Props are intentionally generic so they can be hydrated
 * by Marketing Cloud Personalization Mobile Data Campaigns
 */
interface HomeHeroBanner {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  onPressCta?: (url?: string) => void;
  campaignId?: string; // 👈 Optional campaignId for tracking
}

interface HomeHeroBannerProps {
  campaign?: HomeHeroBanner | null;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({ campaign }) => {
  if (!campaign?.headline && !campaign?.imageUrl) return null;

  const { headline, subheadline, ctaText, ctaUrl, imageUrl, onPressCta } =
    campaign;

  return (
    <View style={styles.container}>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.overlay}>
        {headline && <Text style={styles.headline}>{headline}</Text>}
        {subheadline && <Text style={styles.subheadline}>{subheadline}</Text>}

        {ctaText && (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => {
              if (onPressCta) {
                onPressCta(ctaUrl);
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>{ctaText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const BANNER_HEIGHT = Math.round(width * 0.55);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 16,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignContent: 'center',
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subheadline: {
    fontSize: 14,
    color: '#EDEDED',
    marginBottom: 14,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  ctaText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
});
