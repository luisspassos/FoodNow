import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { db } from '../firebase';
import ModalAviso from '../Componentes/ModalAviso'
import * as firebase from 'firebase';
import MCarregamento from '../Componentes/ModalCarregamento';
import auth from '../firebase';

export default function ComprarProduto(props) {
    const [showModal, setShowModal] = useState(false);
    const [textModal, setTextModal] = useState('');
    const [modalCarregamento, setModalCarregamento] = useState(false);

    const userEmail = auth.currentUser.providerData[0].email;

    const Comprar = () => {
        setModalCarregamento(true);
        db.collection('Pedidos').add({
            idLugar: props.route.params.idLugar,
            nome: props.route.params.nome,
            nomeLugar: props.route.params.nomeLugar,
            tipo: props.route.params.tipo,
            img: props.route.params.img,
            entrega: props.route.params.entrega,
            imgLugar: props.route.params.imgLugar,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            email: userEmail,
            emailLugar: props.route.params.email
        }).then(e => {
            setModalCarregamento(false);
            setTextModal("Comprado com sucesso! Cheque a aba de pedidos.")
            setShowModal(true)
        }).catch(e => {
            setModalCarregamento(false);
            setTextModal("Erro ao comprar!")
            setShowModal(true)
        })
    }

    return(
        <View style={styles.apenasFlex}>
            {showModal ? <ModalAviso TextModal={textModal} setShowModal={setShowModal} showModal={showModal} /> : null
            }
            {modalCarregamento ? <MCarregamento texto="Pedindo..." ModalCarregamento={modalCarregamento} /> : null}
            <View pointerEvents={showModal || modalCarregamento ? "none" : "auto"} style={styles.container}>
                <Image source={{uri: props.route.params.img}} style={styles.imagemDestaque} />
                <TouchableNativeFeedback onPress={() => props.navigation.goBack()} background={TouchableNativeFeedback.Ripple('#ed3e3e', true, 33)}>
                    <View style={styles.btnVoltar}>
                        <AntDesign style={styles.colorBtnVoltar} name="left" size={29} color="#ed3e3e" />
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.Config}>
                    <Text style={styles.textRestaurante}>{props.route.params.nome}</Text>
                </View>
                <View style={styles.ViewInfos}>
                    <Text style={styles.textInfo}>{props.route.params.preço}.</Text>
                    <Text style={styles.textInfo}>Tempo de Entrega: {props.route.params.entrega[0]}min - {props.route.params.entrega[1]}min</Text>
                </View>
                <View style={styles.posBtnComprar}>
                    <TouchableOpacity onPress={()=> Comprar()} style={styles.btnPrincipal}><Text style={styles.TextBtnPrincipal}>COMPRAR</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    apenasFlex: {
        flex: 1
    },
    colorBtnVoltar: {
        backgroundColor: 'white', 
        borderRadius: 25, 
        padding: 5
    },
    btnVoltar: {
        height: 70,
        width: 70,
        position: 'absolute',
        top: 30,
        left: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    posBtnComprar: {
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 0.9
    },
    btnPrincipal: {
        backgroundColor: '#ED3E3E',
        width: 370,
        height: 50,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    TextBtnPrincipal: {
        color: 'white',
        fontFamily: 'Roboto_700Bold',
        fontSize: 16
    },
    textInfo: {
        color: '#705E55',
        fontFamily: 'Roboto_700Bold',
        fontSize: 19
    },
    ViewInfos: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 0.6,
        padding: 20
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    imagemDestaque: {
        width: '100%',
        height: 270,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40
    },
    Config: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#A18E85',
        borderBottomWidth: 0.6,
        alignItems: 'center'
    },
    textRestaurante: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        fontSize: 27
    }
})