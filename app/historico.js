import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList
} from "react-native";
import { AppContext } from "../components/provider";
import { useContext, useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ItemHistorico } from "../components/itemHistorico";

export default function App() {
  const {
    getHistorico,
    setTrechoExibir,
    historico,
    trechoExibir,
    isDarkMode,
    formatarData,
  } = useContext(AppContext);

  const [dataPreCorte, setDataPreCorte] = useState(null);
  const [dataPosCorte, setDataPosCorte] = useState(null);
  const [kmPesquisado, setKmPesquisado] = useState("");
  const [trechoPesquisado, setTrechoPesquisado] = useState("");

  const [showPre, setShowPre] = useState(false);
  const [showPos, setShowPos] = useState(false);

  const onChangePreCorte = (event, selectedDate) => {
    if (event.type === "set" || event.type === "dismissed") {
      setShowPre(false);
    }
  
    if (selectedDate) {
      if (dataPosCorte && selectedDate > dataPosCorte) {
        setDataPreCorte(dataPosCorte); 
        setDataPosCorte(selectedDate); 
      } else {
        setDataPreCorte(selectedDate);
      }
    }
  };
  
  const onChangePosCorte = (event, selectedDate) => {
    if (event.type === "set" || event.type === "dismissed") {
      setShowPos(false);
    }
  
    if (selectedDate) {
      if (dataPreCorte && selectedDate < dataPreCorte) {
        setDataPosCorte(dataPreCorte); 
        setDataPreCorte(selectedDate); 
      } else {
        setDataPosCorte(selectedDate);
      }
    }
  };

  const togglePre = () => {
    setShowPos(false);
    setShowPre((prev) => !prev);
  };

  const togglePos = () => {
    setShowPre(false);
    setShowPos((prev) => !prev);
  };

  useFocusEffect(
    useCallback(() => {
      getHistorico();

      setTrechoExibir(historico);
    }, [])
  );

  const dateToString = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const listaHistorico = historico || [];

    const inicioISO = dateToString(dataPreCorte); 
    const fimISO = dateToString(dataPosCorte);    

    const trechoFiltrado = listaHistorico.filter((trecho) => {
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

      let matchesData = true;
      const dataItem = trecho.dataCorte;

      if (dataItem) {
        if (inicioISO && fimISO) {
          matchesData = dataItem >= inicioISO && dataItem <= fimISO;;
        } else if (inicioISO) {
          matchesData = dataItem >= inicioISO;
        } else if (fimISO) {
          matchesData = dataItem <= fimISO;
        }
      }

      return matchesTexto && matchesKm && matchesData;
    });

    setTrechoExibir(trechoFiltrado);
  }, [kmPesquisado, trechoPesquisado, historico, dataPreCorte, dataPosCorte]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, {backgroundColor: isDarkMode? '#eee': '#222'}]}>
        <Text style={[styles.titulo, { color: isDarkMode ? "#000" : "#fff" }]}>
          Histórico de cortes
        </Text>
        <View style={styles.inputs}>
          <View>
            <Text
              style={[styles.label, { color: isDarkMode ? "#000" : "#fff" }]}
            >
              Pesquisar trecho
            </Text>
            <TextInput
              placeholder="Rodo Anel"
              style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
              value={trechoPesquisado}
              onChangeText={setTrechoPesquisado}
              placeholderTextColor={isDarkMode ? "#000" : "#fff"}
            />
          </View>
          <View>
            <Text
              style={[styles.label, { color: isDarkMode ? "#000" : "#fff" }]}
            >
              Pesquisar km
            </Text>
            <TextInput
              placeholder="10"
              style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
              value={kmPesquisado}
              onChangeText={setKmPesquisado}
              placeholderTextColor={isDarkMode ? "#000" : "#fff"}
            />
          </View>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btnData} onPress={togglePre}>
            <Text style={styles.btnText}>{dataPreCorte ? `De: ${dataPreCorte.toLocaleDateString("pt-BR")}` : "De"}</Text>
          </TouchableOpacity>

          {showPre && (
            <DateTimePicker
              value={dataPreCorte || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangePreCorte}
            />
          )}

          <TouchableOpacity style={styles.btnData} onPress={togglePos}>
            <Text style={styles.btnText}>{dataPosCorte ? `Até: ${dataPosCorte.toLocaleDateString("pt-BR")}` : "Até"}</Text>
          </TouchableOpacity>

          {showPos && (
            <DateTimePicker
              value={dataPosCorte || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangePosCorte}
            />
          )}
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <FlatList
            data={trechoExibir}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listaContainer}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <ItemHistorico
                trecho={item.nomeTrecho}
                id={item.id}
                kmInicial={item.kmInicial}
                kmFinal={item.kmFinal}
                data={formatarData(item.dataCorte)}
                funcionario={item.funcionario}
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
    backgroundColor: "#fff",
    alignItems: "center",
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
    justifyContent: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    textAlign: "flex-start",
    marginBottom: 5,
    left: 5,
  },
  input: {
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: "rgb(94, 34, 243)",
    width: 150,
    borderRadius: 10,
    padding: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 30,
  },
  btnData: {
    backgroundColor: "rgb(94, 34, 243)",
    padding: 10,
    width: 150,
    alignItems: "center",
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
  },
});
