import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, EvilIcons } from '@expo/vector-icons';
import CampoConfig from '../Componentes/CompoConfig';
import auth from '../firebase';
import ModalCadastrar from '../Componentes/modalCadastrar'

export default function Perfil(props) {
    const [imagem, setImagem] = useState(null);
    const [loading, setLoading] = useState(false);
    const user = auth.currentUser;
    const defaultUser = 'https://i1.wp.com/terracoeconomico.com.br/wp-content/uploads/2019/01/default-user-image.png?ssl=1';

    useFocusEffect(() => {
        const fotoPerfil = auth.currentUser.providerData[0].photoURL;
        setImagem(fotoPerfil)
    })

    const LogOut = () => {
        auth.signOut().then(() => {
            props.navigation.navigate("Login");
        }).catch((error) => {
            console.error(error);
        });

    }

    return (
        <View style={styles.container}>
            <ModalCadastrar loading={loading} />
            <View style={styles.AbaNome}>
                <View style={styles.RowAbaNome}>
                    <ImageBackground style={{...styles.imgAbaNome, overflow: 'hidden'}} source={{uri: defaultUser}}>
                        <Image source={{ uri: imagem || defaultUser }} style={styles.imgAbaNome} />
                    </ImageBackground>
                    <Text style={styles.textAbaNome}>{user.displayName}</Text>
                </View>
            </View>
            <CampoConfig setLoading={setLoading} Tela="Notificacoes" navigation={props.navigation} size={30} tipoIcone={Feather} icone="bell" text1="Notificações" text2="Central de Notificações" />
            <CampoConfig setLoading={setLoading} Tela="Conta" navigation={props.navigation} size={36} tipoIcone={EvilIcons} icone="gear" text1="Conta" text2="Configurações de Conta" />
            <CampoConfig setLoading={setLoading} Tela="CadastrarCoisas" navigation={props.navigation} size={30} tipoIcone={Feather} icone="clipboard" text1="Cadastrar" text2={`Cadastrar restaurantes e \nmercados`} />
            <View style={styles.PosSair}>
                <View style={styles.BordaSair} />
                <TouchableOpacity onPress={() => LogOut()} style={styles.btnSair}>
                    <Text style={styles.textSair}>SAIR</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnSair: {
        width: 80
    },
    textSair: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 20,
    },
    BordaSair: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1
    },
    PosSair: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    AbaNome: {
        height: 121,
        elevation: 5,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    imgAbaNome: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 35
    },
    RowAbaNome: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
        marginLeft: 30
    },
    textAbaNome: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 21
    }
})