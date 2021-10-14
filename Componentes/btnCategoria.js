import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BtnCategoria(props) {
    return (
            <TouchableOpacity onPress={()=> props.navigation.navigate("Categoria", {name: props.text.toUpperCase()})}>
                <View style={styles.CategoriaProduto}>
                    <props.tipoIcone name={props.icon} size={36} color="#A18E85" />
                    <Text style={styles.textProduto}>{props.text}</Text>
                </View>
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    
    CategoriaProduto: {
        width: 108,
        height: 108,
        borderColor: '#A18E85',
        borderWidth: 1,
        marginTop: 28,
        marginRight: 13,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    textProduto: {
        color: '#A18E85',
        fontSize: 18
    },
    
})