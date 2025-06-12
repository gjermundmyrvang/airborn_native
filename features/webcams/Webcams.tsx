import React, { useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { LatLon } from "../../types/CommonTypes";
import { toDateTime } from "../../utils/dateTimeConverter";
import { WebcamType } from "./types";
import { getWebcamData } from "./webcamservice";

type WebcamProps = {
  pos: LatLon;
};

export default function Webcams({ pos }: WebcamProps) {
  const [query, expanded, setExpanded] = useLazyQuery(["webcams", pos], () =>
    getWebcamData(pos)
  );
  return (
    <LazyCollapsible
      title="Webcams"
      noDataMsg="No nearby webcams"
      icon="webcam"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        query.data ? <WebcamComponent webcams={query.data.webcams} /> : null
      }
    />
  );
}

type WebcamComponentProps = {
  webcams: WebcamType[];
};

const WebcamComponent = ({ webcams }: WebcamComponentProps) => {
  const [selectedCam, setSelectedCam] = useState(0);
  const webcam = webcams[selectedCam];

  const width = Dimensions.get("screen").width - 50;
  const height = Dimensions.get("screen").height * 0.3;

  const [mainTitle, subTitle] = webcam.title.includes("-")
    ? webcam.title.split(/-(.+)/).map((s) => s.trim())
    : [webcam.title, ""];

  return (
    <View
      style={{ padding: 8, justifyContent: "center", alignItems: "center" }}
    >
      <Text variant="titleMedium">{mainTitle}</Text>
      {subTitle ? (
        <Text variant="bodySmall" style={{ opacity: 0.7 }}>
          {subTitle}
        </Text>
      ) : null}
      <Image
        source={{ uri: webcam.images.current.preview }}
        style={{ width, height }}
        resizeMode="contain"
      />
      <Text variant="titleSmall">{toDateTime(webcam.lastUpdatedOn)}</Text>
      <View
        style={{
          width: "100%",
          alignSelf: "flex-start",
        }}
      >
        {webcams.map((d, i) => (
          <WebcamItem
            key={d.title + i}
            webcam={d}
            selected={i === selectedCam}
            setSelected={() => setSelectedCam(i)}
          />
        ))}
      </View>
    </View>
  );
};

type WebcamItemProps = {
  webcam: WebcamType;
  selected: boolean;
  setSelected: () => void;
};

const WebcamItem = ({ webcam, selected, setSelected }: WebcamItemProps) => {
  const { colors } = useTheme();
  const [mainTitle, subTitle] = webcam.title.includes("-")
    ? webcam.title.split(/-(.+)/).map((s) => s.trim())
    : [webcam.title, ""];
  return (
    <List.Item
      title={subTitle || mainTitle}
      description={toDateTime(webcam.lastUpdatedOn)}
      descriptionStyle={{ color: colors.secondary }}
      onPress={setSelected}
      left={(props) => (
        <List.Icon
          {...props}
          icon="camera"
          color={selected ? colors.primary : colors.secondary}
        />
      )}
    />
  );
};
