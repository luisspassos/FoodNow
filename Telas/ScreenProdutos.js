import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, ImageBackground } from 'react-native';
import BtnCategoria from '../Componentes/btnCategoria'
import ComponenteProduto from '../Componentes/componenteProduto';
import { db } from '../firebase'
import auth from '../firebase'

export default function ScreenProdutos(props) {
    const [cadastros, setCadastros] = useState([]);
    const [carregarCadastros, setCarregarCadastros] = useState(false);
    const [ultimosPedidos, setUltimosPedidos] = useState([]);

    const userEmail = auth.currentUser.providerData[0].email;

    useEffect(() => {
        const unsub = db.collection("Pedidos").orderBy("timestamp", "desc").where("tipo", "in", props.arrayTipos).where("email", "==", userEmail).limit(10).onSnapshot(snapshot => {
            if (snapshot.docs == '') {
                setCarregarCadastros(false)
            }
            setUltimosPedidos(snapshot.docs.map(val => {
                return {
                    data: val.data()
                }
            }))
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        setCarregarCadastros(true)
        const unsub = db.collection('Cadastros').where("tipo", "in", props.arrayTipos).onSnapshot(snapshot => {
            if (snapshot.docs == '') {
                setCarregarCadastros(false)
            }
            setCadastros(snapshot.docs.map(val => {
                return {
                    id: val.id,
                    data: val.data()
                }
            }))
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (cadastros != '' && ultimosPedidos != '') {
            setCarregarCadastros(false)
        }
    }, [cadastros])

    return (

        < View style={styles.container} >
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <View style={styles.categorias}>
                        {
                            props.iconsCategoria.map((val, i) => {
                                return (
                                    <React.Fragment key={`arrayElement${i}`}>
                                        <BtnCategoria navigation={props.navigation} text={val.text} icon={val.icon} tipoIcone={val.tipoIcone} />
                                    </React.Fragment>)
                            })
                        }

                    </View>
                </ScrollView>
            </View>
            {

                ultimosPedidos != ''
                    ?
                    <Text style={styles.ultimosPedidosText}>Últimos Pedidos</Text>
                    :
                    null
            }
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.spaceLeftCarrosel}>

                    <View style={styles.rowCarrsoel}>
                        {
                            ultimosPedidos.map((val, i) => {

                                return (
                                    <React.Fragment key={`arrayElement${i}`}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate("RestauranteComprar", { name: val.data.nomeLugar, img: val.data.imgLugar, entrega: val.data.entrega, tipo: val.data.tipo, email: val.data.emailLugar, idLugar: val.data.idLugar })}>
                                            <ImageBackground style={{ ...styles.imgUltPedidos, overflow: 'hidden' }} source={{ uri: 'https://149361159.v2.pressablecdn.com/wp-content/uploads/2021/01/placeholder.png' }}>
                                                <Image source={{ uri: val.data.imgLugar }} style={styles.sizeImgPedidos} />
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </React.Fragment>
                                )

                            })
                        }
                    </View>
                </ScrollView>
            </View>
            {
                carregarCadastros
                    ?
                    <View style={styles.centerIndicator}>
                        <ActivityIndicator color="#ED3E3E" size={70} />
                    </View>
                    :
                    <ScrollView style={styles.spaceTopScroll} contentContainerStyle={styles.centerComp}>
                        <View style={styles.spaceBottomScroll}>
                            {
                                cadastros.map((val, i) => {
                                    return (
                                        <React.Fragment key={`arrayElement${i}`}>
                                            <ComponenteProduto idLugar={val.id} email={val.data.email} navigation={props.navigation} img={val.data.imagem} nome={val.data.id} entrega={val.data.entrega} tipo={val.data.tipo} />
                                        </React.Fragment>
                                    )
                                })
                            }

                        </View>
                    </ScrollView>
            }

        </View >

    )
}

const styles = StyleSheet.create({
    sizeImgPedidos: { 
        width: 70, 
        height: 70 
    },
    spaceBottomScroll: {
        marginBottom: 10
    },
    spaceTopScroll: {
        marginTop: 5
    },
    spaceLeftCarrosel: {
        marginLeft: 13
    },
    rowCarrsoel: {
        flexDirection: 'row',
        marginRight: 17,
    },
    imgUltPedidos: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 7
    },
    categorias: {
        flexDirection: 'row',
        marginLeft: 17,
    },
    centerIndicator: {
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    ultimosPedidosText: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 26,
        paddingTop: 13,
        paddingLeft: 13,
        marginBottom: 10
    },
    centerComp: {
        alignItems: 'center',
    }

})