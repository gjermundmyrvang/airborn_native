import { Dimensions, Image, ScrollView, View } from "react-native";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { getRadarImages, removeTimeFromUrl } from "./radarservice";
import { RadarResponse } from "./types";
import {
  ActivityIndicator,
  Button,
  Divider,
  Menu,
  Text,
  useTheme,
} from "react-native-paper";
import { useEffect, useMemo, useState } from "react";
import { toDateTime } from "../../utils/dateTimeConverter";

export const RadarImages = () => {
  const [query, expanded, setExpanded] = useLazyQuery(["sigcharts"], () =>
    getRadarImages()
  );
  const parsedData = Array.isArray(query.data)
    ? query.data.map((entry) => ({
        ...entry,
        uri: removeTimeFromUrl(entry.uri),
      }))
    : [];
  return (
    <LazyCollapsible
      title="Radar"
      noDataMsg="No turbulence data for selected airport"
      icon="antenna"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        parsedData.length > 0 ? (
          <RadarSelector radarImages={parsedData} loading={query.isLoading} />
        ) : null
      }
    />
  );
};

type RadarSelectorProps = {
  radarImages: RadarResponse;
  loading?: boolean;
};

export const RadarSelector = ({ radarImages, loading }: RadarSelectorProps) => {
  const { colors } = useTheme();
  const width = Dimensions.get("screen").width - 20;
  const height = Dimensions.get("screen").height * 0.5;

  // Unique areas and types
  const areas = useMemo(
    () => Array.from(new Set(radarImages.map((r) => r.params.area))),
    [radarImages]
  );
  const [selectedArea, setSelectedArea] = useState(areas[0] || "");

  const types = useMemo(
    () =>
      Array.from(
        new Set(
          radarImages
            .filter((r) => r.params.area === selectedArea)
            .map((r) => r.params.type)
        )
      ),
    [radarImages, selectedArea]
  );
  const [selectedType, setSelectedType] = useState(types[0] || "");

  // Update selectedType when area changes
  useEffect(() => {
    if (!types.includes(selectedType)) {
      setSelectedType(types[0] || "");
    }
  }, [selectedArea, types]);

  // Filter images by area and type
  const filteredImages = radarImages.filter(
    (r) => r.params.area === selectedArea && r.params.type === selectedType
  );

  let content;
  if (loading) {
    content = <ActivityIndicator style={{ marginTop: 40 }} />;
  } else if (filteredImages.length === 0) {
    content = <Text>No radar images for this selection.</Text>;
  } else {
    content = (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ width, height }}
          source={{ uri: filteredImages[0].uri }}
          resizeMode="contain"
        />
        <Text variant="titleMedium">
          Updated: {toDateTime(filteredImages[0].params.time)} (LT)
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginBottom: 12,
        }}
      >
        {/* Area Selector */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 8, paddingLeft: 10 }}
        >
          {areas.map((area, idx) => (
            <Text
              key={`${area}-${idx}`}
              onPress={() => setSelectedArea(area)}
              style={{
                marginRight: 8,
                paddingVertical: 8,
                paddingHorizontal: 6,
                backgroundColor:
                  area === selectedArea ? colors.tertiary : colors.surface,
                borderRadius: 16,
                fontWeight: area === selectedArea ? "800" : "400",
              }}
            >
              {area}
            </Text>
          ))}
        </ScrollView>

        {/* Type Selector */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 8, paddingLeft: 10 }}
        >
          {types.map((type, idx) => (
            <Text
              key={`${type}-${idx}`}
              onPress={() => setSelectedType(type)}
              style={{
                marginRight: 8,
                paddingVertical: 8,
                paddingHorizontal: 6,
                backgroundColor:
                  type === selectedType ? colors.primary : colors.surface,
                borderRadius: 16,
                fontWeight: type === selectedType ? "800" : "400",
              }}
            >
              {type}
            </Text>
          ))}
        </ScrollView>
      </View>

      {content}
    </View>
  );
};
