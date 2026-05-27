import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { countries } from '../data/countries';
// @ts-ignore
import _ from '../../underscore-esm-min';

interface Score {
  id: string;
  nome: string;
  pontos: number;
}

const Placar = () => {
  const [isScore, setIsScore] = useState(true);
  const [scores, setScore] = useState<Score[]>([]);

  const [scoresTimed, setScoreTimed] = useState<Score[]>([]);

  const fetchScore = async () => {
    
    const url = 'http://localhost:3000/scores';

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar dados. Verifique o nome da cidade.");
      }
      const responseJson = await response.json();
      console.log('Sucesso:', responseJson);
        setScore(responseJson);
    
    } catch (error) {
      console.error('Erro ao scores :', error);
    }
  };

  const fetchTimedScore = async () => {
    const url = 'http://localhost:3000/timedscores'

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar dados. Verifique o nome da cidade.");
      }
      const responseJson = await response.json();
      console.log('Sucesso:', responseJson);
      setScore(responseJson);
    } catch (error) {
      console.error('Erro ao scores :', error);
    }
  };

 

  useEffect(() => {
    fetchScore();
    //fetchTimedScore();
  }, []);


 const RenderScoreItem = ({ item }: { item: Score }) => (
    <View>
      <Text style={styles.text}>nome ={item.nome ? item.nome : 'N/A'} , pontos ={item.pontos ? item.pontos : 'N/A'} </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.optionsContainer}>
        <Button title="score" color="blue" onPress={() => setIsScore(true)} />
        <Button title="timed score" color="green" onPress={() => setIsScore(false)} />
      </View>

      {isScore &&
        <View>
          <Text>score </Text>
          <FlatList
            data={scores}
            renderItem={({ item }) => <RenderScoreItem item={item} />}
            keyExtractor={(item, index) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      }

      {/* {!isScore &&
        <View>
          <Text>timed score </Text>
          <FlatList
            data={scoresTimed}
            renderItem={({ item }) => <RenderScoreItem item={item} />}
            keyExtractor={(item, index) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>
        
      } */}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  optionsContainer: {
    flexDirection: 'column'
  },
  confirmContainer: {
    flex: 1,
    margin: 50,
  },
  text: {
    color: 'red'
  },
  listContainer: {
    padding: 16,
    height: 200
  },
});

export default Placar;
