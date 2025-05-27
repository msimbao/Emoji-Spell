import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#333', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#ffd33d' }]} onPress={onPress}>
          <FontAwesome name="play" size={18} color="#000" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#000' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }
    else  {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 2, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#000' }]} onPress={onPress}>
          <FontAwesome name="check" size={18} color="#fff" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#fff' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    margin:5,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});