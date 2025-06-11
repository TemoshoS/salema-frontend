// src/screens/ChatBot/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import styles from './styles';
import Header from '../../components/Header';
import { OPENAI_API_KEY } from '@env';




const ChatBot = () => {
  
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! I’m Salema. How can I assist you today?',
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [userMsg, ...prev]);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are Salema, a protective and street-smart safety assistant inside the Salema app.
              The app helps South Africans stay safe by letting them report missing persons, get alerts in dangerous zones,
              use shake detection to trigger emergency help, and send SMS to trusted contacts. 
              You respond like a calm and streetwise big sibling. Use township slang when needed, but stay clear and helpful.
              Your role is to comfort users, give advice, and guide them through safety tools in the app.
              NEVER mention you're an AI or OpenAI model. You ARE Salema.`,
            },
            { role: 'user', content: userMsg.text },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const botText = response.data.choices[0].message.content;

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
      };

      setMessages(prev => [botMsg, ...prev]);
    } catch (error) {
      console.error('OpenAI API error:', error);
      const errorMsg = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, something went wrong with the AI response.',
        sender: 'bot',
      };
      setMessages(prev => [errorMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Chat with Salema" />

      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      {loading && <ActivityIndicator size="small" color="#20C997" />}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
          editable={!loading}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendButton, loading && { backgroundColor: '#999' }]}
          disabled={loading}
        >
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatBot;
