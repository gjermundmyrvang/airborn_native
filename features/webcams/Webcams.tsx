import React from "react";
import { ScrollView } from "react-native";
import { Card, useTheme } from "react-native-paper";
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
  return (
    <ScrollView horizontal={true} style={{ paddingLeft: 10 }}>
      {webcams.map((d, i) => (
        <WebcamCard key={d.title + i} webcam={d} />
      ))}
    </ScrollView>
  );
};

type WebcamItemProps = {
  webcam: WebcamType;
};

const WebcamCard = ({ webcam }: WebcamItemProps) => {
  const { colors } = useTheme();
  const [mainTitle, subTitle] = webcam.title.includes("-")
    ? webcam.title.split(/-(.+)/).map((s) => s.trim())
    : [webcam.title, "morn"];
  return (
    <Card
      elevation={2}
      style={{
        backgroundColor: colors.surface,
        width: 300,
        marginRight: 6,
      }}
    >
      <Card.Cover
        source={{ uri: webcam.images.current.preview }}
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      />
      <Card.Title
        title={mainTitle}
        subtitle={toDateTime(webcam.lastUpdatedOn)}
        titleStyle={{ color: colors.primary }}
        subtitleStyle={{ color: colors.secondary }}
      />
    </Card>
  );
};
