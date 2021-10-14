import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    positionModal: {
        ...StyleSheet.absoluteFillObject, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 5, 
        zIndex: 1
    },
    carregando: {
        paddingLeft: 10
    },
    TextCarregamento: {
        paddingLeft: 20,
        fontFamily: 'Roboto_700Bold',
        fontSize: 17,
        color: '#A18E85'
    },
    PostItensCarregar: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    PosCriarConta: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    CenterTextCupon: {
        flex: 1,
        alignItems: 'center'
    },
    TextBtnOk: {
        fontSize: 16,
        color: '#ED3E3E',
        fontFamily: 'Roboto_700Bold',
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    PosBtnOk: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    TextModal: {
        padding: 15,
        fontFamily: 'Roboto_700Bold',
        color: "#A18E85",
        fontSize: 20
    },
    ModalFundo: {
        width: 300,
        height: 150,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 5,
    },
    modalCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ViewPrincipal: {
        flex: 1,
        backgroundColor: '#ED3E3E'
    },
    ViewImgLogo: {
        backgroundColor: '#ED3E3E',
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgLogoLogin: {
        width: 220,
        height: 220,
    },
    ViewLogin: {
        backgroundColor: '#ED3E3E',
        flex: 0.7,
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
        marginTop: 30
    },
    InputEmail: {
        backgroundColor: 'white',
        width: 370,
        height: 50,
        paddingLeft: 15,
        fontSize: 16,
        borderRadius: 10,
        fontFamily: 'Roboto_400Regular'
    },
    TextEmail: {
        color: '#A18E85',
        fontFamily: 'Roboto_700Bold',
        paddingTop: 20,
        paddingBottom: 4,
        fontSize: 16
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
        color: '#A18E85'
    },
    centerModais: {
        alignItems: "center"
    }
})

export default styles;