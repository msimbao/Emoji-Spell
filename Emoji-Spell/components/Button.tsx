import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';


type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {

  return(
  (theme === 'primary') ? (
      <View
        style={[
          styles.buttonContainer,
          // { borderWidth: 4, borderColor: '#333', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#ff66a1' }]} onPress={onPress}>
          {/* <FontAwesome name="play" size={18} color="#000" style={styles.buttonIcon} /> */}
          <Text style={[styles.buttonLabel, { color: '#fff' }]}>{label}</Text>
        </Pressable>
      </View>
    ) : (theme === 'secondary') ?
       (
      <View
        style={[
          styles.buttonContainer
        ]}>

        <Pressable style={[styles.button, { backgroundColor: '#3e80f1' }]} onPress={onPress}>
          {/* <FontAwesome name="check" size={18} color="#fff" style={styles.buttonIcon} /> */}
          <Text style={[styles.buttonLabel, { color: '#fff' }]}>{label}</Text>
        </Pressable>
      </View>
    ) : (theme === 'tertiary') ?
     (
    <View style={styles.buttonContainer}>
      <Pressable style={[styles.button, { backgroundColor: '#ed6b73' }]} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  ) : (theme === 'quaternary') ?
     (
   <View
        style={[
          styles.buttonContainer,
          { borderWidth: 1, borderColor: '#fff', borderRadius: 50 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#272A49' }]} onPress={onPress}>
          {/* <FontAwesome name="play" size={18} color="#fff" style={styles.buttonIcon} /> */}
          <Text style={[styles.buttonLabel, { color: '#fff' }]}>{label}</Text>
        </Pressable>
      </View>
  ) : (
         <View
        style={[
          styles.buttonContainer,
          // { borderWidth: 4, borderColor: '#333', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#272A49' }]} onPress={onPress}>
          {/* <FontAwesome name="play" size={18} color="#fff" style={styles.buttonIcon} /> */}
          <Text style={[styles.buttonLabel, { color: '#fff' }]}>{label}</Text>
        </Pressable>
      </View>
  )
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    margin:3,
  },
  button: {
    borderRadius: 50,
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
    fontSize: 20,
  },
    text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
});