import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ComponenteProduto from '../Componentes/componenteProduto';
import { db } from '../firebase'
import auth from '../firebase';

function capitalize(word) {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
}

export default function ListaItens(props) {
    const [cadastros, setCadastros] = useState([]);
    const [carregarCadastros, setCarregarCadastros] = useState(false);

    const userEmail = auth.currentUser.providerData[0].email;

    useEffect(() => {
        setCarregarCadastros(true)
        const refBuscar = props.tipo == "Pedidos" ? db.collection('Pedidos').orderBy("timestamp", "desc") : db.collection('Cadastros').where("tipo", "==", capitalize(props.route.params.name))
        const unsub = refBuscar.onSnapshot(snapshot => {
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
        if (cadastros != '') {
            setCarregarCadastros(false)
        }
    }, [cadastros])

    if (carregarCadastros) {
        return (
            <View style={styles.ApenasFlex}>
                <View style={styles.centerIndicator}>
                    <ActivityIndicator color="#ED3E3E" size={80} />
                </View>
            </View>
        )
    } else {
        return (
            <ScrollView contentContainerStyle={styles.AlinharComps} style={styles.container}>
                <View style={props.tipo == "Pedidos" ? {...styles.marginProduto, marginTop: 30} : styles.marginProduto}>

                    {
                        props.tipo == "Pedidos" ?
                            cadastros.map((val, i) => {
                                if (val.data.email == userEmail) {
                                    return (
                                        <React.Fragment key={i}>
                                            <ComponenteProduto id={val.id} nome={val.data.nome} entrega={val.data.entrega} tipo={val.data.nomeLugar} img={val.data.img} />
                                        </React.Fragment>
                                    )
                                }

                            })
                            :
                            cadastros.map((val, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <ComponenteProduto idLugar={val.id} email={val.data.email} navigation={props.navigation} img={val.data.imagem} nome={val.data.id} entrega={val.data.entrega} tipo={val.data.tipo} />
                                    </React.Fragment>
                                )
                            })
                    }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    ApenasFlex: { 
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    AlinharComps: {
        alignItems: 'center',
    },
    centerIndicator: {
        flex: 1,
        justifyContent: "center"
    },
    marginProduto: {
        marginBottom: 20,
        marginTop: 5
    }
})