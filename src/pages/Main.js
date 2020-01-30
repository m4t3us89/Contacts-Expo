import React, { useEffect, useState, useCallback } from 'react'
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  View,
  Button,
  TextInput,
  PermissionsAndroid
} from 'react-native'

import * as Contacts from 'expo-contacts'
import { MaterialIcons } from '@expo/vector-icons'

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item'
  }
]

function Item ({ id, data, selected, onSelect, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() => onSelect(id)}
      activeOpacity={0.6}
      style={[styles.info, { backgroundColor: selected ? '#7d40e7' : '#FFF' }]}
    >
      <Text style={{ ...styles.name, color: selected ? 'white' : 'black' }}>
        {data.firstName}
      </Text>
      <Text style={{ ...styles.phone, color: selected ? 'white' : 'gray' }}>
        {data.phoneNumbers &&
          data.phoneNumbers.length > 0 &&
          data.phoneNumbers[0].number}
      </Text>
    </TouchableOpacity>
  )
}

export default function Main () {
  const [selected, setSelected] = useState(new Map())
  const [contacts, setContacts] = useState([])
  const [contactsFilter, setContactsFilter] = useState(null)
  const [keySearch, setKeySearch] = useState()

  /*useEffect(() => {
    async function requestContactsWritePermission () {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          {
            title: 'Permission to Write Contacts',
            message: 'MyContacts needs permission to write contacts',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        )
        console.log('entrou')
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera')
        } else {
          console.log('Camera permission denied')
        }
        console.log('entrou')
      } catch (err) {
        console.warn(err)
        console.log('entrou')
      }
    }

    requestContactsWritePermission()
  }, [])*/

  useEffect(() => {
    ;(async () => {
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
          //console.log('Contatos  ', contacts[0])
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (!keySearch) {
      setContactsFilter(null)
      return
    }

    const key = keySearch.toLowerCase()

    if (key.length > 2) {
      const filterContacts = contacts.filter(contact => {
        return (
          contact.firstName.toLowerCase().indexOf(key) > -1 ||
          contact.name.toLowerCase().indexOf(key) > -1
        )
      })
      setContactsFilter(filterContacts)
    }
  }, [keySearch])

  const handlerLongClick = useCallback(
    id => {
      const newSelected = new Map(selected)

      if (selected.get(id)) newSelected.delete(id)
      else newSelected.set(id, !selected.get(id))

      setSelected(newSelected)
    },
    [selected]
  )

  function handlerClick () {
    if (selected.size == 0) Alert.alert(' Button  Pressed')
  }

  function unSelected () {
    setSelected(new Map())
  }

  function deleteSelected () {
    Alert.alert(
      'Atenção',
      'Tem certeza que deseja remover o(s) contato(s) selecionado(s) ?',
      [
        //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: 'CANCELAR',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            //const { status } = await Contacts.requestPermissionsAsync()
            //if (status === 'granted') {
            const iterator = selected[Symbol.iterator]()
            for (let item of iterator) {
              console.log(item)
              try {
                await Contacts.removeContactAsync(item[0])
              } catch (err) {
                console.log('Err ', err)
              }
            }
            //}
          }
        }
      ],
      { cancelable: false }
    )
  }

  return (
    <>
      {selected.size > 0 ? (
        <View style={styles.selectContainer}>
          <Text style={styles.selectText}>
            {`Iten(s) selecionado(s): ${selected.size}`}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={unSelected} style={styles.searchButton}>
              <MaterialIcons name='close' size={20} color='#FFF' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={deleteSelected}
              style={styles.searchButton}
            >
              <MaterialIcons name='delete' size={20} color='#FFF' />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder='Pesquisar contatos...'
          placeholderTextColor='#999'
          autoCapitalize='words'
          autoCorrect={false}
          value={keySearch}
          onChangeText={setKeySearch}
        />
        <TouchableOpacity
          onPress={() => {
            setKeySearch(null)
          }}
          style={styles.searchButton}
        >
          <MaterialIcons name='close' size={20} color='#FFF' />
        </TouchableOpacity>
      </View>
      {contactsFilter ? (
        <View style={styles.resultFilter}>
          <Text>{`${contactsFilter.length} contato(s) encontrado(s).`}</Text>
        </View>
      ) : null}
      <SafeAreaView>
        <FlatList
          data={contactsFilter || contacts}
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
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#7d40e7',
    padding: 10
  },
  selectText: {
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
    borderColor: '#d6d7da'
  },
  name: {
    paddingLeft: 10,
    fontSize: 16
  },
  phone: {
    paddingRight: 10,
    fontSize: 13
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  searchForm: {
    flexDirection: 'row',
    padding: 10
  },
  resultFilter: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center'
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  }
})
