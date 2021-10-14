import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import auth from '../firebase';
import * as firebase from 'firebase';

export default function Notificacoes() {

    const refNoticacoes = db.collection("Notificações");
    const userId = auth.currentUser.uid;

    const [notifications, setNotifications] = useState([]);
    const [carregarNotifications, setCarregarNotifications] = useState(false);

    useEffect(()=> {
        refNoticacoes.get().then(snapshot => {
            snapshot.forEach(val => {
                refNoticacoes.doc(val.id).update({
                    ids: firebase.firestore.FieldValue.arrayUnion(userId)
                })
            })
        })
    }, [])

    useEffect(() => {
        setCarregarNotifications(true);
        refNoticacoes.orderBy("timestamp", "desc").onSnapshot(snapshot => {
            if (snapshot.docs == '') {
                setCarregarNotifications(false);
            }
            setNotifications(snapshot.docs.map(val => {
                return {
                    text1: val.data().text1,
                    text2: val.data().text2
                }
            }))
        })
    }, [])

    useEffect(() => {
        if (notifications != '') {
            setCarregarNotifications(false);
        }
    }, [notifications])

    if (carregarNotifications) {
        return (
            <View style={{ ...styles.container, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#ED3E3E" size={80} />
            </View>
        )
    } else {
        return (
            <ScrollView style={styles.container}>
                {
                    notifications.map((val, i) => {
                        return (
                            <React.Fragment key={i}>
                                <View style={styles.Notificacao}>
                                    <Text style={styles.Titulo}>{val.text1}</Text>
                                    <Text style={styles.text}>{val.text2}</Text>
                                </View>
                            </React.Fragment>
                        )
                    })
                }


            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    Notificacao: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1,
        height: 150,
        padding: 20,
    },
    Titulo: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 24
    },
    text: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 19,
        color: '#A18E85'
    }
})