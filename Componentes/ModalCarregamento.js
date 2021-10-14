import React from 'react';
import { View, Text, ActivityIndicator, BackHandler } from 'react-native';
import styles from '../Estilos/StylesCadastro'
import { useFocusEffect } from '@react-navigation/native';

export default function MCarregamento(props) {

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            if (props.ModalCarregamento) {
              return true;
            } else {
              return false;
            }
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [props.ModalCarregamento])
      );

    return (

        <View style={styles.positionModal}>
            <View style={{ ...styles.ModalFundo, height: 70 }}>
                <View style={styles.PostItensCarregar}>
                    <Text style={styles.TextCarregamento}>{props.texto}</Text>
                    <ActivityIndicator style={styles.carregando} color="#ED3E3E" size={45} />
                </View>
            </View>
        </View>

    );
}