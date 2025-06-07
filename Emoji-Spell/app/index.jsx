import { StyleSheet, FlatList, Text, View, TextInput } from 'react-native';
import * as Progress from 'react-native-progress';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import Button from '@/components/Button';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { getScores } from '../utils/scoreTracker';
import { saveScore } from '../utils/scoreTracker';

// import {Picker} from "@react-native-picker/picker";

const quiz = require('@/assets/quiz.json');

export default function Index() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentEmoji, setCurrentEmoji] = useState();
    const [currentWord, setCurrentWord] = useState();
    const [text, onChangeText] = useState('');
    const [total, setTotal] = useState(12);
    const [difficulty, setDifficulty] = useState('easy')
    const [data, setData] = useState(quiz['easy']);
    const [score, setScore] = useState(0);

    const [isCorrectOrWrongEmoji, setIsCorrectOrWrongEmoji] = useState('');
    const [isCorrectOrWrongWord, setIsCorrectOrWrongWord] = useState('');
    const [numberCorrect, setNumberCorrect] = useState(0);
    const [numberWrong, setNumberWrong] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [lastWord, setLastWord] = useState('');
    const [intList, setIntList] = useState([]);

    const [scores, setScores] = useState([]);

    
    const [currentRate, setcurrentRate] = useState(0.2);
    const [showStartScreen, setshowStartScreen] = useState(true);
    const [showEndScreen, setShowEndScreen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
    setup()

    fetchScores();
    }, []);

    const fetchScores = async () => {
      const data = await getScores();
      setScores(data.reverse()); // show most recent first
    };
    const renderItem = ({ item }) => (
    <View >

      {(item.grade == 'easy') ? (
        <View style={[styles.scoreCard,styles.easyScoreCard]}>
      <Text style={styles.scoreTitle}>{item.grade.toUpperCase()} </Text>
      <Progress.Bar style={styles.scoreProgress} progress={item.score/(item.total-1)} color={'lightgreen'} width={250} height={20}/>
      <Text style={styles.scoreText}>Score: {item.score} / {item.total}</Text>
      <Text style={styles.scoreDate}>Date: {new Date(item.date).toLocaleString()}</Text>
        </View>
      ) : (item.grade == 'fair') ? (
                <View style={[styles.scoreCard,styles.fairScoreCard]}>
      <Text style={styles.scoreTitle}>{item.grade.toUpperCase()} </Text>
      <Progress.Bar style={styles.scoreProgress} progress={item.score/(item.total-1)} color={'lightgreen'} width={250} height={20}/>
      <Text style={styles.scoreText}>Score: {item.score} / {item.total}</Text>
      <Text style={styles.scoreDate}>Date: {new Date(item.date).toLocaleString()}</Text>
        </View>
      ) : (
          <View style={[styles.scoreCard,styles.hardScoreCard]}>
      <Text style={styles.scoreTitle}>{item.grade.toUpperCase()} </Text>
      <Progress.Bar style={styles.scoreProgress} progress={item.score/(item.total-1)} color={'lightgreen'} width={250} height={20}/>
      <Text style={styles.scoreText}>Score: {item.score} / {item.total}</Text>
      <Text style={styles.scoreDate}>Date: {new Date(item.date).toLocaleString()}</Text>
        </View>
      )}

    </View>
  );

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

        saveScore({
            grade: difficulty,
            score: numberCorrect,
            total: 12,
          });

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
        setDifficulty('easy')
        setup()
    }

    const fairQuiz = () => {
        setshowStartScreen(false);
        playCurrentWord()
        setData(quiz['fair'])
        setDifficulty('fair')
        setup()
    }

    const hardQuiz = () => {
        setshowStartScreen(false);
        playCurrentWord()
        setData(quiz['hard'])
        setDifficulty('hard')
        setup()
    }

    const openHistory = () => {
        setShowHistory(true);
                fetchScores();

    }
  
    const closeHistory = () => {
        setShowHistory(false);
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
          <Button label="HISTORY" onPress={openHistory} />


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

      <Modal isVisible={showHistory}>
        <View style={styles.modal}>

        <Text style={styles.header}>My Scores</Text>
                <Button theme="quaternary" label="CLOSE" onPress={closeHistory} />
        <Text style={styles.text}></Text>

      {scores.length === 0 ? (
        <Text style={styles.emptyText}>No scores yet. Try a quiz!</Text>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
        )}

        </View>
      </Modal>

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

    header: { color:'#fff', fontSize: 50, fontWeight: 'bold', marginTop: 35,marginBottom: 15 },
    scoreCard:{
    borderRightWidth: 30,
    padding: 20,
    // borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'black'
    },
    easyScoreCard: {
    borderRightColor: '#ff66a1',
  },
    fairScoreCard: {
    borderRightColor: '#3e80f1',
  },
    hardScoreCard: {
    borderColor: '#ed6b73',
  },
    scoreProgress: {
    backgroundColor: 'red',
    borderWidth:0,
    borderRadius:10,
  },
  scoreTitle: {fontWeight:'bold', color:'#fff',textAlign: 'left', marginTop: 5, marginBottom: 10, fontSize: 25 },
  scoreText: { color:'#fff',textAlign: 'right', marginTop: 5, fontSize: 16 },
  scoreDate: { color:'#fff',textAlign: 'right', marginTop: 5, fontSize: 12 },

  emptyText: { color:'#fff',textAlign: 'center', marginTop: 5, fontSize: 16 }

});
