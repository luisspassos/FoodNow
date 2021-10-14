import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';
import ComponenteProduto from '../Componentes/componenteProduto';
import { db } from '../firebase';

export default function Busca(props) {

    const [cadastrados, setCadastrados] = useState([]);
    const [carregarBuscas, setCarregarBuscas] = useState(true);
    const [textBuscar, setTextBuscar] = useState('');

    const refBuscar = props.tipo == "Produtos" ? db.collection('Cadastros').doc(props.route.params.idLugar).collection("Produto") : db.collection('Cadastros');

    useEffect(() => {
        const unsub = refBuscar.onSnapshot(snapshot => {
            if(snapshot.docs == '') {
                setCarregarBuscas(false)
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
            setCarregarBuscas(false)
        }
    }, [cadastrados])

    const filtrarBusca = cadastrados.filter(val => {
        if (val.data.id.toLowerCase().includes(textBuscar.toLowerCase())) { return val }
    })

    if (!carregarBuscas) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.Scroll}>
                    <View style={props.tipo == "Produtos" ? {...styles.Busca, marginTop: 20} : styles.Busca}>
                        <AntDesign style={styles.iconBusca} name="search1" size={30} color="black" />
                        <TextInput onChangeText={text => setTextBuscar(text.trim())} placeholder="Procure..." placeholderTextColor="#A18E85" style={styles.inputBusca} />
                    </View>
                    <View style={styles.marginBuscas}>
                        {
                            filtrarBusca.map((val, i) => {
                                return (
                                    props.tipo == "Produtos"
                                    ?
                                    <React.Fragment key={`arrayElement${i}`}>
                                        <ComponenteProduto idProduto={val.id} idLugar={props.route.params.idLugar} imgLugar={props.route.params.img} nomeLugar={props.route.params.name} tipoCate={props.route.params.tipo} navigation={props.navigation} entrega={props.route.params.entrega} img={val.data.imagem} nome={val.data.id} tipo={`R$ ${val.data.preço}`} email={props.route.params.email} preço={val.data.preçoData} />
                                    </React.Fragment> || null
                                    :
                                    <React.Fragment key={`arrayElement${i}`}>
                                        <ComponenteProduto idLugar={val.id} email={val.data.email} navigation={props.navigation} img={val.data.imagem} nome={val.data.id} entrega={val.data.entrega} tipo={val.data.tipo} />
                                    </React.Fragment>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    } else {
        return (
            <View style={{ ...styles.container, alignItems: 'center' }}>
                <View style={styles.centerIndicator}>
                    <ActivityIndicator color="#ED3E3E" size={80} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    marginBuscas: { 
        marginBottom: 10, 
        marginTop: 10 
    },
    centerIndicator: {
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
    },
    Scroll: {
        alignItems: 'center',
    },
    iconBusca: {
        paddingLeft: 58,
    },
    Busca: {
        width: 377,
        height: 57,
        borderColor: '#A18E85',
        borderWidth: 1,
        marginTop: Constants.statusBarHeight + 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputBusca: {
        width: 377,
        height: 57,
        borderRadius: 10,
        paddingLeft: 13,
        fontSize: 17
    }
})