import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {countries} from '../../countries';
import _ from '../../underscore-esm-min';

const GameScreen = ({ route, navigation }) => {
  const [points, setPoints] = useState(0);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('question');
  const [selectedCountry, setSelectedCountry] = useState({});
  const [options, setOptions] = useState([]);
  const [chosenOption, setChosenOption] = useState(-1);
  const { username } = route.params;

  const nextStep = () => {
    if(step > 10) setStatus('end');
    else setStatus('question');
    setChosenOption(-1);
  }

  const confirmTry = () => {
    if(selectedCountry.name === options[chosenOption].name){
      setPoints((p) => p+1 )
      setStatus('hit')
    }
    else{
      setStatus('miss')
    }
    setStep((s) => s + 1);
  }

  useEffect(() => {
    if(status === 'question') setSelectedCountry(() =>countries[Math.floor(Math.random() * countries.length)]);
  },[status]);

  useEffect(() => {
    let optionsArray = _.sample(countries,3);
    optionsArray.push(selectedCountry);
    setOptions(_.shuffle(optionsArray));
  }, [selectedCountry])


  if(status === 'end')
    return(
    <SafeAreaView style={[styles.resultContainer, styles.endContainer]}>
        <Text style={styles.resultText}>Fim de jogo!</Text>
      <View
        style={{flex:2, alignItems: 'center'}}
      >
        <Text style={[styles.resultText]}>{username}</Text>
        <Text style={[styles.resultText]}>{points} pontos!</Text>
      </View>
      <View
        style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}
      >
      <View
        style={{paddingHorizontal: 10}}
      >
        <Button 
          title="Recomeçar"
          onPress={() => {
            setPoints(0);
            setStep(1);
            setStatus('question');
          }}
        />
      </View>
      <View
        style={{paddingHorizontal: 10}}
      >
        <Button 
          title="Encerrar"
          color="red"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
      </View>
      </View>
    </SafeAreaView>
    )
  if(status === 'hit')
    return(
    <SafeAreaView style={[styles.resultContainer, styles.hitContainer]}>
        <Text style={styles.resultText}>Acertou!</Text>
        <AntDesign style={{flex:4}} name="check" size={240} color="black" />
        <Button 
          style={{flex:1}}
          title="Continuar"
          color="green"
          onPress={() => nextStep()}
        />
    </SafeAreaView>
    )
  if(status === 'miss')
    return(
    <SafeAreaView style={[styles.resultContainer, styles.missContainer]}>
        <Text style={styles.resultText}>Errou!</Text>
        <AntDesign style={{flex:4}} name="close" size={240} color="black" />
        <Button 
          style={{flex:1}}
          title="Continuar"
          color="red"
          onPress={() => nextStep()}
        />
    </SafeAreaView>
    )

  if(Object.keys(selectedCountry).length == 0) return(<Text>Carregando ...</Text>) 
  else 
    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign style={styles.buttonClose} name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.progress}>{step}/10</Text>
        <Text style={styles.score}>Pontos: {points}</Text>
      </View>
      <View style={styles.flagContainer}>
        <Text style={styles.question}>{username},</Text>
        <Text style={styles.question}>selecione a qual país a bandeira abaixo pertence?</Text>
        <Image 
          style={styles.flag}
          source={{
            uri: `https://flagsapi.com/${selectedCountry.code}/shiny/64.png`
          }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.optionsContainer}>
        { options.map((option,idx) => {
          return(
            <TouchableOpacity
              key={idx}
              onPress={() => setChosenOption(idx)}
            >
              <View style={[styles.buttonOption, idx === chosenOption ? styles.buttonOptionSelected : {}]}>
                <Text>{option.name}</Text>
              </View>
            </TouchableOpacity>
          )
        })
        }
      </View>
      <View style={styles.confirmContainer}>
        <Button 
          title="Confirmar"
          color="green"
          disabled={chosenOption === -1}
          onPress={() => confirmTry()}
          style={styles.confirmButton}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  flag: {
    width:180,
    height:180,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  buttonClose: {
    flex: 2,
  },
  progress: {
    flex: 4,
    textAlign: 'center',
    fontSize: 20,
  },
  score: {
    flex: 2,
    fontSize: 20,
  },
  flagContainer: {
    flex: 4,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flex: 4,
    justifyContent: 'space-evenly',
  },
  buttonOption: {
    borderWidth: 3,
    borderRadius: 25,
    borderColor: 'lightgray',
    margin: 20,
    padding: 10,
  },
  buttonOptionSelected: {
    borderColor: 'mediumseagreen',
    backgroundColor: 'lightgreen'
  },
  confirmContainer: {
    flex: 1,
    margin: 50,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center'
  },
  resultContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    fontSize: 30,
    padding: 40,
  },
  hitContainer: {
    backgroundColor: 'lightgreen',
  },
  missContainer:{
    backgroundColor: 'orangered',
  },
  endContainer: {
    backgroundColor: 'lightblue',
  },
  resultText: {
    flex: 2,
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default GameScreen;
