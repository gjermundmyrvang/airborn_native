import { PaperProvider } from "react-native-paper";
import Homescreen from "./screens/Homescreen";
import { theme } from "./theme/theme";

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Homescreen />
    </PaperProvider>
  );
}
