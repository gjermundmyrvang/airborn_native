import React from "react";
import { ActivityIndicator, View } from "react-native";
import { List, useTheme } from "react-native-paper";
import ErrorMessage from "./ErrorMessage";

type LazyCollapsibleProps<T> = {
  title: string;
  icon?: string;
  noDataMsg?: string;
  loading?: boolean;
  error?: Error | null;
  expanded: boolean;
  onToggle: () => void;
  renderContent: () => React.ReactNode;
};

export default function LazyCollapsible<T>({
  title,
  icon = "chevron-down",
  noDataMsg = "No Data",
  loading,
  error,
  expanded,
  onToggle,
  renderContent,
}: LazyCollapsibleProps<T>) {
  const { colors } = useTheme();

  return (
    <List.Accordion
      title={title}
      expanded={expanded}
      onPress={onToggle}
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
          <ErrorMessage
            title="Error loading data"
            description={error.message}
          />
        )}
        {!loading && !error && renderContent()}
        {!loading && !error && !renderContent() && (
          <List.Item title={noDataMsg} />
        )}
      </View>
    </List.Accordion>
  );
}
