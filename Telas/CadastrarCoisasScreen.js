import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import ComponenteProduto from '../Componentes/componenteProduto'
import { db } from '../firebase';
import * as firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker';
import ModalAviso from '../Componentes/ModalAviso';
import CurrencyInput from 'react-native-currency-input';
import auth from '../firebase';
import ModalCadastrar from '../Componentes/modalCadastrar';
import { storage } from '../firebase';
import PickerCatergorias from '../Componentes/PickerCatergorias';

export default function CadastrarCoisas(props) {

    const [nome, setNome] = useState('');
    const [min1, setMin1] = useState('');
    const [min2, setMin2] = useState('');
    const [preço, setPreço] = useState('');
    const [textPreço, setTextPreço] = useState('');
    const [tipo, setTipo] = useState('Pizza');
    const [imagem, setImagem] = useState(null);
    const [cadastrados, setCadastrados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [textModal, setTextModal] = useState('');
    const [refCadastrar, setRefCadastrar] = useState(false);
    const [carregarCadastros, setCarregarCadastros] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalTipo, setModalTipo] = useState(false);

    const userEmail = auth.currentUser.providerData[0].email;
    const tipos = ['Pizza', 'Brasileira', 'Lanches', 'Sorvetes', 'Produtos', 'Farmácia', 'Cervejas'];
    const placeholder = 'https://149361159.v2.pressablecdn.com/wp-content/uploads/2021/01/placeholder.png';

    useEffect(() => {
        if (refCadastrar) {
            setLoading(false);
            setTextModal(props.tipo == "Produtos" ? "Cadastrado com sucesso!" : `Cadastrado com sucesso! Para cadastrar produtos, clique no botão "Editar" ou vá até o restaurante e clique nos três pontos.`);
            setShowModal(true);
            setRefCadastrar(false);
        }
    }, [cadastrados])

    useEffect(() => {
        setCarregarCadastros(true)

        const refBuscar = props.tipo == "Produtos" ? db.collection('Cadastros').doc(props.route.params.idLugar).collection("Produto") : db.collection('Cadastros').orderBy("timestamp", "desc");

        const unsub = refBuscar.onSnapshot(snapshot => {
            if (snapshot.docs == '') {
                setCarregarCadastros(false)
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
            setCarregarCadastros(false)
        }
    }, [cadastrados])

    const filtrarCadastros = cadastrados.filter(val => {
        if (val.data.email == userEmail) {
            return val;
        }
    })

    const Toast = (mensagem) => {
        ToastAndroid.showWithGravity(
            mensagem,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
        );
    };

    const getPictureBlob = () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", imagem, true);
            xhr.send(null);
        });
    };

    const SelecionarImagem = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImagem(result.uri);
        }
    }

    const Cadastrar = async () => {
        const ifs = props.tipo == "Produtos" ? textPreço == "" : min1 == "" || min2 == "";
        const ifsText = props.tipo == "Produtos" ? "Preço está vazio!" : "Tempo de entrega faltando!";

        const refCadastro = props.tipo == "Produtos" ? db.collection('Cadastros').doc(props.route.params.idLugar).collection('Produto') : db.collection('Cadastros');
        const ids = cadastrados.map(val => val.data.id);
        console.log(ids);

        if (nome == "") { return Toast("Nome está vazio!") }
        if (ifs) { return Toast(ifsText) }
        if (imagem == null) { return Toast("Selecione uma imagem!") }
        if (+(min2) < +(min1)) { return Toast("Verifique o tempo de Entrega! (O mínimo está maior que o máximo.)") }

        setRefCadastrar(true);
        setLoading(true);

        if (ids.includes(nome)) {
            setLoading(false);
            setTextModal("Este cadastro já existe.");
            setShowModal(true);
        } else {
            let blob;
            try {
                blob = await getPictureBlob();
                const ref = await storage.ref().child(`images/${imagem.split('/').pop().split('.').shift()}`);
                const snapshot = await ref.put(blob);
                snapshot.ref.getDownloadURL().then(url => {
                    CadastrarStrings(url, refCadastro);
                })
            } catch (e) {
                console.error(e);
            } finally {
                blob.close();
            }
        }
    };

    const CadastrarStrings = (img, refCadastro) => {

        refCadastro.add(
            props.tipo == "Produtos"
                ?
                {
                    id: nome,
                    preço: textPreço,
                    preçoData: preço,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    email: userEmail,
                    imagem: img
                }
                :
                {
                    id: nome,
                    imagem: img,
                    entrega: [min1, min2],
                    tipo: tipo,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    email: userEmail
                }).then(() => {
                    // Cadastrado
                }).catch(e => {
                    console.error(e);
                    setLoading(false);
                    setTextModal("Erro ao cadastrar!");
                    setShowModal(true)
                })

    }
    return (
        <View style={styles.apenasFlex}>
            {showModal ? <ModalAviso lugares TextModal={textModal} setShowModal={setShowModal} showModal={showModal} /> : null
            }
            <View pointerEvents={showModal ? "none" : "auto"} style={styles.container}>
                <ModalCadastrar loading={loading} />
                <PickerCatergorias tipos={tipos} modalTipo={modalTipo} setModalTipo={setModalTipo} setTipo={setTipo} />
                <View style={styles.CampoNome}>
                    <TextInput maxLength={props.tipo == "Produtos" ? 19 : 15} onChangeText={text => setNome(text.trim())} placeholder={props.tipo == "Produtos" ? "Nome do Produto..." : "Nome do estabelecimento..."} placeholderTextColor="#A18E85" style={styles.inputNome}></TextInput>
                </View>
                <View style={styles.CampoEntrega}>
                    <Text style={styles.textEntrega}>{props.tipo == "Produtos" ? "PREÇO" : "ENTREGA:"}</Text>
                    {
                        props.tipo == "Produtos"
                            ?
                            <View style={{ ...styles.linhaEntrega, marginTop: -3, justifyContent: 'flex-start' }}>
                                <View style={styles.posInput}>
                                    <Text style={{ ...styles.textMin, marginBottom: -109 }}>R$</Text>
                                    <CurrencyInput
                                        value={preço}
                                        onChangeValue={setPreço}
                                        delimiter="."
                                        placeholder="20,00"
                                        placeholderTextColor="#A18E85"
                                        separator=","
                                        maxLength={12}
                                        precision={2}
                                        onChangeText={text => setTextPreço(text)}
                                        style={styles.inputPreço}
                                    />
                                </View>
                            </View>
                            :
                            <View style={styles.marginLinha}>
                                <View style={styles.linhaEntrega}>
                                    <View style={styles.PosItensEntrega}>
                                        <TextInput keyboardType="number-pad" value={min1} onChangeText={text => setMin1(text.replace(/[- #*;,.<>\{}\[\]\\/]/gi, ''))
                                        } maxLength={3} style={styles.inputEntrega}></TextInput>
                                        <Text style={styles.textMin}>min</Text>
                                        <TextInput keyboardType="number-pad" value={min2} onChangeText={text => setMin2(text.replace(/[- #*;,.<>\{}\[\]\\/]/gi, ''))} maxLength={3} style={styles.inputEntrega}></TextInput>
                                        <Text style={styles.textMin}>min</Text>
                                    </View>
                                </View>
                            </View>
                    }
                </View>
                {
                    props.tipo == "Produtos"
                        ?
                        <View>
                            <View style={{ ...styles.CampoEntrega, justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => SelecionarImagem()}>
                                    <Text style={{ ...styles.textEntrega, fontSize: 20 }}>SELECIONAR IMAGEM</Text>
                                </TouchableOpacity>
                                <Image source={{ uri: imagem || placeholder }} style={styles.imagemCapa} />
                            </View>
                            <View style={{ ...styles.CampoEntrega, justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => Cadastrar()} style={styles.btnCadastrar}><Text style={styles.textCadastrar}>CADASTRAR</Text></TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View>
                            <View style={styles.CampoEntrega}>
                                <Text style={styles.textEntrega}>TIPO:</Text>
                                <View style={styles.LinhaBottom}>
                                    <View style={styles.PosItensLinha}>
                                        <Text style={{ ...styles.textMin, marginBottom: 12, marginLeft: 10 }}>{tipo}</Text>
                                        <TouchableNativeFeedback onPress={() => setModalTipo(true)} background={TouchableNativeFeedback.Ripple('#A18E85', true)}>
                                            <View style={styles.rippleBtnDown}>
                                                <Entypo name="chevron-small-down" size={28} color="#A18E85" />
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                    <View style={{ ...styles.linhaEntrega }} />
                                </View>
                            </View>
                            <View style={{ ...styles.CampoEntrega, justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => SelecionarImagem()}>
                                    <Text style={{ ...styles.textEntrega, fontSize: 20 }}>SELECIONAR IMAGEM</Text>
                                </TouchableOpacity>
                                <Image source={{ uri: imagem || placeholder }} style={styles.imagemCapa} />
                            </View>
                            <View style={{ ...styles.CampoEntrega, justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => Cadastrar()} style={styles.btnCadastrar}><Text style={styles.textCadastrar}>CADASTRAR</Text></TouchableOpacity>
                            </View>
                        </View>
                }
                {
                    carregarCadastros
                        ?
                        <View style={{ ...styles.viewCadastrados, flex: 1 }}>
                            <Text style={styles.textCadastrados}>CADASTRADOS:</Text>
                            <View style={styles.centerIndicator}>
                                <ActivityIndicator color="#ED3E3E" size={50} />
                            </View>
                        </View>
                        :
                        <ScrollView contentContainerStyle={styles.viewCadastrados}>
                            <Text style={styles.textCadastrados}>CADASTRADOS:</Text>
                            {
                                filtrarCadastros.map((val, i) => {
                                    return (
                                        props.tipo == "Produtos"
                                            ?
                                            <React.Fragment key={i}>
                                                <ComponenteProduto id="CadastroProduto" idProduto={val.id} idLugar={props.route.params.idLugar} email={val.data.email} preço={val.data.preçoData} navigation={props.navigation} entrega={props.route.params.entrega} img={val.data.imagem} nome={val.data.id} tipo={`R$ ${val.data.preço}`} />
                                            </React.Fragment>
                                            :
                                            <React.Fragment key={i}>
                                                <ComponenteProduto idLugar={val.id} email={val.data.email} navigation={props.navigation} entrega={val.data.entrega} img={val.data.imagem} nome={val.data.id} tipo={val.data.tipo} />
                                            </React.Fragment>
                                    )
                                })
                            }
                        </ScrollView>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    apenasFlex: { 
        flex: 1
    },
    rippleBtnDown: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 220,
        bottom: 6
    },
    PosItensLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    LinhaBottom: {
        marginBottom: 4
    },
    inputPreço: {
        paddingLeft: 10,
        width: 224,
        fontFamily: 'Roboto_400Regular',
        fontSize: 19
    },
    centerIndicator: {
        flex: 1,
        justifyContent: 'center'
    },
    viewCadastrados: {
        padding: 20,
    },
    textCadastrados: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        fontSize: 20,
        marginBottom: -10
    },
    textCadastrar: {
        color: 'white',
        fontFamily: 'Roboto_700Bold',
        fontSize: 16
    },
    btnCadastrar: {
        backgroundColor: '#ED3E3E',
        width: 370,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagemCapa: {
        height: 89,
        width: 110,
    },
    inputEntrega: {
        fontSize: 19,
        fontFamily: 'Roboto_400Regular',
        paddingLeft: 30,
        width: 70
    },
    PosItensEntrega: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: -4
    },
    posInput: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: -3
    },
    marginLinha: {
        marginTop: 11
    },
    textMin: {
        color: '#A18E85',
        fontFamily: 'Roboto_400Regular',
        fontSize: 19,
    },
    linhaEntrega: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1,
        width: 250,
        marginTop: -15,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textEntrega: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        fontSize: 22,
        marginLeft: 25
    },
    CampoEntrega: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1,
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    CampoNome: {
        borderBottomColor: '#A18E85',
        borderBottomWidth: 1,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputNome: {
        width: 360,
        height: 60,
        borderColor: '#A18E85',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 20,
        fontSize: 18
    }
})