import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useInventoryStore } from "../lib/inventorystore";
import { useSalesStore } from "../lib/salesStore"; // New offline sales tracker

export default function ScannerPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState("📷 Point the camera at a barcode");
  const [fadeAnim] = useState(new Animated.Value(0));

  const { items, setItems } = useInventoryStore();
  const { addSale } = useSalesStore();

  // ask for permission on mount
  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const showMessage = (text: string, duration = 2000) => {
    setMessage(text);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBarCodeScanned = async ({
    data,
  }: {
    data: string;
    type: string;
  }) => {
    if (scanned) return;
    setScanned(true);

    // find item locally
    const foundItem = items.find((item) => item.barcode === data);

    if (!foundItem) {
      showMessage(`⚠️ Item not found for barcode: ${data}`);
      setTimeout(() => setScanned(false), 2000);
      return;
    }

    // reduce stock locally
    const updatedItems = items.map((item) =>
      item.barcode === data
        ? { ...item, stock: Math.max(0, item.stock - 1) }
        : item
    );
    setItems(updatedItems);

    const sale = {
      id: Date.now().toString(),
      itemName: foundItem.name,
      quantity: 1,
      totalPrice: foundItem.price_idr,
      date: new Date().toISOString().split("T")[0],
    };

    addSale(sale);

    showMessage(`✅ ${foundItem.name} scanned successfully!`);
    setTimeout(() => setScanned(false), 2000);
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>Camera access is required to scan barcodes.</Text>
        <Text onPress={requestPermission} style={styles.link}>
          Grant Permission
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "code128"],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />

      {/* Animated feedback */}
      <Animated.View style={[styles.feedbackBox, { opacity: fadeAnim }]}>
        <Text style={styles.feedbackText}>{message}</Text>
      </Animated.View>

      {/* Static overlay */}
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  link: { color: "#007AFF", marginTop: 10, fontWeight: "bold" },
  feedbackBox: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  feedbackText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
