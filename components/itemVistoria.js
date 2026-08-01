import { useState, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { AppContext } from "./provider";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ItemVistoria({id,nome, kmInicial, kmFinal, tipoVegetacao, latitudeInicial, latitudeFinal, longitudeInicial, longitudeFinal, status}){

    const { isDarkMode, getTrechos } = useContext(AppContext);
      
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [mensagem, setMensagem] = useState("")
    const inconsistencia = false
    const solicitarCorte = true
    const [opcaoEscolhida, setOpcaoEscolhida] = useState(0)
    
    const abrirConfirmacao = (itemDesejado) => {
        if(!itemDesejado){
            setMensagem(`Confirmar que o sensor do trecho ${nome} do km ${kmInicial} até o km ${kmFinal} é só uma inconsitência?`)
            setOpcaoEscolhida(1)
        }else{
            setMensagem(`Confirmar solicitação  de corte do trecho ${nome} do km ${kmInicial} até o km ${kmFinal}?`)
            setOpcaoEscolhida(2)
        }
        setMostrarConfirmacao(true);
    };
    
    const fecharConfirmacao = () => {
        setMostrarConfirmacao(false);
        setOpcaoEscolhida(0)
    };

    const enviarSolicitacao = async () =>{
        try {
            const dados =  {
                id:id,
                nomeTrecho:nome,
                kmInicial: kmInicial,
                kmFinal: kmFinal,
                tipoVegetacao: tipoVegetacao,
                latitudeInicial: latitudeInicial,
                longitudeInicial: longitudeInicial,
                latitudeFinal: latitudeFinal,
                longitudeFinal: longitudeFinal,
                status: status
            }
            await fetch('http://10.0.2.2:5001/solicitacoes/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            })
            await fetch('http://10.0.2.2:5000/info-trecho/vistoria',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id})
            })
            getTrechos()
            alert("Solicitação enviada com sucesso")
        }
        catch(error){
            alert("Houve um erro ao enviar a solicitação de vistoria")
        }
    }

    const enviarInconsistencia = async() =>{
        await fetch('http://10.0.2.2:5000/info-trecho/sensor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id})
        })
        alert("Inconsistência registrada")
        getTrechos()
    }

    const confirmar = ()=>{
        if(opcaoEscolhida === 1){
            enviarInconsistencia()
            return
        }
        if(opcaoEscolhida === 2){
            enviarSolicitacao()
        }
    }
    

    return(
        <View key={id} style={[styles.container, {backgroundColor:isDarkMode? '#fff': '#333', borderColor: isDarkMode? 'black':'rgb(94, 34, 243)'}]}>
            {mostrarConfirmacao ? (
                <View style={[styles.confirmar, {backgroundColor: isDarkMode? 'rgba(255, 255, 255, 0.95)': 'rgb(68, 68, 68)'}]}>
                  <Text style={{color: isDarkMode? '#000': '#fff', marginBottom: 15, textAlign: 'center'}}>
                    {mensagem}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity style={[styles.btnPopUp, { backgroundColor: opcaoEscolhida === 2? 'rgb(94, 34, 243)': '#ff0000' }]} onPress={confirmar}>
                      <Text style={{ color: '#fff' }}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={fecharConfirmacao} style={[styles.btnPopUp, { backgroundColor: isDarkMode? 'transparent': '#ccc', borderColor: opcaoEscolhida === 2? 'rgb(94, 34, 243)': '#ff0000', borderWidth:1}]}>
                      <Text style={{ color: opcaoEscolhida === 2?'rgb(94, 34, 243)': '#ff0000' }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            ): null}
            <Text style={{fontSize:20, color:isDarkMode? '#000': '#fff'}}>Rodovia</Text>
            <Text style={{justifyContent:'flex-start', alignItems:'flex-start', fontSize:20, marginBottom:5, fontWeight:'bold', color:isDarkMode? '#000': '#fff'}}>{nome}</Text>
            <Text style={{fontSize:16, marginBottom:5, color:isDarkMode? '#000': '#fff'}}>Km {kmInicial} ao Km {kmFinal}</Text>
            <View style={styles.btns}>
                <TouchableOpacity onPress={()=> abrirConfirmacao(solicitarCorte)} style={styles.btnSolicitar}>
                    <Entypo name="scissors" size={16} color="white" />
                    <Text style={{color:'#fff'}}>Solicitar corte</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>abrirConfirmacao(inconsistencia)} style={[styles.btnInconsistencia, {backgroundColor: isDarkMode? 'transparent': '#ff0000'}]}>
                    <AntDesign name="warning" size={16} color={isDarkMode? '#ff0000':'#fff'} />
                    <Text style={{color: isDarkMode? '#ff0000': '#fff', fontWeight:'bo'}}>Inconsistência</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        marginTop:10,
        paddingHorizontal:25,
        paddingVertical:20,
        borderWidth:0.5,
        borderLeftWidth:0.5,
        backgroundColor:'#fff',
        borderRadius:10,
        width: 350,
        marginLeft:20,
        position: 'relative', 
    },
    confirmar:{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      zIndex: 10,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    btnPopUp: {
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 10,
      width: 100,
      alignItems: 'center'
    },
    btns:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:10,
        gap:10
    },
    btnSolicitar:{
        paddingInline:20,
        paddingBlock:10,
        backgroundColor:'rgb(94, 34, 243)',
        borderRadius:5,
        flexDirection:'row',
        gap:4,
        alignItems:'center'
    },
    btnInconsistencia:{
        paddingInline:20,
        paddingBlock:10,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#ff0000',
        flexDirection:'row',
        gap:4,
        alignItems:'center'
    }
})