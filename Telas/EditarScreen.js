import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ToastAndroid, Modal, TouchableNativeFeedback, Keyboard } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { db } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import ModalAviso from '../Componentes/ModalAviso';
import stylesModal from '../Estilos/StylesCadastro'
import CurrencyInput from 'react-native-currency-input';
import ModalCadastrar from '../Componentes/modalCadastrar';
import PickerCatergorias from '../Componentes/PickerCatergorias'
import { storage } from '../firebase';

export default function EditarCoisas(props) {

    const refEditar = props.tipo == "Produtos" ? db.collection("Cadastros").doc(props.route.params.idLugar).collection("Produto") : db.collection("Cadastros");

    const [nome, setNome] = useState(props.route.params.nome);
    const [min1, setMin1] = useState(props.route.params.entrega[0]);
    const [min2, setMin2] = useState(props.route.params.entrega[1]);
    const [tipo, setTipo] = useState(props.route.params.tipo);
    const [preço, setPreço] = useState(props.route.params.preço);
    const [textPreço, setTextPreço] = useState('');
    const [imagem, setImagem] = useState(props.route.params.img);
    const [showModal, setShowModal] = useState(false);
    const [textModal, setTextModal] = useState('');
    const [ids, setIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalTipo, setModalTipo] = useState(false);
    const [paramNome, setParamNome] = useState(props.route.params.nome);

    useEffect(() => {
        refEditar.onSnapshot(snapshot => {
            setIds(snapshot.docs.map(val => val.data().id))
        })
    }, [])

    const tipos = ['Pizza', 'Brasileira', 'Lanches', 'Sorvetes', 'Produtos', 'Farmácia', 'Cervejas'];

    const Toast = (mensagem) => {
        ToastAndroid.showWithGravity(
            mensagem,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
        );
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

    const getPictureBlob = () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", imagem, true);
            xhr.send(null);
        });
    };

    const getImage = async () => {
        const params = props.tipo == "Produtos" ? props.route.params.idProduto : props.route.params.idLugar;
        const ifs = props.tipo == "Produtos" ? textPreço == "" : min1 == "" || min2 == "";
        const ifsText = props.tipo == "Produtos" ? "Preço está vazio!" : "Tempo de entrega faltando!";

        if (nome == "") { return Toast("Nome está vazio!") }
        if (ifs) { return Toast(ifsText) }
        if (imagem == null) { return Toast("Selecione uma imagem!") }
        if (+(min2) < +(min1)) { return Toast("Verifique o tempo de Entrega! (O mínimo está maior que o máximo.)") }

        Keyboard.dismiss();
        setLoading(true);

        if (ids.includes(nome) && nome != paramNome) {
            setLoading(false);
            setShowModal(true);
            setTextModal('Este cadastro já existe.')
        } else if (imagem != props.route.params.img) {
            let blob;
            try {
                blob = await getPictureBlob(imagem);
                const ref = await storage.ref().child(`images/${imagem.split('/').pop().split('.').shift()}`);
                const snapshot = await ref.put(blob);
                snapshot.ref.getDownloadURL().then(url => {
                    Editar(params, url);
                })
            } catch (e) {
                console.error(e);
            } finally {
                blob.close();
            }
        } else {
            Editar(params);
        }

    }

    const Editar = (params, img) => {

        refEditar.doc(params).update(
            props.tipo == "Produtos"
                ?
                {
                    id: nome,
                    preço: textPreço,
                    imagem: img || imagem,
                    preçoData: preço
                }
                :
                {
                    id: nome,
                    entrega: [min1, min2],
                    imagem: img || imagem,
                    tipo: tipo
                }).then(() => {
                    setLoading(false);
                    setShowModal(true);
                    setTextModal('Editado com sucesso!');
                    setParamNome(nome);
                }).catch((e) => {
                    console.error(e);
                    setLoading(false);
                    setShowModal(true);
                    setTextModal('Erro ao editar.')
                })

    }

    const Excluir = () => {
        setModalConfirm(false);
        setLoading(true);
        const refExcluir = db.collection('Cadastros').doc(props.route.params.idLugar)

        if (props.tipo == "Produtos") {
            refExcluir.collection('Produto').doc(props.route.params.idProduto).delete().then(() => {
                setLoading(false);
                props.navigation.goBack();
            }).catch(e => {
                setLoading(false);
                setTextModal('Erro ao exluir.');
                setShowModal(true);
                console.error(e);
            })
        } else {
            refExcluir.collection('Produto').limit(1).get().then(snapshot => {
                if (snapshot.size == 0) {
                    refExcluir.delete().then(() => {
                        setLoading(false);
                        props.navigation.goBack();
                    })
                } else {
                    refExcluir.collection('Produto').get().then((produtos) => {
                        produtos.forEach(prods => {
                            refExcluir.collection('Produto').doc(prods.id).delete().then(() => {
                                refExcluir.delete().then(() => {
                                    setLoading(false);
                                    props.navigation.goBack();
                                })
                            })
                        })
                    })
                }
            })
        }

    }

    return (
        <View style={styles.apenasFlex}>
            {showModal ? <ModalAviso lugares TextModal={textModal} setShowModal={setShowModal} showModal={showModal} /> : null
            }
            <View pointerEvents={showModal ? "none" : "auto"} style={styles.container}>
                <Modal
                    transparent
                    visible={modalConfirm}
                    onRequestClose={() => setModalConfirm(false)}
                >
                    <View style={stylesModal.modalCenter}>
                        <View style={stylesModal.ModalFundo}>
                            <Text style={stylesModal.TextModal}>Deseja excluir este cadastro?</Text>
                            <View style={styles.PosBtnsModal}>
                                <TouchableOpacity onPress={() => setModalConfirm(false)}>
                                    <Text style={stylesModal.TextBtnOk}>NÃO</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Excluir()}>
                                    <Text style={stylesModal.TextBtnOk}>SIM</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ Modal>
                <ModalCadastrar loading={loading} />
                <PickerCatergorias tipos={tipos} modalTipo={modalTipo} setModalTipo={setModalTipo} setTipo={setTipo} />
                <View style={styles.CampoNome}>
                    <TextInput defaultValue={nome} maxLength={15} onChangeText={text => setNome(text.trim())} placeholder={props.tipo == "Produtos" ? "Nome do produto..." : "Nome do estabelecimento..."} placeholderTextColor="#A18E85" style={styles.inputNome}></TextInput>
                </View>
                <View style={styles.CampoEntrega}>
                    <Text style={styles.textEntrega}>{props.tipo == "Produtos" ? "PREÇO:" : "ENTREGA:"}</Text>
                    {
                        props.tipo == "Produtos" ?
                            <View style={{ ...styles.linhaEntrega, marginTop: -3, justifyContent: 'flex-start' }}>
                                <View style={styles.posInput}>
                                    <Text style={{ ...styles.textMin, marginBottom: -109 }}>R$</Text>
                                    <CurrencyInput
                                        value={preço}
                                        onChangeValue={setPreço}
                                        delimiter="."
                                        placeholder="20,00"
                                        separator=","
                                        precision={2}
                                        placeholderTextColor="#A18E85"
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
                        null
                        :
                        <View style={styles.CampoEntrega}>
                            <Text style={styles.textEntrega}>TIPO:</Text>
                            <View style={styles.LinhaBottom}>
                                <View style={styles.posItensModal}>
                                    <Text style={{ ...styles.textMin, marginBottom: 12, marginLeft: 10 }}>{tipo}</Text>
                                    <TouchableNativeFeedback onPress={() => setModalTipo(true)} background={TouchableNativeFeedback.Ripple('#A18E85', true)}>
                                        <View style={styles.rippleBtnDown}>
                                            <Entypo name="chevron-small-down" size={28} color="#A18E85" />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={styles.linhaEntrega} />
                            </View>
                        </View>
                }
                <View style={{ ...styles.CampoEntrega, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => SelecionarImagem()}>
                        <Text style={{ ...styles.textEntrega, fontSize: 20 }}>SELECIONAR IMAGEM</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: imagem || 'https://149361159.v2.pressablecdn.com/wp-content/uploads/2021/01/placeholder.png' }} style={styles.imagemCapa} />
                </View>
                <View style={{ ...styles.CampoEntrega, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => getImage()} style={styles.btnCadastrar}><Text style={styles.textCadastrar}>EDITAR</Text></TouchableOpacity>
                </View>
                <View style={{ ...styles.CampoEntrega, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => setModalConfirm(true)} style={styles.btnCadastrar}><Text style={styles.textCadastrar}>EXCLUIR</Text></TouchableOpacity>
                </View>
                {
                    props.route.params.preço ?
                        null
                        :
                        <View style={{ ...styles.CampoEntrega, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("CadastrarProdutos", { name: props.route.params.name, entrega: props.route.params.entrega, idLugar: props.route.params.idLugar })
                            }} style={styles.btnCadastrar}><Text style={styles.textCadastrar}>CADASTRAR PRODUTOS</Text></TouchableOpacity>
                        </View>
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
    posItensModal: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    LinhaBottom: {
        marginBottom: 4
    },
    PosBtnsModal: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputPreço: {
        paddingLeft: 10,
        width: 224,
        fontFamily: 'Roboto_400Regular',
        fontSize: 19
    },
    posInput: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: -3
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
        color: '#A18E85',
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