import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useInventoryStore } from "../../lib/inventorystore";

export default function InventoryScreen() {
  const { items, addItem, deleteItem, updateItem } = useInventoryStore();
  const [newItem, setNewItem] = useState({
    name: "",
    barcode: "",
    stock: "",
    price_idr: "",
    category: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editItem, setEditItem] = useState<any | null>(null);

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  // ✅ Add Item Handler
  const handleAddItem = () => {
    if (
      !newItem.name.trim() ||
      !newItem.barcode.trim() ||
      !newItem.stock ||
      !newItem.price_idr
    ) {
      Alert.alert(
        "⚠️ Data belum lengkap",
        "Mohon isi semua kolom terlebih dahulu!"
      );
      return;
    }

    const id = Date.now().toString();
    const itemToAdd = {
      id,
      name: newItem.name.trim(),
      barcode: newItem.barcode.trim(),
      stock: Number(newItem.stock),
      price_idr: Number(newItem.price_idr),
      category: newItem.category.trim(),
    };

    addItem(itemToAdd);
    Alert.alert("✅ Sukses", `${newItem.name} berhasil ditambahkan!`);

    setNewItem({
      name: "",
      barcode: "",
      stock: "",
      price_idr: "",
      category: "",
    });
  };

  // ✅ Delete Item
  const handleDeleteItem = (id: string, name: string) => {
    Alert.alert("Hapus Barang", `Yakin ingin menghapus ${name}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          deleteItem(id);
          Alert.alert("🗑️", `${name} telah dihapus.`);
        },
      },
    ]);
  };

  // ✅ Edit Item Handler
  const handleSaveEdit = () => {
    if (!editItem) return;
    if (
      !editItem.name.trim() ||
      !editItem.barcode.trim() ||
      !editItem.stock ||
      !editItem.price_idr
    ) {
      Alert.alert("⚠️ Data belum lengkap", "Semua kolom wajib diisi!");
      return;
    }

    updateItem(editItem.id, editItem);
    Alert.alert("✅ Diperbarui", `${editItem.name} telah diperbarui.`);
    setEditItem(null);
  };

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Barcode: {item.barcode}</Text>
        <Text>Stok: {item.stock}</Text>
        <Text>Harga: {formatRupiah(item.price_idr)}</Text>
        <Text>Kategori: {item.category || "Tidak ada"}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditItem(item)}
        >
          <Text style={styles.buttonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteItem(item.id, item.name)}
        >
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={styles.title}>📦 Manajemen Stok (Offline)</Text>

      {/* Input Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nama Barang"
          value={newItem.name}
          onChangeText={(t) => setNewItem({ ...newItem, name: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Barcode"
          value={newItem.barcode}
          onChangeText={(t) => setNewItem({ ...newItem, barcode: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Jumlah Stok"
          keyboardType="numeric"
          value={newItem.stock.toString()}
          onChangeText={(t) => setNewItem({ ...newItem, stock: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Harga (Rp)"
          keyboardType="numeric"
          value={newItem.price_idr.toString()}
          onChangeText={(t) => setNewItem({ ...newItem, price_idr: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Kategori (contoh: Minuman, Jajan)"
          value={newItem.category}
          onChangeText={(t) => setNewItem({ ...newItem, category: t })}
        />

        <Button title="Tambah Barang" onPress={handleAddItem} />
      </View>

      {/* Filter */}
      <Text style={styles.subtitle}>🧾 Daftar Barang</Text>
      <View style={styles.filterBox}>
        <Text style={styles.filterLabel}>Filter Kategori:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(val) => setSelectedCategory(val)}
          style={styles.picker}
        >
          <Picker.Item label="Semua Kategori" value="all" />
          {[...new Set(items.map((item) => item.category))].map(
            (cat, i) => cat && <Picker.Item key={i} label={cat} value={cat} />
          )}
        </Picker>
      </View>

      {/* Item List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada barang ditambahkan</Text>
        }
      />

      {/* Edit Modal */}
      <Modal visible={!!editItem} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>✏️ Edit Barang</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Barang"
              value={editItem?.name || ""}
              onChangeText={(t) => setEditItem({ ...editItem, name: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Barcode"
              value={editItem?.barcode || ""}
              onChangeText={(t) => setEditItem({ ...editItem, barcode: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Stok"
              keyboardType="numeric"
              value={editItem?.stock?.toString() || ""}
              onChangeText={(t) =>
                setEditItem({ ...editItem, stock: Number(t) })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Harga (Rp)"
              keyboardType="numeric"
              value={editItem?.price_idr?.toString() || ""}
              onChangeText={(t) =>
                setEditItem({ ...editItem, price_idr: Number(t) })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Kategori"
              value={editItem?.category || ""}
              onChangeText={(t) => setEditItem({ ...editItem, category: t })}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title="Simpan" onPress={handleSaveEdit} />
              <Button
                title="Batal"
                color="gray"
                onPress={() => setEditItem(null)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#222",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  subtitle: { fontSize: 20, fontWeight: "600", marginVertical: 10 },
  filterBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  filterLabel: { fontSize: 16, fontWeight: "500", marginBottom: 5 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  actions: { flexDirection: "row", alignItems: "center" },
  name: { fontWeight: "bold", fontSize: 18, marginBottom: 4 },
  editButton: {
    marginLeft: 5,
    backgroundColor: "#2196F3",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteButton: {
    marginLeft: 5,
    backgroundColor: "#ff5252",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
});
