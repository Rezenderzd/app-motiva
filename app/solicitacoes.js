import {
  Text,
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  FlatList
} from "react-native";
import { AppContext } from "../components/provider";
import { useContext, useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { ItemSolicitacao } from "../components/itemSolicitacao";

export default function Solicitacoes() {
  const {
    getSolicitacoes,
    setTrechoExibir,
    trechoExibir,
    solicitacoes,
    isDarkMode,
    formatarData
  } = useContext(AppContext);
  const [kmPesquisado, setKmPesquisado] = useState("");
  const [trechoPesquisado, setTrechoPesquisado] = useState("");

  useFocusEffect(
    useCallback(() => {
      getSolicitacoes();
      setTrechoExibir(solicitacoes)
    }, [])
  );

  useEffect(() => {
    const listaSolicitacoes = solicitacoes || [];

    const trechoFiltrado = listaSolicitacoes.filter((trecho) => {
      const kmInicialStr = String(trecho.kmInicial || "");
      const kmFinalStr = String(trecho.kmFinal || "");
      const kmBuscaStr = String(kmPesquisado);

      const nomeTrecho = trecho.nomeTrecho || "";
      const matchesTexto = nomeTrecho
        .toLowerCase()
        .includes(trechoPesquisado.toLowerCase());

      const matchesKm =
        kmPesquisado === "" ||
        kmInicialStr.includes(kmBuscaStr) ||
        kmFinalStr.includes(kmBuscaStr);

      return matchesTexto && matchesKm;
    });

    setTrechoExibir(trechoFiltrado);
  }, [kmPesquisado, trechoPesquisado, solicitacoes]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <View style={[styles.container, {backgroundColor: isDarkMode? '#eee': '#222'}]}>
          <Text style={[styles.titulo, {color:isDarkMode? '#000': '#fff'}]}>Cortes Solicitados</Text>
          <View style={styles.inputs}>
            <View>
              <Text style={[styles.label, {color:isDarkMode? '#000': '#fff'}]}>Pesquisar trecho</Text>
              <TextInput
                placeholder="Rodo Anel"
                style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
                value={trechoPesquisado}
                onChangeText={setTrechoPesquisado}
                placeholderTextColor={isDarkMode ? "#000" : "#fff"}
              />
            </View>
            <View>
              <Text style={[styles.label, {color:isDarkMode? '#000': '#fff'}]}>Pesquisar km</Text>
              <TextInput
                placeholder="10"
                style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
                value={kmPesquisado}
                onChangeText={setKmPesquisado}
                placeholderTextColor={isDarkMode ? "#000" : "#fff"}
              />
            </View>
          </View>
          <View style={{flex: 1, marginTop: 20,}}>
            <FlatList
            data={trechoExibir}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listaContainer}
            keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <ItemSolicitacao
                trecho={item.nomeTrecho}
                status={item.status}
                id={item.id}
                kmInicial={item.kmInicial}
                kmFinal={item.kmFinal}
                dataLimite={formatarData(item.dataLimite)}
                vegetacao = {item.tipoVegetacao}
              />
            )}
            />
          </View>
          
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    marginTop: 20,
    textAlign: "center",
  },
  inputs: {
    flexDirection: "row",
    marginTop: 20,
    gap: 30,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  label: {
    fontSize: 16,
    textAlign: "flex-start",
    marginBottom: 5,
    left:5
  },
  listaContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30, 
  },
  input: {
    fontSize: 20,
    borderWidth: 0.5,
    borderColor: "rgb(94, 34, 243)",
    width: 150,
    borderRadius: 10,
    padding: 10,
  },
});
