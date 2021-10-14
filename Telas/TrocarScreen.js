import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Keyboard } from 'react-native';
import auth from '../firebase';
import ModalAviso from '../Componentes/ModalAviso'
import ModalCadastrar from '../Componentes/modalCadastrar';

export default function Trocar(props) {

    const Toast = (mensagem) => {
        ToastAndroid.showWithGravity(
            mensagem,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        );
    };

    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [textModal, setTextModal] = useState('');
    const [loading, setLoading] = useState(false);

    const Trocar = () => {

        Keyboard.dismiss();
        const user = auth.currentUser;

        if (text1 === '') { return Toast(props.route.params.textVazio1) };
        if (text2 === '') { return Toast(props.route.params.textVazio2) };
        if (text1 !== text2) { return Toast('Cheque suas credenciais novamente.') }

        setLoading(true);

        if (props.route.params.text1 == 'Novo email') {
            user.updateEmail(text1).then(() => {
                setShowModal(true)
                setTextModal('Email atualizado com sucesso!')
                setLoading(false);
            }).catch((e) => {
                console.log(e.code)
                const errEmail = {
                    'auth/email-already-in-use': 'Este email ja está sendo utilizado por outra conta.',
                    'auth/invalid-email': 'Email inválido.',
                    'auth/requires-recent-login': 'Relogue novamente para tentar esta ação.',
                    default: 'Erro.'
                }
                setTextModal(errEmail[e.code] || errEmail.default)
                setShowModal(true)
                setLoading(false);
            })
        } else {
            user.updatePassword(text1).then(() => {
                setShowModal(true)
                setTextModal('Senha atualizada com sucesso!')
                setLoading(false);
            }).catch((e) => {
                console.log(e.code)
                const errSenha = {
                    'auth/weak-password': 'Senha curta.',
                    'auth/requires-recent-login': 'Relogue novamente para tentar essa ação.',
                    default: 'Erro.'
                }
                setTextModal(errSenha[e.code] || errSenha.default)
                setShowModal(true)
                setLoading(false);
            });

        }
    }

    return (
        <View style={styles.apenasFlex}>
            {showModal ? <ModalAviso lugares TextModal={textModal} setShowModal={setShowModal} showModal={showModal} /> : null
            }
            <View pointerEvents={showModal ? "none" : "auto"} style={styles.container}>
                <ModalCadastrar loading={loading} />
                <View style={styles.Troca}>
                    <TextInput keyboardType={props.route.params.type} secureTextEntry={props.route.params.text1 == 'Novo email' ? false : true} onChangeText={text => setText1(text.trim())} placeholder={`${props.route.params.text1}...`} placeholderTextColor="#A18E85" style={styles.inputTroca} />
                </View>
                <View style={styles.Troca}>
                    <TextInput keyboardType={props.route.params.type} secureTextEntry={props.route.params.text1 == 'Novo email' ? false : true} onChangeText={text => setText2(text.trim())} placeholder={`${props.route.params.text2}...`} placeholderTextColor="#A18E85" style={styles.inputTroca} />
                </View>
                <TouchableOpacity onPress={() => Trocar()} style={styles.btnTrocar}><Text style={styles.TextTrocar}>TROCAR</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    apenasFlex: {
        flex: 1
    },
    btnTrocar: {
        backgroundColor: '#ED3E3E',
        width: 377,
        height: 57,
        margin: 10,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextTrocar: {
        color: 'white',
        fontFamily: 'Roboto_700Bold',
        fontSize: 18
    },
    container: {
        flex: 0.8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Troca: {
        width: 377,
        height: 57,
        borderColor: '#A18E85',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 10
    },
    inputTroca: {
        width: 377,
        height: 57,
        borderRadius: 10,
        paddingLeft: 13,
        fontSize: 17
    }

})