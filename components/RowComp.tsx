import { View } from "react-native";

type RowCompProps = {
  children: React.ReactNode;
};

export const ViewRow = ({ children }: RowCompProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};
