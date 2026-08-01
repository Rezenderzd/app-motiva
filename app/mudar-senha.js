// app/mudar-senha.js
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { AppContext } from "../components/provider";
import Entypo from '@expo/vector-icons/Entypo';

export default function MudarSenha() {
  const router = useRouter();
  const { isDarkMode } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [senhaAntigaVisivel, setSenhaAntigaVisivel] = useState(false);
  const [senhaNovaVisivel, setSenhaNovaVisivel] = useState(false);
  const [confirmarSenhaNovaVisivel, setConfirmarSenhaNovaVisivel] =
    useState(false);
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenhaNova, setConfirmarSenhaNova] = useState("");
  const [erros, setErros] = useState({});
  const [erroAlterarSenha, setErroAlterarSenha] = useState(false);

  const togglePassword = (visivel, setVisivel) => {
    setVisivel(!visivel);
  };

  const verificar = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Digite um email válido";
    if (!email.trim()) e.email = "Digite um email";
    if (senhaAntiga.length < 8)
      e.senhaAntiga = "Sua senha deve conter ao menos 8 caracteres";
    if (!senhaAntiga.trim()) e.senhaAntiga = "Digite uma senha";
    if (senhaNova.length < 8)
      e.senhaNova = "Sua senha deve conter ao menos 8 caracteres";
    if (!senhaNova.trim()) e.senhaNova = "Digite uma senha";
    if (confirmarSenhaNova.length < 8)
      e.confirmarSenhaNova = "Sua senha deve conter ao menos 8 caracteres";
    if (!confirmarSenhaNova.trim()) e.confirmarSenhaNova = "Digite uma senha";
    if (senhaNova != confirmarSenhaNova) {
      e.confirmarSenhaNova = "Senhas não coincidem";
      e.senhaNova = "Senhas não coincidem";
    }
    if (senhaAntiga == senhaNova)
      e.senhaNova = "Senha nova não pode ser igual a antiga";
    setErros(e);
    if (Object.keys(e).length === 0) {
      return true;
    }
    return false;
  };

  const mudarSenha = async () => {
    setErroAlterarSenha(false)
    if (!verificar()) return;
    const response = await fetch(
      "http://10.0.2.2:5003/funcionarios/mudar-senha",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senhaAntiga, senhaNova }),
      }
    );
    const isFuncionario = await response.json();
    if (!isFuncionario) {
      setErroAlterarSenha(true);
      return;
    }
    setErroAlterarSenha(false);
    alert("Senha alterada com sucesso");
    setTimeout(() => {
      router.push('./login')
    }, 1000);
    setConfirmarSenhaNova('')
    setEmail('')
    setSenhaAntiga('')
    setSenhaNova('')
  };

  const mudarPagina = () =>{
    router.push('./login')
    setConfirmarSenhaNova('')
    setEmail('')
    setSenhaAntiga('')
    setSenhaNova('')
    setConfirmarSenhaNovaVisivel(false)
    setSenhaAntigaVisivel(false)
    setSenhaNovaVisivel(false)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? "#eee" : "#222" },
          ]}
        >
          <Image
            source={require("../assets/Motiva.svg.png")}
            style={styles.imagem}
          />
          <View style={styles.inputs}>
            <TextInput
              placeholder="fulano@motiva.com"
              style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={isDarkMode ? "#000" : "#fff"}
            />
            {erros.email ? (
              <Text style={styles.erro}>{erros.email}</Text>
            ) : null}
            <View style={styles.viewInputSenha}>
              <TextInput
                placeholder="••••••••••"
                style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
                value={senhaAntiga}
                onChangeText={setSenhaAntiga}
                secureTextEntry={!senhaAntigaVisivel}
                placeholderTextColor={isDarkMode ? "#000" : "#fff"}
              />
              <Text
                style={styles.senhaVisivel}
                onPress={() =>
                  togglePassword(senhaAntigaVisivel, setSenhaAntigaVisivel)
                }
              >
                {senhaAntigaVisivel ? <Entypo name="eye" size={24} color={isDarkMode? "black": "white" } /> : <Entypo name="eye-with-line" size={24} color={isDarkMode? "black": "white" } /> }
              </Text>
            </View>
            {erros.senhaAntiga ? (
              <Text style={styles.erro}>{erros.senhaAntiga}</Text>
            ) : null}
            <View style={styles.viewInputSenha}>
              <TextInput
                placeholder="••••••••••"
                style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
                value={senhaNova}
                onChangeText={setSenhaNova}
                secureTextEntry={!senhaNovaVisivel}
                placeholderTextColor={isDarkMode ? "#000" : "#fff"}
              />
              <Text
                style={styles.senhaVisivel}
                onPress={() =>
                  togglePassword(senhaNovaVisivel, setSenhaNovaVisivel)
                }
              >
                {senhaNovaVisivel ? <Entypo name="eye" size={24} color={isDarkMode? "black": "white" } /> : <Entypo name="eye-with-line" size={24} color={isDarkMode? "black": "white" } /> }
              </Text>
            </View>
            {erros.senhaNova ? (
              <Text style={styles.erro}>{erros.senhaNova}</Text>
            ) : null}
            <View style={styles.viewInputSenha}>
              <TextInput
                placeholder="••••••••••"
                style={[styles.input, { color: isDarkMode ? "#000" : "#fff" }]}
                value={confirmarSenhaNova}
                onChangeText={setConfirmarSenhaNova}
                secureTextEntry={!confirmarSenhaNovaVisivel}
                placeholderTextColor={isDarkMode ? "#000" : "#fff"}
              />
              <Text
                style={styles.senhaVisivel}
                onPress={() =>
                  togglePassword(
                    confirmarSenhaNovaVisivel,
                    setConfirmarSenhaNovaVisivel
                  )
                }
              >
                {confirmarSenhaNovaVisivel ? <Entypo name="eye" size={24} color={isDarkMode? "black": "white" } /> : <Entypo name="eye-with-line" size={24} color={isDarkMode? "black": "white" } /> }
              </Text>
            </View>
            {erros.confirmarSenhaNova ? (
              <Text style={styles.erro}>{erros.confirmarSenhaNova}</Text>
            ) : null}
          {erroAlterarSenha ? (
            <Text style={styles.erro}>Erro ao alterar a senha</Text>
          ) : null}
          </View>
          <TouchableOpacity
            style={styles.btnAlterarSenhaa}
            onPress={mudarSenha}
          >
            <Text style={styles.btnText}>Alterar Senha</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnVoltarLogin}
            onPress={mudarPagina}
          >
            <Text style={styles.txtRetornarLogin}>Retornar para login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagem: {
    width: 200,
    height: 30,
    top: 30,
    alignSelf: "center",
  },
  inputs: {
    top: 50,
    gap:15,
    paddingHorizontal: 30,
  },
  input: {
    fontSize: 20,
    borderWidth: 0.5,
    borderColor: "rgb(94, 34, 243)",
    width: 350,
    alignItems: "flex-start",
    borderRadius: 20,
    padding: 20,
  },
  viewInputSenha: {
    flexDirection: "row",
    alignItems: "center",
  },
  erro: {
    color: "red",
    fontSize: 15,
    marginTop: 2,
    marginBottom: 2,
    paddingLeft: 10,
  },
  senhaVisivel: {
    position: "absolute",
    left: 300,
    fontSize: 30,
  },
  erroLogin: {
    top: 5,
    color: "red",
    fontSize: 15,
    left: 10,
  },
  btnAlterarSenhaa: {
    backgroundColor: "rgb(94, 34, 243)",
    width: 300,
    height: 50,
    top: 100,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnVoltarLogin: {
    top: 130,
    alignSelf: "center",
  },
  txtRetornarLogin: {
    color: "rgb(94,34,243)",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});
