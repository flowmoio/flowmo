import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';

export default function Profile() {
  const { session, signOut, deleteAccount } = useSession();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleDeleteAccount = async () => {
    const error = await deleteAccount();
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: 'Profile',
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#131221',
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        flexDirection: 'column',
      }}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            paddingBottom: 10,
          },
        ]}
      >
        Profile
      </Text>
      <View style={styles.sectionItem}>
        <Text
          style={[
            styles.text,
            {
              fontWeight: 500,
            },
          ]}
        >
          Email
        </Text>
        <Text style={styles.text}>{session?.user.email}</Text>
      </View>
      <Link style={styles.sectionItem} href="/profile/settings">
        <Text
          style={[
            styles.text,
            {
              fontWeight: 500,
            },
          ]}
        >
          Settings
        </Text>
      </Link>
      <Pressable
        style={styles.sectionItem}
        onPress={async () => {
          const error = await signOut();

          if (error) {
            Alert.alert(error.message);
          }
        }}
      >
        <Text
          style={[
            styles.text,
            {
              fontWeight: 500,
            },
          ]}
        >
          Sign out
        </Text>
      </Pressable>
      <Pressable
        style={styles.sectionItem}
        onPress={() => {
          Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? All your data will be permanently deleted.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                onPress: handleDeleteAccount,
                style: 'destructive',
              },
            ],
          );
        }}
      >
        <Text
          style={[
            styles.text,
            {
              fontWeight: 500,
              color: '#FF4F4F',
            },
          ]}
        >
          Delete account
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 16,
    borderBlockColor: '#23223C',
    width: '100%',
  },
  text: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000AA',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#23223C',
    borderRadius: 16,
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalSubText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#FFFFFF',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  modalButton: {
    width: 80,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#3E3D56',
  },
  deleteButton: {
    backgroundColor: '#23223C',
    borderColor: '#FF4F4F',
    borderWidth: 2,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
