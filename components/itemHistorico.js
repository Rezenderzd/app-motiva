import { useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
} from "react-native";
import { AppContext } from "./provider";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export const ItemHistorico = ({id, trecho, kmInicial, kmFinal, funcionario, data}) =>{

    const {isDarkMode} = useContext(AppContext)

    return(
        <View key={id} style={[styles.container, {backgroundColor:isDarkMode? '#fff': '#333', borderColor: isDarkMode? 'black':'rgb(94, 34, 243)'}]}>
           <View style={styles.infoRodovia}>
                <Text style={{fontSize:16, color:isDarkMode? '#000': '#fff'}}>Rodovia {trecho}</Text>
                <Text style={styles.concluido}>Concluído</Text>
           </View>
           <Text style={{paddingBottom:10, borderBottomWidth:0.5, color:isDarkMode?'rgb(94, 34, 243)': 'rgb(141, 91, 246)'}}>KM {kmInicial} - {kmFinal}</Text>
           <View style={styles.containerFuncionarioData}>
                <View style={styles.viewIcon}>
                    <MaterialIcons name="person" size={20} color={isDarkMode? "black": "white" } />
                    <Text style={{color:isDarkMode? '#000': '#fff'}}>{funcionario}</Text>
                </View>
                <View style={styles.viewIcon}>
                    <MaterialIcons name="event" size={20} color={isDarkMode? "black": "white" } />
                    <Text style={{color:isDarkMode? '#000': '#fff'}}>{data}</Text>
                </View>
                
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:350,
        backgroundColor:'#fff',
        marginBottom:20,
        padding:20, 
        borderRadius:10,
        borderWidth:0.2
    },
    infoRodovia:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:10,
    },
    concluido:{
        color:'#2ecc71',
        paddingInline:'2',
        paddingBlock:'2',
        textAlign:'center',
        borderRadius:7,
        backgroundColor:'rgba(40, 204, 113, 0.08)'
    },
    containerFuncionarioData:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:10,
    },
    viewIcon:{
        flexDirection:'row',
        justifyContent:'center',
        gap:2,
        alignItems:'center'
    }
})