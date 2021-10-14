import React from 'react';
import { View, Text, StyleSheet, Image, TouchableNativeFeedback, ImageBackground } from 'react-native';
import auth from '../firebase'

export default function ComponenteProduto(props) {

    const user = auth.currentUser.providerData[0].email;

    const BodyProduto = () => {
        return (
            <View style={styles.posItensProduto}>
                <ImageBackground style={styles.imgComp} source={{ uri: 'https://149361159.v2.pressablecdn.com/wp-content/uploads/2021/01/placeholder.png' }}>
                    <Image source={{ uri: props.img }} style={styles.imgComp} />
                </ImageBackground>
                <View style={styles.marginText}>
                    <Text style={styles.tituloComp}>{props.nome}</Text>
                    <Text style={styles.textComp}>Entrega: {props.entrega[0]}min - {props.entrega[1]}min</Text>
                    <Text style={styles.textComp}>{props.tipo}</Text>
                </View>
            </View>
        )
    }

    if (props.id) {
        return (
            <View style={{ ...styles.ComponenteProduto, marginTop: 20, elevation: 3 }}>
                <BodyProduto />
                {
                    props.email == user && props.id == "CadastroProduto"
                        ?
                        <TouchableNativeFeedback onPress={() => props.navigation.navigate(props.tipo.indexOf("$") != -1 ? "EditarProdutos" : "Editar", { nome: props.nome, entrega: props.entrega, tipo: props.tipo, img: props.img, preço: props.preço, nomeLugar: props.nomeLugar, idLugar: props.idLugar, idProduto: props.idProduto })}>
                            <View style={styles.btnEditar}>
                                <Text style={styles.textBtnEditar}>EDITAR</Text>
                            </View>
                        </TouchableNativeFeedback>
                        :
                        null
                }
            </View>
        )
    } else {
        return (
            <View style={styles.borderFeedback}>
                <TouchableNativeFeedback onPress={() => props.tipo.indexOf("$") == -1 ? props.navigation.navigate("RestauranteComprar", { name: props.nome.substr(0, 15), img: props.img, entrega: props.entrega, tipo: props.tipo, email: props.email, idLugar: props.idLugar }) : props.navigation.navigate("ComprarProdutos", { img: props.img, nome: props.nome, preço: props.tipo, entrega: props.entrega, tipo: props.tipoCate, nomeLugar: props.nomeLugar, imgLugar: props.imgLugar, email: props.email, idLugar: props.idLugar })}>
                    <View style={styles.ComponenteProduto}>
                        <BodyProduto />
                        {
                            props.email == user
                                ?
                                <TouchableNativeFeedback onPress={() => props.navigation.navigate(props.tipo.indexOf("$") != -1 ? "EditarProdutos" : "Editar", { nome: props.nome, entrega: props.entrega, tipo: props.tipo, img: props.img, preço: props.preço, nomeLugar: props.nomeLugar, idLugar: props.idLugar, idProduto: props.idProduto })}>
                                    <View style={styles.btnEditar}>
                                        <Text style={styles.textBtnEditar}>EDITAR</Text>
                                    </View>
                                </TouchableNativeFeedback>
                                :
                                null
                        }
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    textBtnEditar: {
        color: 'white',
        fontFamily: 'Roboto_700Bold'
    },
    btnEditar: {
        backgroundColor: '#ED3E3E',
        width: 70,
        height: 30,
        position: 'absolute',
        left: 290,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    posItensProduto: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    marginText: {
        marginLeft: 10
    },
    borderFeedback: {
        overflow: 'hidden',
        borderRadius: 5,
        elevation: 3,
        marginTop: 15
    },
    ComponenteProduto: {
        backgroundColor: 'white',
        width: 377,
        height: 120,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },

    imgComp: {
        height: 120,
        width: 137,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    tituloComp: {
        fontFamily: 'Roboto_700Bold',
        color: '#705E55',
        fontSize: 17
    },
    textComp: {
        fontFamily: 'Roboto_400Regular',
        color: '#A18E85',
        fontSize: 16
    },
})