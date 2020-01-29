import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView
} from 'react-native'
import * as Contacts from 'expo-contacts'

// import { Container } from './styles';

function Item ({ title }) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  )
}

export default function Main () {
  const [contacts, setContacts] = useState([])

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
        }
      }
    })()
    console.log('Contatos  ', contacts[0])
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        {contacts &&
          contacts.map(contact => (
            <View key={contact.id} style={styles.info}>
              <Text style={styles.name}>{contact.firstName}</Text>
              <Text style={styles.phone}>
                {contact.phoneNumbers &&
                  contact.phoneNumbers.length > 0 &&
                  contact.phoneNumbers[0].number}
              </Text>
            </View>
          ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 22
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
    fontSize: 13,
    color: 'gray'
  }
})
