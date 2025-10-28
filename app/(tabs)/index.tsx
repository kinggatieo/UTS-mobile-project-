import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useInventoryStore } from "../../lib/inventorystore";
import { useSalesStore } from "../../lib/salesStore";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { items, setItems } = useInventoryStore();
  const { addSale } = useSalesStore();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    const foundItem = items.find((item) => item.barcode === data);

    if (foundItem) {
      if (foundItem.stock > 0) {
        // Reduce stock in inventory
        const updatedItems = items.map((item) =>
          item.id === foundItem.id ? { ...item, stock: item.stock - 1 } : item
        );
        setItems(updatedItems);

        // Add sale to offline sales store
        const sale = {
          id: Date.now().toString(),
          itemName: foundItem.name,
          quantity: 1,
          totalPrice: foundItem.price_idr,
          date: new Date().toISOString().split("T")[0],
        };
        addSale(sale);

        Alert.alert(
          "✅ Item Sold!",
          `${foundItem.name} sold for Rp${foundItem.price_idr.toLocaleString(
            "id-ID"
          )}`
        );
      } else {
        Alert.alert("⚠️ Out of Stock", `${foundItem.name} is out of stock.`);
      }
    } else {
      Alert.alert(
        "❌ Not Found",
        "No item with this barcode found in inventory."
      );
    }

    // Allow next scan after a short delay
    setTimeout(() => setScanned(false), 1500);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>We need camera access to scan barcodes.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => requestPermission()}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.instruction}>📷 Scan an item barcode</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  instruction: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
