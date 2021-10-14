import React from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import styles from '../Estilos/StylesCadastro'
import { useFocusEffect } from '@react-navigation/native';

export default function ModalAviso(props) {

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            if (props.showModal) {
                props.setShowModal(false);
              return true;
            } else {
              return false;
            }
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [props.showModal])
      );

    return (
        <View style={styles.positionModal}>
            <View style={styles.modalCenter}>
                <View style={styles.ModalFundo}>
                    <Text style={props.lugares && props.TextModal == `Cadastrado com sucesso! Para cadastrar produtos, clique no botão "Editar" ou vá até o restaurante e clique nos três pontos.` ? {...styles.TextModal, fontSize: 17} : styles.TextModal}>{props.TextModal}</Text>
                    <View style={styles.PosBtnOk}>
                        <TouchableOpacity onPress={() => props.setShowModal(false)}><Text style={styles.TextBtnOk}>OK</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
