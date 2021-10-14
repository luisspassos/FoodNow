import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { db } from '../firebase';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import auth from '../firebase';

export default function CompoConfig(props) {

    const [isReady, setIsReady] = useState(false);
    const [tamanhoNotifications, setTamanhoNotifications] = useState(0);

    const userId = auth.currentUser.uid;
    const TipoIcone = props.tipoIcone;

    const margins = {
        "Conta": -3,
        "Cadastrar": 1,
        "Notificacoes": 0
    };

    useEffect(() => {
        const refNotificacion = db.collection('Notificações');

        refNotificacion.onSnapshot(snapshot => {
            const sizeNotifications = snapshot.size;
            refNotificacion.where("ids", "array-contains", userId).onSnapshot(ids => {
                setTamanhoNotifications(sizeNotifications - ids.size);
            })
        })
    }, [])

    const carregarIcone = async () => {
        const fontAssets = cacheFonts([TipoIcone.font]);

        await Promise.all([fontAssets]);
    }

    function cacheFonts(fonts) {
        return fonts.map(font => Font.loadAsync(font));
    }

    if(isReady == false) {
        return (
            <AppLoading
              startAsync={carregarIcone}
              onFinish={() => setIsReady(true)}
              onError={console.warn}
            />
          );
    }

    return (
        <TouchableOpacity onPress={() => {
            props.setLoading(true);
            // Timeout para o carregamento ser ativado
            setTimeout(() => {
                props.navigation.navigate(props.Tela)
                props.setLoading(false);
            }, 1)
        }}>
            <View style={styles.CompoConfig}>

                <TipoIcone style={{ marginLeft: margins[props.text1] }} name={props.icone} size={props.size} color="black" />
                <View style={props.text1 == "Conta" ? { ...styles.textosConfig, paddingLeft: 48 } : styles.textosConfig}>
                    <Text style={styles.text1config}>
                        {props.text1}
                    </Text>
                    <Text style={styles.text2config}>{props.text2}</Text>
                </View>
                <View style={styles.AlinharIconeRight}>
                    <AntDesign name="right" size={24} color="#A18E85" />
                    {
                        props.text1 == "Notificações" && tamanhoNotifications != 0
                            ?
                            <View style={styles.bolinhaNotificacao}>
                                <Text style={styles.textBolinhaNotificacao}>{tamanhoNotifications}</Text>
                            </View>
                            :
                            null
                    }

                </View>
            </View>
            <View style={styles.LinhaInferior}></View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    textBolinhaNotificacao: { 
        color: 'white', 
        fontFamily: 'Roboto_400Reular' 
    },
    bolinhaNotificacao: { 
        backgroundColor: '#ED3E3E', 
        width: 20, 
        height: 20, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 10, 
        marginRight: 5 
    },
    LinhaInferior: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1,
        width: '90%',
        alignSelf: 'center',
        marginTop: -3
    },
    AlinharIconeRight: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        flex: 1
    },
    text1config: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 19
    },
    text2config: {
        fontFamily: 'Roboto_400Regular',
        color: '#A18E85',
        fontSize: 15
    },
    textosConfig: {
        paddingLeft: 50,
    },
    CompoConfig: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20
    },
})

