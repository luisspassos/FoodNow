import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import auth from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import ModalCadastrar from '../Componentes/modalCadastrar';

export default function TrocarFoto() {

    const user = auth.currentUser;
    const fotoPerfil = user.providerData[0].photoURL;
    const defaultUser = 'https://i1.wp.com/terracoeconomico.com.br/wp-content/uploads/2019/01/default-user-image.png?ssl=1'
    const [imagem, setImagem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refLoading, setRefLoading] = useState(false);

    useEffect(() => {
        setImagem(fotoPerfil)
    }, [])


    const Btns = (props) => {
        return (
            <View style={styles.ViewTroca}>
                <Text style={styles.textTrocar}>{props.text}</Text>
            </View>
        )
    }

    const getPictureBlob = (img) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", img, true);
            xhr.send(null);
        });
    };

    const SelecionarFoto = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setLoading(true);
            addFoto(result.uri);
        }
    }

    const addFoto = async (img) => {
        let blob;
        try {
            blob = await getPictureBlob(img);
            const ref = await storage.ref().child(`images/${img.split('/').pop().split('.').shift()}`);
            const snapshot = await ref.put(blob);
            snapshot.ref.getDownloadURL().then(url => {
                user.updateProfile({
                    photoURL: url
                })
                setImagem(url)
            })
        } catch (e) {
            console.error(e);
        } finally {
            blob.close();
            setRefLoading(true)
        }
    }

    const resetarFoto = () => {
        user.updateProfile({
            photoURL: defaultUser
        })
        setImagem(defaultUser)
    }

    return (
    
            <View style={styles.container}>
                <ModalCadastrar loading={loading} />
                <Image onLoadEnd={()=> refLoading ? setLoading(false) : null} source={{ uri: imagem || defaultUser }} style={styles.imgPerfil} />
                <View style={styles.posBtns}>
                    <TouchableOpacity onPress={() => SelecionarFoto()}>
                        <Btns text="SELECIONAR FOTO" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => resetarFoto()}>
                        <Btns text="RESETAR FOTO" />
                    </TouchableOpacity>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    posBtns: {
        alignItems: 'center',
        marginTop: 30
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center'
    },
    imgPerfil: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: 20
    },
    ViewTroca: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    textTrocar: {
        color: '#e07446',
        fontFamily: 'Roboto_700Bold',
        fontSize: 20,
        paddingRight: 20
    }
})