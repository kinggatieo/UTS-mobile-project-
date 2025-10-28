import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStore } from "../../lib/user";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useUserStore((s) => s.register);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert("Error", "Mohon isi semua kolom.");
      return;
    }

    const success = register(email, password);
    if (success) {
      Alert.alert("Berhasil", "Akun berhasil dibuat!");
      router.replace("/explore"); // ✅ Navigate to login
    } else {
      Alert.alert("Gagal", "Email sudah digunakan.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru 📝</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Daftar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/explore")}>
        <Text style={styles.loginLink}>Sudah punya akun? Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  registerBtn: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  registerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loginLink: { color: "#007AFF", fontSize: 16, marginTop: 10 },
});
