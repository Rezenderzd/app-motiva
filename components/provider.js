import { useState, createContext, useEffect } from "react"
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext()

export function AppProvider ({children}){

    const router = useRouter();

    const [isDarkMode, setIsDarkMode] = useState(true)
    const [isLogin, setIsLogin] = useState(false)
    const [trechos, setTrechos] = useState([])
    const [trechoExibir ,setTrechoExibir] = useState([])
    const [solicitacoes, setSolicitacoes] = useState([])
    const [historico, setHistorico] = useState([])
    const [funcionario, setFuncionario] = useState('')

    const toggleSwitchMode = ()=>{
        setIsDarkMode(previousState =>!previousState)
    }

    const getTrechos = async()=>{
        try{
            const response = await fetch('http://10.0.2.2:5000/info-trecho', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await response.json()
            const trechosEncobertos = data.filter(item => item.vistoriaSolicitada)
            setTrechos(trechosEncobertos || [])
        }catch(error){
            console.error('Erro ao receber dados do backend(trechos):', error)
        }
    }

    const getSolicitacoes = async () =>{
        try{
            const response = await fetch('http://10.0.2.2:5001/solicitacoes/geral',{
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            if (!response.ok) {
                const erroTexto = await response.text();
                console.error(`Erro no servidor (Status ${response.status}):`, erroTexto);
                return;
            }
            const data = await response.json()
            setSolicitacoes(data)
            setTrechoExibir(data)
        }catch(error){
            console.error('Erro ao receber dados do backend (solicitacoes/geral):', error)
        }
    }

    const getHistorico = async () =>{
        try{
            const response =  await fetch('http://10.0.2.2:5002/historico/pegar',{
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            })
            const historico = await response.json()
            const historicoOrdenado = historico.sort((a, b) => {
                if (!a.dataCorte) return 1;
                if (!b.dataCorte) return -1;
                
                return new Date(b.dataCorte) - new Date(a.dataCorte);
              });
              console.log(historicoOrdenado)
            setHistorico(historicoOrdenado)
        }catch(error){
            console.log(`Erro ao pegar o historico: ${error}`)
        }
    }

    useEffect(() => {
        const checarSessao = async () => {
            try {
                const emailSalvo = await AsyncStorage.getItem('email')||null;
                const funcionarioSalvo = await AsyncStorage.getItem('funcionario') || null
                if (emailSalvo !== null && funcionarioSalvo !== null) {
                    setIsLogin(true);
                    setFuncionario(JSON.parse(funcionarioSalvo));
                    router.replace('../solicitacoes');
                } else {
                    setIsLogin(false);
                }
            } catch (error) {
                console.error("Erro ao ler dados do AsyncStorage:", error);
            }
        };

        checarSessao();
        getTrechos();
        getSolicitacoes();
        getHistorico();
    }, []);

    const formatarData = (dataBruta) => {
        if (!dataBruta) return "";
    
        const separador = dataBruta.includes("-") ? "-" : "/";
        const partes = dataBruta.split(separador);
    
        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2].split("T")[0];
    
        return `${dia}/${mes}/${ano}`;
    };

    return(
        <AppContext.Provider
            value = {{isDarkMode, setIsDarkMode, toggleSwitchMode, isLogin, setIsLogin, trechoExibir ,setTrechoExibir, getTrechos, trechos, setTrechos, solicitacoes, setSolicitacoes,
                getSolicitacoes, historico, setHistorico, getHistorico, setFuncionario, funcionario,
                formatarData
            }}
        >
            {children}
        </AppContext.Provider>
    )
}