import { StyleSheet, Text, View, TextInput } from 'react-native';
import * as Progress from 'react-native-progress';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import Button from '@/components/Button';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
// import {Picker} from "@react-native-picker/picker";


const quiz = require('@/assets/quiz.json');

export default function Index() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentEmoji, setCurrentEmoji] = useState();
    const [currentWord, setCurrentWord] = useState();
    const [text, onChangeText] = useState('');
    const [total, setTotal] = useState(12);
    const [data, setData] = useState(quiz['easy']);

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
    setup
    }, []);

  // Function to generate a random number between 1 and 100
    const generateRandomNumber = () => {
      const min = 0; // Minimum value
      const max = 175; // Maximum value
      // Generate random number in the range [min, max]
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
      return number
  };

    const SubmitAnswer = () => {

      setShowModal(true)
      setLastWord(currentWord)

      if (text.trim().toLowerCase() == currentWord.toLowerCase())
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

      if (currentIndex < (total-1))
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

        if ((numberCorrect/total) > 0.7){
          playFinalSound(true)
          setCurrentEmoji('🏆')
        }
        else{
          playFinalSound(false)
          setCurrentEmoji('👍')
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

    const easyQuiz = () => {
        setshowStartScreen(false);
        playCurrentWord()
        setData(quiz['easy'])
        setup()
    }

    const fairQuiz = () => {
        setshowStartScreen(false);
        playCurrentWord()
        setData(quiz['fair'])
        setup()
    }

    const hardQuiz = () => {
        setshowStartScreen(false);
        playCurrentWord()
        setData(quiz['hard'])
        setup()
    }

    const setup = () => {
    genIntList();
    setCurrentWord(data[intList[0]]['word'])
    setCurrentEmoji(data[intList[0]]['emoji'])

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
      while (intList.length < total){
        // generateRandomNumber()
        let randomnumber = generateRandomNumber()

        if (!intList.includes(randomnumber)) intList.push(randomnumber)
      }
    // console.log(intList)

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
      : require('@/assets/failure.mp3');

    const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true });

    await sound.setPositionAsync(0);
    await sound.playAsync();
  }

  return (
    <View style={styles.container}>
   <LinearGradient
        // Background Linear Gradient
        colors={['#3b547e', '#133a94']}
        style={styles.background}
        start={[0, 1]} end={[1, 0]}

      />

       {showStartScreen ? (
        <View style={styles.startContainer}>
          <Text style={styles.emoji}>📒</Text>
          <Text style={styles.title}>Emoji Spell</Text>
          <Text style={styles.text}>Practice your spelling with Emojis!</Text>
          <Text style={styles.text}></Text>

          {/* <Picker
          selectedValue={10}
          style={[styles.picker,{fontSize:30,borderWidth:1,borderColor:'#fff'}]}
          itemStyle={styles.picker}
          mode={"dropdown"}
          onValueChange={(itemValue) => setTotal(itemValue)}
          prompt={'Number of Words'}
        >
          <Picker.Item label="10" value="10" />
          <Picker.Item label="20" value="20" />
          <Picker.Item label="30" value="30" />
        </Picker> */}

          <Button theme ="primary" label="EASY" onPress={easyQuiz} />
          <Button theme ="secondary" label="FAIR" onPress={fairQuiz} />
          <Button theme= "tertiary" label="HARD" onPress={hardQuiz} />

        </View>
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text,{alignItems:'left'}]}>{currentIndex}/{(total)}</Text>
          <Progress.Bar style={styles.progress} progress={currentIndex/(total-1)} color={'#3e80f1'} width={320} height={20}/>

          <Text style={styles.emoji}>{currentEmoji}</Text>
          {/* <Text style={styles.text}>{currentWord}</Text> */}

            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Write Your Answer Here...."
              placeholderTextColor="#aaa"
              selectionColor={'white'}
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
              {/* <Text style={styles.text}>You got:</Text> */}
              <Progress.Bar style={styles.score} progress={numberCorrect/(total-1)} color={'lightgreen'} width={200} height={20}/>
              <Text style={styles.title}>✅: {numberCorrect}</Text>
              <Text style={styles.title}>❌: {numberWrong}</Text>
              <Text style={styles.text}></Text>

              <Button theme="quaternary" label="Reset" onPress={resetQuiz} />
          </View>
           ) : (
          <View style={styles.modalContainer}>
              <Text style={styles.emoji}>{isCorrectOrWrongEmoji}</Text>
              <Text style={styles.text}>{isCorrectOrWrongWord}</Text>
              <Text style={styles.text}>The correct Spelling is:</Text>
              <Text style={styles.correct}>{lastWord.toUpperCase()}</Text>

          <Button theme="quaternary" label="Next" onPress={hideModal} />
          <Button theme="tertiary" label="Play Sound" onPress={playLastWord} />

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
    alignItems: 'center',
    paddingTop: 50,
  },
  modalContainer: {
    alignItems: 'center'
  
  },
  emoji: {
    color: '#fff',
    fontSize: 130,
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
    fontSize: 25,
  },
  input: {
    height: 60,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    width: 320,
    borderColor: '#fff',
    color: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    textAlign: 'center',
    // backgroundColor: '#383D6E'
  },
  picker: {
    height: 60,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    width: 320,
    borderColor: '#000',
    color: '#fff',
    borderRadius: 50,
    fontSize:20,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#383D6E'
  },
    modal: {
      alignItems: 'center',
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#272A49',
      borderRadius: 30,
      margin:5,
      // borderWidth:1,
    },
    startContainer: {
      alignItems: 'center',
      padding: 20,
      justifyContent: 'center',
      // backgroundColor: 'white',
      margin:20,
      marginTop:150,
      borderRadius:20,
      width:350,
    },
    progress: {
    backgroundColor: '#272A49',
    borderWidth:0,
    borderRadius:50,
  },
      score: {
    backgroundColor: 'crimson',
    borderWidth:0,
    borderRadius:50,
  },
   background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
