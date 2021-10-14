import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { KeyboardAvoider } from 'rn-keyboard-avoider';
import auth from '../firebase'
import ModalAviso from '../Componentes/ModalAviso';
import styles from '../Estilos/StylesCadastro'
import MCarregamento from '../Componentes/ModalCarregamento'

export default function Cadastro(props) {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [ModalCarregamento, setModalCarregamento] = useState(false);
    const [TextModal, setTextModal] = useState('');

    const ToastCadastrar = (mensagem) => {
        ToastAndroid.showWithGravity(
            mensagem,
            ToastAndroid.LONG,
            ToastAndroid.SHORT
        );
    };

    const Cadastrar = () => {

        if (nome === "") { return ToastCadastrar('Seu nome está vazio!') }
        if (email === "") { return ToastCadastrar('Seu email está vazio!') }
        if (senha === "") { return ToastCadastrar('Sua senha está vazia!') }
        if (confirmSenha === "") { return ToastCadastrar('Confirmar Senha está vazia!') }
        if (confirmSenha !== senha) { return ToastCadastrar('Verifique sua senha novamente.') }

        setModalCarregamento(true)

        auth.createUserWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                let user = userCredential.user;
                user.updateProfile({
                    displayName: nome
                }).then(() => {
                    // Cadastrado
                }).catch((e) => {
                    console.error(e)
                })

            })
            .catch((error) => {
                var errorCode = error.code;
                let erros = {
                    "auth/invalid-email": "Email inválido!",
                    "auth/email-already-in-use": "Conta já existente!",
                    "auth/weak-password": "Senha fraca!",
                    default: "Erro!"
                }
                setTextModal(erros[errorCode] || erros.default);
                console.error(errorCode);
                setShowModal(true);
                setModalCarregamento(false);
            });

    }

    return (
        <KeyboardAvoider yOffset={38}>
            {showModal ? <ModalAviso showModal={showModal} TextModal={TextModal} setShowModal={setShowModal} /> : null}
            {ModalCarregamento ? <MCarregamento ModalCarregamento={ModalCarregamento} texto="Cadastrando..." /> : null}
            <View pointerEvents={showModal || ModalCarregamento ? "none" : "auto"} style={styles.ViewPrincipal}>
                <View style={styles.ViewImgLogo}>
                    <Image source={require('../assets/LogoLogin.png')} style={styles.imgLogoLogin} />
                </View>
                <View style={styles.ViewLogin}>
                    <View style={styles.BackLogin}>

                        <View style={styles.CenterTextCupon}>
                            <Text style={styles.TextCupom}>Peça comida e supermercado</Text>
                            <Text style={{ ...styles.TextCupom, marginTop: -5 }}>em segundos!</Text>
                        </View>

                        <View>
                            <Text style={styles.TextEmail}>Nome</Text>
                            <TextInput maxLength={19} onChangeText={text => setNome(text.trim())} placeholderTextColor="#A18E85" placeholder="Seu nome..." style={styles.InputEmail}></TextInput>
                        </View>
                        <View>
                            <Text style={styles.TextEmail}>Email</Text>
                            <TextInput keyboardType="email-address" onChangeText={text => setEmail(text.trim())} placeholderTextColor="#A18E85" placeholder="Seu email..." style={styles.InputEmail}></TextInput>
                        </View>
                        <View>
                            <Text style={styles.TextEmail}>Senha</Text>
                            <TextInput secureTextEntry={true} onChangeText={text => setSenha(text.trim())} placeholderTextColor="#A18E85" placeholder="Sua senha..." style={styles.InputEmail}></TextInput>
                        </View>
                        <View>
                            <Text style={styles.TextEmail}>Confirmar senha</Text>
                            <TextInput secureTextEntry={true} onChangeText={text => setConfirmSenha(text.trim())} placeholderTextColor="#A18E85" placeholder="Confirmar senha..." style={styles.InputEmail}></TextInput>
                        </View>
                        <TouchableOpacity onPress={() => Cadastrar()} style={styles.btnEntrar}><Text style={styles.TextEntrar}>CADASTRAR</Text></TouchableOpacity>
                        <View style={styles.PosCriarConta}>
                            <Text style={styles.criarConta}>Faça</Text>
                            <TouchableOpacity onPress={() => props.navigation.goBack()}><Text style={{ ...styles.criarConta, fontFamily: 'Roboto_700Bold' }}> Login.</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoider>
    )
}

