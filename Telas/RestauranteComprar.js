import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Modal, TouchableNativeFeedback, Pressable, ToastAndroid } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import ComponenteProduto from '../Componentes/componenteProduto';
import { db } from '../firebase'
import auth from '../firebase'

export default function Restaurante(props) {

    const [cadastrados, setCadastrados] = useState([]);
    const [carregarCadastros, setCarregarCadastros] = useState(true);
    const [modal, setModal] = useState(false);
    const [exists, setExists] = useState(false);

    const userEmail = auth.currentUser.providerData[0].email;

    const Toast = (mensagem) => {
        ToastAndroid.showWithGravity(
            mensagem,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        );
    };

    useEffect(() => {
        db.collection('Cadastros').doc(props.route.params.idLugar).get().then(doc => {
            if (!doc.exists) {
                setExists(true);
            } else {
                if (props.route.params.email == userEmail) {
                    Toast(`Para cadastrar produtos, clique nos três pontos e depois em "Cadastrar Produtos".`)
                }
            }
        })
    }, [])

    useEffect(() => {
        const unsub = db.collection('Cadastros').doc(props.route.params.idLugar).collection('Produto').onSnapshot(snapshot => {
            if (snapshot.docs == '') {
                setCarregarCadastros(false)
            }
            setCadastrados(snapshot.docs.map(val => {
                return {
                    id: val.id,
                    data: val.data()
                }
            }))
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (cadastrados != '') {
            setCarregarCadastros(false)
        }
    }, [cadastrados])

    const BtnBack = () => {
        return (
            <TouchableNativeFeedback onPress={() => props.navigation.goBack()} background={TouchableNativeFeedback.Ripple('#ed3e3e', true, 33)}>
                <View style={styles.btnVoltar}>
                    <AntDesign style={styles.colorBtnVoltar} name="left" size={29} color="#ed3e3e" />
                </View>
            </TouchableNativeFeedback>
        )
    }

    const BtnSearch = () => {
        return (
            <TouchableNativeFeedback onPress={() => props.navigation.navigate("BuscaProdutos", { cadastrados: cadastrados, img: props.route.params.img, name: props.route.params.name, tipo: props.route.params.tipo, entrega: props.route.params.entrega, idLugar: props.route.params.idLugar, email: props.route.params.email })} background={TouchableNativeFeedback.Ripple('#A18E85', true)}>
                <View style={styles.rippleBtnSearch}>
                    <AntDesign name="search1" size={27} color="#A18E85" />
                </View>
            </TouchableNativeFeedback>
        )
    }

    if (carregarCadastros) {
        return (
            <ScrollView contentContainerStyle={styles.ApenasFlex}>
                <View style={styles.spaceDown}>
                    <Image source={{ uri: props.route.params.img }} style={styles.imagemRestaurante} />
                    <BtnBack />
                    <View style={styles.ConfigRestaurante}>
                        <Text style={styles.textRestaurante}>{props.route.params.name}</Text>
                        <View style={styles.styleIcones}>
                            <BtnSearch />
                        </View>
                    </View>
                </View>
                <View style={styles.centerIndicator}>
                    <ActivityIndicator color="#ed3e3e" size={70} />
                </View>
            </ScrollView>
        )
    } else {
        return (
            <ScrollView>
                <View style={styles.spaceDown}>
                    <Modal
                        transparent
                        visible={modal}
                        animationType="none"
                        onRequestClose={() => setModal(false)}
                    >
                        <Pressable style={styles.outsideModal}
                            onPress={() => setModal(false)}
                        />
                        <TouchableNativeFeedback onPress={() => { props.navigation.navigate("CadastrarProdutos", { name: props.route.params.name, entrega: props.route.params.entrega, idLugar: props.route.params.idLugar }); setModal(false) }}>
                            <View style={styles.ModalCadastrar}><Text style={styles.textCadastrar}>Cadastrar Produtos</Text></View>
                        </TouchableNativeFeedback>
                    </Modal>
                    <Image source={{ uri: props.route.params.img }} style={styles.imagemRestaurante} />
                    <BtnBack />
                    <View style={styles.ConfigRestaurante}>
                        <Text style={styles.textRestaurante}>{props.route.params.name}</Text>
                        <View style={styles.styleIcones}>
                            {
                                props.route.params.email == userEmail && !exists
                                    ?
                                    <TouchableNativeFeedback onPress={() => setModal(true)} background={TouchableNativeFeedback.Ripple('#A18E85', true)}>
                                        <View style={{ ...styles.rippleBtnSearch, marginHorizontal: 0 }}>
                                            <FontAwesome5 name="ellipsis-v" size={27} color="#A18E85" />
                                        </View>
                                    </TouchableNativeFeedback>
                                    : 
                                    null
                            }
                            <BtnSearch />
                        </View>
                    </View>
                    <View style={styles.centerCadastros}>
                        {exists
                            ?
                            <Text style={styles.textOps}>Opss, parece que este estabelecimento não está mais disponível.</Text>
                            :
                            cadastrados.map((val, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <ComponenteProduto idProduto={val.id} idLugar={props.route.params.idLugar} imgLugar={props.route.params.img} nomeLugar={props.route.params.name} tipoCate={props.route.params.tipo} navigation={props.navigation} entrega={props.route.params.entrega} img={val.data.imagem} nome={val.data.id} tipo={`R$ ${val.data.preço}`} email={props.route.params.email} preço={val.data.preçoData} />
                                    </React.Fragment>
                                )
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    textOps: {
        padding: 20,
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        fontSize: 20
    },
    centerCadastros: {
        alignItems: 'center'
    },
    rippleBtnSearch: {
        height: 34,
        width: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    spaceDown: {
        marginBottom: 20
    },
    ApenasFlex: {
        flex: 1
    },
    centerIndicator: {
        flex: 1,
        justifyContent: 'center'
    },
    textCadastrar: {
        color: 'white',
        fontFamily: 'Roboto_700Bold',
        fontSize: 17
    },
    ModalCadastrar: {
        position: "absolute",
        backgroundColor: '#666565',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        marginTop: 290,
        marginLeft: 135
    },
    outsideModal: {
        width: '100%',
        height: '100%',
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
    styleIcones: {
        flexDirection: 'row'
    },
    imagemRestaurante: {
        width: '100%',
        height: 270,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40
    },
    ConfigRestaurante: {
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
    },
    colorBtnVoltar: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 5
    }
})

