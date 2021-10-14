import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

export default function ModalCadastrar(props) {
    return (
        <Modal
            transparent={true}
            visible={props.loading}
            statusBarTranslucent
        >
            <View style={styles.ViewCarregar}>
                <ActivityIndicator color="#ED3E3E" size={80} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    ViewCarregar: {
        justifyContent: 'center', 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
})