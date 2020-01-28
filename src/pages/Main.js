import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import * as Contacts from 'expo-contacts'

// import { Container } from './styles';

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
          console.log(contacts[0])
        }
      }
    })()
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <FlatList
          data={contacts}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              <Text>{item.name}</Text>
              <Text>
                {item.phoneNumbers &&
                  item.phoneNumbers.map(phone => phone.number)}
              </Text>
            </Text>
          )}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
})
