import { useContext, useState, useCallback, useEffect} from "react"
import { Text, View, KeyboardAvoidingView, Platform, TextInput, FlatList, StyleSheet } from "react-native"
import { AppContext } from "../components/provider"
import ItemVistoria from "../components/itemVistoria"
import { useFocusEffect } from "expo-router";

export default function Vistoria(){

    const {trechos, isDarkMode, trechoExibir, setTrechoExibir, getTrechos} = useContext(AppContext)
    const [kmPesquisado, setKmPesquisado] = useState("");
    const [trechoPesquisado, setTrechoPesquisado] = useState("");

    useFocusEffect(
        useCallback(() => {
          getTrechos();
          setTrechoExibir(trechos)
        }, [])
    );

    useEffect(() => {
        const listaTrechos = trechos || [];
    
        const trechoFiltrado = listaTrechos.filter((trecho) => {
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
      }, [kmPesquisado, trechoPesquisado, trechos]);

    return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={[styles.container, {backgroundColor: isDarkMode? '#eee': '#222'}]}>
              <Text style={[styles.titulo, {color:isDarkMode? '#000': '#fff'}]}>Vistorias pendentes</Text>
              <View style={styles.inputs}>
                <View>
                  <Text style={[styles.label, {color:isDarkMode? '#000': '#fff'}]}>Pesquisar trecho</Text>
                  <TextInput
                    placeholder="RioSP"
                    style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
                    value={trechoPesquisado}
                    onChangeText={setTrechoPesquisado}
                    placeholderTextColor={isDarkMode ? "#000" : "#fff"}
                  />
                </View>
                <View>
                  <Text style={[styles.label, {color:isDarkMode? '#000': '#fff'}]}>Pesquisar km</Text>
                  <TextInput
                    placeholder="30"
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
                    <ItemVistoria
                    id={item.id}
                    nome={item.trecho}
                    kmInicial={item.kmInicial}
                    kmFinal={item.kmFinal}
                    status={item.status}
                    tipoVegetacao={item.tipoVegetacao}
                    latitudeInicial={item.latitudeInicial}
                    longitudeInicial={item.longitudeInicial}
                    latitudeFinal={item.latitudeFinal}
                    longitudeFinal={item.longitudeFinal}
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

 