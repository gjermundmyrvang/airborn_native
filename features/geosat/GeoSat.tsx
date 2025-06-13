import { Dimensions, Image, View } from "react-native";
import LazyCollapsible from "../../components/LazyCollapsible";
import { useLazyQuery } from "../../hooks/useLazyQuery";
import { getGeoSat } from "./geoservice";

export const GeoSat = () => {
  const [query, expanded, setExpanded] = useLazyQuery(["geosat"], () =>
    getGeoSat()
  );
  return (
    <LazyCollapsible
      title="Geosatellite"
      noDataMsg="Imagedata could not be fetched right now"
      icon="earth"
      loading={query.isLoading}
      error={query.error as Error | null}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      renderContent={() =>
        query.data ? <GeoSatImage uri={query.data} /> : null
      }
    />
  );
};

const GeoSatImage = ({ uri }: { uri: string }) => {
  const width = Dimensions.get("screen").width - 20;
  const height = Dimensions.get("screen").height * 0.3;
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={{ uri }}
        style={{ width, height, borderRadius: 12 }}
        alt="geosat"
      />
    </View>
  );
};
