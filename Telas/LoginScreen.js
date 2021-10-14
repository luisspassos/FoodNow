import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator} from 'react-native';
import { KeyboardAvoider } from 'rn-keyboard-avoider';
import ModalAviso from '../Componentes/ModalAviso';
import MCarregamento from '../Componentes/ModalCarregamento';
import auth from '../firebase'

export default function Login(props) {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [TextModal, setTextModal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [ModalCarregamento, setModalCarregamento] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) { 
                setLoading(false);
                props.navigation.navigate("App")
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: "App" }]
                })
            } else {
                setLoading(false);
            }
        })
    }, [])

    const ToastLogin = (mensagem) => {
        ToastAndroid.showWithGravity(
            mensagem,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
        );
    };

    const Entrar = async () => {

        if (email === "") { return ToastLogin('Seu email está vazio!') }
        if (senha === "") { return ToastLogin('Sua senha está vazia!') }

        setModalCarregamento(true);

        auth.signInWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                setModalCarregamento(false);
                props.navigation.navigate("App")
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: "App" }]
                })
            })
            .catch((error) => {
                let errorCode = error.code;
                let erros = {
                    'auth/invalid-email': 'Email inválido!',
                    "auth/wrong-password": 'Senha incorreta!',
                    'auth/user-not-found': 'Usuário não encontrado!',
                    'auth/too-many-requests': 'Espere um momento para colocar a senha novamente!',
                    default: 'Erro!'
                }
                setTextModal(erros[errorCode] || erros.default)
                setShowModal(true)
                console.error(errorCode)
                setModalCarregamento(false);
            });

    }
    if (loading) {
        return (
            <View style={styles.centerIndicator}>
                <ActivityIndicator color="#ED3E3E" size={80} />
            </View>
        )
    } else {
        return (
            <KeyboardAvoider yOffset={38}>
                {showModal ? <ModalAviso showModal={showModal} TextModal={TextModal} setShowModal={setShowModal}/> : null}
                {ModalCarregamento ? <MCarregamento ModalCarregamento={ModalCarregamento} texto="Logando..."/> : null}
                <View pointerEvents={showModal || ModalCarregamento ? "none" : "auto"} style={styles.ViewPrincipal}>
                    <View style={styles.ViewImgLogo}>
                        <Image source={require('../assets/LogoLogin.png')} style={styles.imgLogoLogin} />
                    </View>
                    <View style={styles.ViewLogin} >
                        <View style={styles.BackLogin}>
                            <Text style={styles.TextCupom}>Ganhe cupons de graça!</Text>
                            <View>
                                <Text style={styles.TextInput}>Email</Text>
                                <TextInput keyboardType="email-address" onChangeText={text => setEmail(text.trim())} placeholderTextColor="#A18E85" placeholder="Seu email..." style={styles.InputPrincipal}></TextInput>
                            </View>
                            <View>
                                <Text style={styles.TextInput}>Senha</Text>
                                <TextInput secureTextEntry={true} onChangeText={text => setSenha(text.trim())} placeholderTextColor="#A18E85" placeholder="Sua senha..." style={styles.InputPrincipal}></TextInput>
                            </View>
                            <TouchableOpacity onPress={() => Entrar()} style={styles.btnEntrar}><Text style={styles.TextEntrar}>ENTRAR</Text></TouchableOpacity>
                            <View style={styles.ViewCriarConta}>
                                <Text style={styles.criarConta}>Não tem uma conta?</Text>
                                <TouchableOpacity onPress={() => props.navigation.navigate("Cadastro")}><Text style={{ ...styles.criarConta, fontFamily: 'Roboto_700Bold' }}> Cadastre-se!</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoider>

        )
    }
}

const styles = StyleSheet.create({
    centerIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ViewPrincipal: {
        flex: 1,
        backgroundColor: '#ED3E3E',
        justifyContent: 'center',
    },
    ViewImgLogo: {
        backgroundColor: '#ED3E3E',
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgLogoLogin: {
        width: 220,
        height: 220,
    },
    ViewLogin: {
        backgroundColor: '#ED3E3E',
        flex: 0.5,
    },
    BackLogin: {
        backgroundColor: '#FBEBEB',
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        alignItems: 'center'
    },
    TextCupom: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        fontSize: 20,
        paddingTop: 40
    },
    InputPrincipal: {
        backgroundColor: 'white',
        width: 370,
        height: 50,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 10,
        fontFamily: 'Roboto_400Regular',
    },
    TextInput: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        paddingTop: 20,
        paddingBottom: 4,
        fontSize: 16,
    },
    btnEntrar: {
        backgroundColor: '#ED3E3E',
        width: 370,
        height: 50,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    TextEntrar: {
        color: 'white',
        fontFamily: 'Roboto_700Bold',
        fontSize: 16
    },
    criarConta: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 18,
        color: '#A18E85',
    },
    ViewCriarConta: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
})