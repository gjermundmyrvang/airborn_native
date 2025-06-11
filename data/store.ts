import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES = "favs"


export const getFavorites = async () => {
    try {
        const saved = await AsyncStorage.getItem(FAVORITES)
        return saved != null ? JSON.parse(saved) : []
    } catch (error) {
        console.log("Error fetching from async", error)
    }
}


export const updateFavorites = async (airports: string[]): Promise<void> => {
  try {
      await AsyncStorage.setItem(FAVORITES, JSON.stringify(airports));
  } catch (error) {
    console.log("Error adding to async", error);
  }
};

