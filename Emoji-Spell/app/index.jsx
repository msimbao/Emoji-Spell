import { StyleSheet, Text, View, TextInput } from 'react-native';
import * as Progress from 'react-native-progress';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import Button from '@/components/Button';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

const data = require('@/assets/data.json');

export default function Index() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentEmoji, setCurrentEmoji] = useState();
    const [currentWord, setCurrentWord] = useState();
    const [text, onChangeText] = useState('');

    const [isCorrectOrWrongEmoji, setIsCorrectOrWrongEmoji] = useState('');
    const [isCorrectOrWrongWord, setIsCorrectOrWrongWord] = useState('');
    const [numberCorrect, setNumberCorrect] = useState(0);
    const [numberWrong, setNumberWrong] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [lastWord, setLastWord] = useState('');
    const [intList, setIntList] = useState([]);


    const [currentRate, setcurrentRate] = useState(0.2);
      const [showStartScreen, setshowStartScreen] = useState(true);
    const [showEndScreen, setShowEndScreen] = useState(false);

    useEffect(() => {
    genIntList();
    setCurrentWord(data[intList[0]]['word'])
    setCurrentEmoji(data[intList[0]]['emoji'])

    }, []);

  // Function to generate a random number between 1 and 100
    const generateRandomNumber = () => {
      const min = 0; // Minimum value
      const max = 60; // Maximum value
      // Generate random number in the range [min, max]
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
      return number
  };

    const SubmitAnswer = () => {

      setShowModal(true)
      setLastWord(currentWord)

      if (text.toLowerCase() == currentWord.toLowerCase())
      {
        setNumberCorrect(numberCorrect + 1)
        setIsCorrectOrWrongEmoji('✅')
        setIsCorrectOrWrongWord('Correct')
        playFeedbackSound(true)
      }
        else{
          setNumberWrong(numberWrong + 1)
          setIsCorrectOrWrongEmoji('❌')
          setIsCorrectOrWrongWord('Wrong')
          playFeedbackSound(false)
        }

      if (currentIndex < 19)
      {
        generateRandomNumber()
        setCurrentIndex(currentIndex + 1)
        
        let int = intList[currentIndex + 1]

        setCurrentWord(data[int]['word'])
        setCurrentEmoji(data[int]['emoji'])
        onChangeText('')

        playCurrentWord()
      } else {
        setShowEndScreen(true)

        if (numberCorrect > 12){
          playFinalSound(true)
          setCurrentEmoji('🏆')
        }
        else{
          playFinalSound(false)
          setCurrentEmoji('😿')
        }
      }

      
    };

    const handlePlay = (inputValue) => {
        // const inputValue = currentWord
        Speech.speak(inputValue, {
            rate:currentRate,
        });
    }
    

    const playCurrentWord = () => {
        const inputValue = currentWord
        Speech.speak(inputValue, {
            rate:currentRate,
        });
    }

    const playLastWord = () => {
        const inputValue = lastWord
        Speech.speak(inputValue, {
            rate:currentRate,
        });
    }


    const hideModal = () => {
        // const inputValue = currentWord
        setShowModal(false)
        playCurrentWord()
        
    }

    const startQuiz = () => {
        setshowStartScreen(false);
        playCurrentWord()

    }

    const resetQuiz = () => {

        setCurrentWord(data[intList[0]]['word'])
        setCurrentEmoji(data[intList[0]]['emoji'])

        setNumberWrong(0)
        setNumberCorrect(0)
        setShowModal(false)
        setShowEndScreen(false);
        setCurrentIndex(0)
        setshowStartScreen(true);
        onChangeText('')

    }

    const genIntList = () => {
      while (intList.length < 20){
        // generateRandomNumber()
        let randomnumber = generateRandomNumber()

        if (!intList.includes(randomnumber)) intList.push(randomnumber)
      }

    }

    async function playFeedbackSound(isCorrect) {
    const file = isCorrect
      ? require('@/assets/correct.mp3')
      : require('@/assets/wrong.mp3');

    const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true });

    await sound.setPositionAsync(0);
    await sound.playAsync();
  }


    async function playFinalSound(isCorrect) {
    const file = isCorrect
      ? require('@/assets/success.mp3')
      : require('@/assets/fail.mp3');

    const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true });

    await sound.setPositionAsync(0);
    await sound.playAsync();
  }

  return (
    <View style={styles.container}>

       {showStartScreen ? (
        <View style={styles.startContainer}>
          <Text style={styles.emoji}>📒</Text>
          <Text style={styles.title}>Emoji Spell</Text>
          <Text style={styles.text}>Practice your spelling with Emojis!</Text>
          <Text style={styles.text}></Text>

          <Button label="Start" onPress={startQuiz} />
        </View>
      ) : (
        <View style={styles.container}>

          <Progress.Bar style={styles.progress} progress={currentIndex/19} color={'#ffd33d'} width={320} height={5}/>

          <Text style={styles.emoji}>{currentEmoji}</Text>
          {/* <Text style={styles.text}>{currentWord}</Text> */}

            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Write Your Answer...."
              placeholderTextColor="#aaa"
            ></TextInput>

          <Button theme="primary" label="Play Sound" onPress={playCurrentWord} />
          <Button  label="Submit" onPress={SubmitAnswer} />

        </View>
      )}

      <Modal isVisible={showModal}>
        <View style={styles.modal}>

           {showEndScreen ? (
          <View style={styles.modalContainer}>
              <Text style={styles.emoji}>{currentEmoji}</Text>
              <Text style={styles.title}>Finished!</Text>
              <Text style={styles.text}>You got:</Text>
              <Text style={styles.title}>✅: {numberCorrect}</Text>
              <Text style={styles.title}>❌: {numberWrong}</Text>
              <Text style={styles.text}></Text>

              <Button label="Reset" onPress={resetQuiz} />
          </View>
           ) : (
          <View style={styles.modalContainer}>
              <Text style={styles.emoji}>{isCorrectOrWrongEmoji}</Text>
              <Text style={styles.text}>{isCorrectOrWrongWord}</Text>
              <Text style={styles.text}>The correct Spelling is:</Text>
              <Text style={styles.correct}>{lastWord.toUpperCase()}</Text>

          <Button label="Next" onPress={hideModal} />
          <Button theme="primary" label="Play Sound" onPress={playLastWord} />

          </View>
           )}

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    paddingTop: 50,
  },
  modalContainer: {
    alignItems: 'center'
  
  },
  emoji: {
    color: '#fff',
    fontSize: 150,
    margin: 5,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    margin: 3,
  },
  title: {
    color: '#fff',
    fontSize: 35,
    margin:5,
    fontFamily:'Cochin',
    fontWeight:'bold'

  },
    correct: {
    color: '#7CE97C',
    fontSize: 35,
  },
  input: {
    height: 60,
    margin: 12,
    borderWidth: 3,
    padding: 10,
    width: 320,
    borderColor: 'black',
    color: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    textAlign: 'center',
  },
    modal: {
      alignItems: 'center',
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#333333',
      borderRadius: 15,
      margin:5,
    },
    startContainer: {
      alignItems: 'center',
      padding: 20,
      justifyContent: 'center',
      backgroundColor: 'black',
      margin:20,
      marginTop:150,
      borderRadius:20,
      width:350,
    },
    progress: {
    backgroundColor: 'black',
    borderWidth:0,
    borderRadius:1,
  },
});
