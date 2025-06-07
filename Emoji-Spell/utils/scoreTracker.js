import AsyncStorage from '@react-native-async-storage/async-storage';

// Add a score entry
export async function saveScore({ grade, quizId, score, total }) {
  const existing = await getScores();
  const newEntry = {
    id: Date.now(),
    grade,
    score,
    total,
    date: new Date().toISOString()
  };
  const updated = [...existing, newEntry];
  await AsyncStorage.setItem('scores', JSON.stringify(updated));
}

// Get all score entries
export async function getScores() {
  const data = await AsyncStorage.getItem('scores');
  return data ? JSON.parse(data) : [];
}
