import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Platform, ScrollView } from 'react-native';
import Voice from '@react-native-community/voice';
import * as Speech from 'expo-speech';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000/command';

export default function App() {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, sending, error
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [backendResponse, setBackendResponse] = useState(null);

  const speak = (text) => {
    Speech.speak(text);
  };

  const sendToBackend = async (text) => {
    try {
      console.log(`Sending to backend: ${text}`);
      setStatus('sending');
      setBackendResponse(null); // Clear previous response
      const response = await axios.post(BACKEND_URL, { command: text });
      console.log('Backend response:', response.data);
      setBackendResponse(response.data);
      speak(`Command processed.`);
      setStatus('idle');
    } catch (err) {
      console.error('Error sending to backend:', err.message);
      const errorMessage = `Backend error: ${err.message}. Make sure the backend server is running on ${BACKEND_URL}.`;
      setError(errorMessage);
      speak(`I couldn't connect to my brain. Please check the backend server.`);
      setStatus('error');
    }
  };

  useEffect(() => {
    const onSpeechStart = () => setStatus('listening');
    const onSpeechEnd = () => setStatus('processing');
    const onSpeechError = (e) => {
      setError(JSON.stringify(e.error));
      setStatus('error');
    };
    const onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const recognizedText = e.value[0];
        setTranscript(recognizedText);
        speak(`You said: ${recognizedText}. Processing.`);
        sendToBackend(recognizedText);
      } else {
        setStatus('idle');
      }
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setTranscript('');
      setError('');
      setBackendResponse(null);
      await Voice.start('en-US');
    } catch (e) {
      console.error('Error starting voice recognition:', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  };

  const resetState = () => {
    stopListening();
    setTranscript('');
    setError('');
    setBackendResponse(null);
    setStatus('idle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Neura</Text>
        <Text style={styles.subtitle}>Your Offline AI Assistant</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: {status}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {status !== 'listening' ? (
            <Button title="Ask Neura" onPress={startListening} />
          ) : (
            <Button title="Stop Listening" color="red" onPress={stopListening} />
          )}
          <View style={styles.buttonSpacer} />
          <Button title="Reset" onPress={resetState} color="gray" />
        </View>

        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>You said:</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>

        {backendResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Backend Response:</Text>
            <Text style={styles.responseText}>
              {JSON.stringify(backendResponse, null, 2)}
            </Text>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    width: '80%',
    justifyContent: 'center',
  },
  buttonSpacer: {
    width: 20,
  },
  transcriptContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  transcriptText: {
    fontSize: 16,
    marginTop: 5,
  },
  responseContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#b3e0ff',
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#005f8d',
  },
  responseText: {
    fontSize: 16,
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffdddd',
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    color: '#d8000c',
    textAlign: 'center',
  },
});
