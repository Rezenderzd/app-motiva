import { useContext, useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { AppContext } from "../components/provider";
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';

export default function Login() {

    const router = useRouter();
    const{setIsLogin, isDarkMode, setFuncionario} = useContext(AppContext)

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [senhaVisivel, setSenhaVisivel] = useState(false)
    const [erros, setErros] = useState({})
    const [erroLogin, setErroLogin] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [isChecked, setChecked] = useState(false)

    const validar = () => {
        const e = {};
        if(!email.includes('@')) e.email = 'Digite um email válido'
        if(!email.trim()) e.email = 'Digite um email'
        if(senha.length<8) e.senha = 'Sua senha deve conter ao menos 8 caracteres'
        if(!senha.trim()) e.senha = 'Digite uma senha'
        setErros(e);
        if(Object.keys(e).length === 0){
            return true
        }
        return false
    };

    const togglePassword = () =>{
        setSenhaVisivel(!senhaVisivel)
    }

    const handleSubmit = async () =>{
        setMensagemErro('')
        setErroLogin(false)
        if(!validar()) return
        try{
            const response = await fetch('http://10.0.2.2:5003/funcionarios/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, senha})
            })
            const isFuncionario = await response.json()
            if (isFuncionario.status !== true) {
                setErroLogin(true)
                setMensagemErro('Email ou senha inválidos') 
                return
            }
            if(isChecked){
                await AsyncStorage.setItem('email', JSON.stringify(email))
                await AsyncStorage.setItem('funcionario', JSON.stringify(isFuncionario.funcionario))
            }
            setErroLogin(false)
            alert("Logado com sucesso")
            setFuncionario(isFuncionario.funcionario)
            setSenha('')
            setEmail('')
            router.replace("./solicitacoes")
            setTimeout(() => {
                setIsLogin(true)
            }, 100);
        }catch(erro){
            setErroLogin(true)
            setMensagemErro('Erro ao buscar informações no banco de dados'+erro)
        }
    }

    const mudarPagina = () =>{
        router.push('./mudar-senha')
        setSenha('')
        setEmail('')
        setSenhaVisivel(false)
    }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style = {[styles.container, {backgroundColor: isDarkMode? '#eee': '#222'}]}>
          <Image source={require("../assets/Motiva.svg.png")} style={styles.imagem} />
          <View style={styles.inputs}>
            <TextInput
                placeholder="fulano@motiva.com"
                style={[styles.input, {color:isDarkMode? '#000': '#fff'}]}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={isDarkMode? '#000':'#fff'}
            />
            {erros.email? <Text style={styles.erro}>{erros.email}</Text>:null}
            <View style={styles.viewInputSenha}>
                <TextInput
                    placeholder="••••••••••"
                    style={[styles.input, {color:isDarkMode? '#000': '#fff'}]}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!senhaVisivel}
                    placeholderTextColor={isDarkMode? '#000':'#fff'}
                />
                <Text style = {styles.senhaVisivel} onPress={togglePassword}>{senhaVisivel? <Entypo name="eye" size={24} color={isDarkMode? "black": "white" } /> : <Entypo name="eye-with-line" size={24} color={isDarkMode? "black": "white" } />  }</Text>
            </View>
            {erros.senha? <Text style={styles.erro}>{erros.senha}</Text>:null}
            {erroLogin? <Text style={styles.erroLogin}>{mensagemErro}</Text>:null}
          </View>
          <View style={styles.viewCheck}>
            <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#4630EB' : undefined}
            />
            <Text style={{color: isDarkMode? '#000':'#fff'}}>Lembrar-me neste dispositivo</Text>
          </View>
          
          <TouchableOpacity style={styles.btnEntrar} onPress={handleSubmit}>
            <Text style={styles.btnText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMudarSenha} onPress={mudarPagina}>
            <Text style={styles.txtMudarSenha}>Mudar a senha</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    imagem:{
        width:320,
        height:60,
        top:100,
        alignSelf: 'center'
    },
    inputs:{
        display:1,
        top:180,
        gap:30,
        paddingHorizontal: 30,
    },  
    input:{
        fontSize:20,
        borderWidth:0.5,
        borderColor:'rgb(94, 34, 243)',
        width:350,
        alignItems:'flex-start',
        borderRadius:20,
        padding:20,
    },
    viewInputSenha:{
        flexDirection:'row',
        alignItems:'center'
    },
    erro:{
        color:'red',
        fontSize:15,
        left:10,
        top:-20,
    },
    senhaVisivel:{
        position:'absolute',
        left:300,
        fontSize:30
    },
    erroLogin:{
      top:5,
      color:'red',
      fontSize:15,
      left:10,
    },
    viewCheck:{
        top:200,
        left:50,
        flexDirection:'row',
        alignItems:'center'
    },
    checkbox: {
        margin: 8,
    },
    btnEntrar: {
        backgroundColor: 'rgb(94, 34, 243)',
        width: 300,
        height: 50, 
        top: 220,
        alignSelf: 'center', 
        borderRadius: 10,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    btnMudarSenha: {
        top: 250,
        alignSelf: 'center'
    },
    txtMudarSenha: {
        color: 'rgb(94,34,243)',
        textDecorationLine: 'underline',
        fontSize:15
    }
})
