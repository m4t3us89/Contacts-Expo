import React, { useEffect, useState, useCallback } from 'react'
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  View,
  Button
} from 'react-native';

import * as Contacts  from 'expo-contacts'



const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

function Item({ id, data, selected, onSelect, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={()=>onSelect(id)}
      activeOpacity={0.6}
      style={[
        styles.info,
        { backgroundColor: selected ? '#7d40e7' : '#FFF' },
      ]}
    >
     
        <Text style={{...styles.name, color: selected ? 'white' : 'black'}}>{data.firstName}</Text>
        <Text style={{...styles.phone, color: selected ? 'white' : 'gray'}}>
        {data.phoneNumbers &&
            data.phoneNumbers.length > 0 &&
            data.phoneNumbers[0].number}
        </Text>
      
    </TouchableOpacity>
  );
}

export default function Main () {
  const [selected, setSelected] = useState(new Map())
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync()
      if (status === 'granted') {
        const {
          data
        } = await Contacts.getContactsAsync(/*{
          fields: [Contacts.Fields.Emails]
        }*/)

        if (data.length > 0) {
          //const contact = data[0]
          /*for (const contact of data) {
            console.log(contact)
          }*/
          setContacts(
            data.sort((a, b) => {
              let textA = a.name.toLowerCase()
              let textB = b.name.toLowerCase()
              return textA < textB ? -1 : textA > textB ? 1 : 0
            })
          )
        }
      }
    })()
    //console.log('Contatos  ', contacts[0])
  }, [])

  const handlerLongClick = useCallback(
    id => {
      const newSelected = new Map(selected);

      if(selected.get(id))
        newSelected.delete(id)

      else
        newSelected.set(id, !selected.get(id));
      
      setSelected(newSelected);
    },
    [selected],
  );

  function handlerClick(){
    if(selected.size == 0)
      Alert.alert(' Button  Pressed');
  };

  function unSelected(){
    setSelected(new Map())
  }

  function deleteSelected(){
    Alert.alert(
      'Atenção',
      'Tem certeza que deseja remover o(s) contato(s) selecionado(s) ?',
      [
        //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: 'CANCELAR',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  return (
    <>
    {(selected.size > 0) ? (
      <View style={styles.selectContainer}>
        <Text style={styles.selectText}>
          {`Iten(s) selecionado(s): ${selected.size}`}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Button
            title="Remover Seleção"
            onPress={unSelected}
          />
          <Text style={{ marginLeft: 10 }}/> 
          <Button
            title="Excluir"
            onPress={deleteSelected}
          /> 
        </View>
      </View> 
    ) : null}
    <SafeAreaView>
      <FlatList
        data={contacts}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            data={item}
            selected={!!selected.get(item.id)}
            onSelect={handlerLongClick}
            onPress={handlerClick}
          />
        )}
        keyExtractor={item => item.id}
        extraData={selected}
      />
    </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  selectContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#7d40e7',
    padding: 10
  },
  selectText:{
    color: 'white'
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 20,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  name: {
    paddingLeft: 10,
    fontSize: 16
  },
  phone: {
    paddingRight: 10,
    fontSize: 13,
  }
});
