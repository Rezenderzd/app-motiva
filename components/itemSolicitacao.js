import { useContext, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { AppContext } from "./provider";
import AntDesign from '@expo/vector-icons/AntDesign';

export function ItemSolicitacao({trecho, status, id, kmInicial, kmFinal, dataLimite, vegetacao}) {
  const { isDarkMode,getSolicitacoes, funcionario } = useContext(AppContext);
  
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const abrirConfirmacao = () => {
    setMostrarConfirmacao(true);
  };

  const fecharConfirmacao = () => {
    setMostrarConfirmacao(false);
  };

  const corteFeito = async() => {
    try{
      const response = await fetch('http://10.0.2.2:5001/solicitacoes/excluir', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id})
      })
      if(response.status === 201){
        alert("Corte registrado com sucesso")
        const nomeTrecho = trecho
        const respostaHistorico = await fetch('http://10.0.2.2:5002/historico/adicionar',{
          method:'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({nomeTrecho, kmInicial, kmFinal, funcionario, vegetacao})
        })
        const dadosHistorico = await respostaHistorico.json();

        if(dadosHistorico.status !== 'sucesso'){
          alert("Erro ao salvar corte no histórico")
        }
        const respostaTrecho = await fetch('http://10.0.2.2:5000/info-trecho/altura-sensor',{
          method:'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id})
        })
        const dadosTrecho = await respostaTrecho.json();

        if(dadosTrecho.status !== 'sucesso'){
          alert("Erro ao alterar a altura do trecho")
        }
      }
      getSolicitacoes()
      fecharConfirmacao();
    }
    catch (error){
      alert(`Erro ao registrar o corte: ${error}`)
    }
  };

  return (
    <View key={id} style={[styles.container, {borderLeftColor: status == 'Atrasado'? '#e74c3c':'#ba8e23', backgroundColor:isDarkMode? '#fff': '#444'}]}>
      
      {mostrarConfirmacao ? (
        <View style={[styles.confirmar, {backgroundColor: isDarkMode? 'rgba(255, 255, 255, 0.95)': 'rgb(68, 68, 68)'}]}>
          <Text style={{color: isDarkMode? '#000': '#fff', marginBottom: 15, textAlign: 'center'}}>
            Confirmar corte do {trecho} do km {kmInicial} ao km {kmFinal}?
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={corteFeito} style={[styles.btnPopUp, { backgroundColor: 'rgb(94, 34, 243)' }]}>
              <Text style={{ color: '#fff' }}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={fecharConfirmacao} style={[styles.btnPopUp, { backgroundColor: isDarkMode? 'transparent': '#777', borderColor: 'rgb(94, 34, 243)', borderWidth:1}]}>
              <Text style={{ color: 'rgb(94, 34, 243)' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ): null}

      <View style={styles.texto}>
        <Text style={{fontSize:20, color:isDarkMode? '#000': '#fff'}}>Rodovia</Text>
        <Text
          style={[styles.status,{
            backgroundColor:
              status === "Atrasado"
                ? "rgba(231, 76, 60, 0.2)"
                : "rgba(186,142,35,0.3)",
            color: status === "Atrasado" ? "#e74c3c" : "#ba8e23",}
          ]}
        >
          {status === 'Em dia'? 'Alerta': status}
        </Text>
      </View>
      
      <Text style={{justifyContent:'flex-start', alignItems:'flex-start', fontSize:20, marginBottom:5, fontWeight:'bold', color:isDarkMode? '#000': '#fff'}}>{trecho}</Text>
      <Text style={{fontSize:16, marginBottom:5, color:isDarkMode? '#000': '#fff'}}>
        Km {kmInicial} ao Km {kmFinal}
      </Text>
      <Text style={{fontSize:16, marginBottom:5, color:isDarkMode? '#000': '#fff',}}>Data Limite: {dataLimite}</Text>
      <TouchableOpacity style={[styles.btn, {backgroundColor: isDarkMode? 'transparent': 'rgb(94, 34, 243)'}]} onPress={abrirConfirmacao}>
        <AntDesign name="check-circle" size={16} color={isDarkMode? "rgb(94, 34, 243)": '#fff'} />
        <Text style={{ color: isDarkMode?'rgb(94, 34, 243)': '#fff', fontSize:16}}>Registrar Corte Concluído</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        marginTop:10,
        paddingHorizontal:25,
        paddingVertical:20,
        borderLeftWidth:4,
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
    texto:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:2
    },
    status:{
        padding:5,
        borderRadius:5,
        fontSize:16
    },
    btn:{
        marginTop:5,
        paddingHorizontal:10,
        paddingVertical:10,
        alignItems:'center',
        width:230,
        justifyContent:'center',
        borderColor: 'rgb(94, 34, 243)',
        borderWidth:1,
        borderRadius:5,
        marginLeft:'auto',
        marginRight:'auto',
        textAlign:'center',
        flexDirection:'row',
        gap:4
    }
})