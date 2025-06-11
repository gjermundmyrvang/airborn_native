import React from "react";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import { Text, useTheme, Icon } from "react-native-paper";
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
    <View
      style={{
        marginVertical: 8,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 14,
          paddingHorizontal: 18,
          gap: 6,
        }}
        accessibilityLabel={`See information about ${title}`}
      >
        {!!icon && <Icon source={icon} size={22} color={colors.primary} />}
        <Text variant="titleMedium" style={{ color: colors.primary, flex: 1 }}>
          {title}
        </Text>
        <Icon
          source={expanded ? "chevron-up" : "chevron-down"}
          size={22}
          color={colors.primary}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={{ paddingBottom: 14 }}>
          {loading && <ActivityIndicator color={colors.tertiary} />}
          {error && (
            <ErrorMessage
              title="Error loading data"
              description={error.message}
            />
          )}
          {!loading && !error && renderContent()}
          {!loading && !error && !renderContent() && (
            <ErrorMessage title={noDataMsg} />
          )}
        </View>
      )}
    </View>
  );
}
