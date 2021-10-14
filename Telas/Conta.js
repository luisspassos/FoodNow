import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';

export default function Conta(propsN) {
    const Trocas = (props)=> {
        return(
            <TouchableOpacity onPress={()=> props.icone == "user" ? propsN.navigation.navigate("TrocarFoto") : propsN.navigation.navigate("Trocar", {text1: props.text1, text2: props.text2, textVazio1: props.textVazio1, textVazio2: props.textVazio2, type: props.type})}>
                <View style={styles.ViewTroca}>
                    <Text style={styles.textTrocar}>TROCAR {props.tipo}</Text>
                    <props.tipoIcone name={props.icone} size={30} color="#A18E85" />
                </View>
            </TouchableOpacity>
        )
    }

    return(
        <View style={styles.container}>
            <Trocas type="email-address" textVazio1="Novo email está vazio!" textVazio2="Confirmar novo email está vazio!" text1="Novo email" text2="Confirmar novo email" tipoIcone={Feather} icone="mail" tipo="EMAIL"/>
            <Trocas tipoIcone={AntDesign} icone="user" tipo="FOTO DE PERFIL"/>
            <Trocas type="default" textVazio1="Nova senha está vazia!" textVazio2="Confirmar nova senha está vazia!" text1="Nova senha" text2="Confirmar nova senha" tipoIcone={Ionicons} icone="key-outline" tipo="SENHA"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    ViewTroca: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20
    },
    textTrocar: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        fontSize: 20,
        paddingRight: 20
    }
})