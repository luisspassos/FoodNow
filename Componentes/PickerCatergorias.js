import React from 'react';
import { View, Text, Modal, Pressable, TouchableNativeFeedback, StyleSheet } from 'react-native';

export default function PickerCatergorias(props) {
    return (
        <Modal
            transparent
            visible={props.modalTipo}
            animationType="none"
            onRequestClose={() => {
                props.setModalTipo(false);
            }}
        >
            <Pressable style={styles.outModal} onPress={() => props.setModalTipo(false)} />

            <View style={styles.posModal}>
                {
                    props.tipos.map((val, i) => {
                        return (
                            <React.Fragment key={i}>
                                <TouchableNativeFeedback onPress={() => { props.setModalTipo(false); props.setTipo(val) }}>
                                    <View style={styles.colorModal}>
                                        <Text style={styles.textModal}>{val}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </React.Fragment>
                        )
                    })
                }

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    posModal: { 
        marginLeft: 200, 
        marginTop: 320 
    },
    outModal: { 
        width: '100%', 
        height: '100%', 
        position: 'absolute' 
    },
    colorModal: { 
        backgroundColor: '#666565', 
        width: 135 
    },
    textModal: { 
        color: 'white', 
        fontFamily: 'Roboto_400Regular', 
        fontSize: 22, 
        padding: 10 
    }
})