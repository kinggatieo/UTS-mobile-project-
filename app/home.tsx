import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSalesStore } from "../lib/salesStore"; // ✅ import local sales store

export default function HomeScreen() {
  const { sales } = useSalesStore(); // ✅ get all recorded sales

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Penjualan Hari Ini</Text>

      {sales.length === 0 ? (
        <Text style={styles.empty}>Belum ada barang terjual</Text>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.itemName}</Text>
              <Text style={styles.qty}>Jumlah: {item.quantity}</Text>
              <Text style={styles.price}>
                Total: Rp{item.totalPrice.toLocaleString("id-ID")}
              </Text>
              <Text style={styles.date}>Tanggal: {item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "600" },
  qty: { fontSize: 16, color: "#555" },
  price: { fontSize: 16, color: "#007AFF" },
  date: { fontSize: 14, color: "#888" },
  empty: { textAlign: "center", marginTop: 20, color: "#666" },
});
