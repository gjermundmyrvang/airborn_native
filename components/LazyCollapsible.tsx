import React, { useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { List, Text, useTheme } from "react-native-paper";

type LazyCollapsibleProps<T> = {
  title: string;
  fetchData: () => Promise<T>;
  renderContent: (data: T) => React.ReactNode;
  icon?: string;
  noDataMsg?: string;
};

export default function LazyCollapsible<T>({
  title,
  fetchData,
  renderContent,
  icon = "chevron-down",
  noDataMsg = "No Data",
}: LazyCollapsibleProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { colors } = useTheme();

  const handlePress = useCallback(async () => {
    setExpanded((prev) => !prev);
    if (!expanded && !data && !loading) {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData();
        console.log("Result:", result);
        setData(result);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
  }, [expanded, data, loading, fetchData]);

  return (
    <List.Accordion
      title={title}
      expanded={expanded}
      onPress={handlePress}
      left={(props) => (
        <List.Icon {...props} icon={icon} color={colors.primary} />
      )}
      right={(props) => (
        <List.Icon
          {...props}
          icon={expanded ? "chevron-up" : "chevron-down"}
          color={colors.primary}
        />
      )}
      style={{
        backgroundColor: colors.secondary,
      }}
      titleStyle={{ color: colors.primary }}
      accessibilityLabel={`See information about ${title}`}
    >
      <View style={{ paddingRight: 8 }}>
        {loading && <ActivityIndicator color={colors.tertiary} />}
        {error && (
          <List.Item title="Error loading data" description={error.message} />
        )}
        {data && renderContent(data)}
        {!loading && !error && !data && <List.Item title={noDataMsg} />}
      </View>
    </List.Accordion>
  );
}
