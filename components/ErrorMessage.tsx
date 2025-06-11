import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type ErrorMessageProps = {
  title?: string;
  description?: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Error",
  description,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.error,
        borderColor: colors.onError, // dark red
        borderWidth: 1.5,
        borderRadius: 8,
        padding: 16,
        margin: 8,
      }}
    >
      <Text
        variant="titleMedium"
        style={{
          color: colors.onErrorContainer,
          marginBottom: 4,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
      {description && (
        <Text variant="bodyMedium" style={{ color: colors.onErrorContainer }}>
          {description}
        </Text>
      )}
    </View>
  );
};

export default ErrorMessage;
