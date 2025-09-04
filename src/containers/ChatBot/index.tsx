// src/screens/ChatBot/index.tsx
import React, { useState, useRef, useEffect } from 'react';
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
import { OPENAI_API_KEY, GOOGLE_API_KEY, GOOGLE_CX_ID } from '@env';

// ✅ Define message type
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I’m Salema. How can I assist you today?',
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const flatListRef = useRef<FlatList>(null);

  // Scroll to latest message
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [userMsg, ...prev]);
    setInputText('');
    setLoading(true);

    try {
      if (!GOOGLE_API_KEY || !GOOGLE_CX_ID || !OPENAI_API_KEY) {
        throw new Error('Missing API keys in environment variables.');
      }

      // ✅ Fetch live Google search results
      const searchRes = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_CX_ID,
          q: encodeURIComponent(userMsg.text),
          num: 5,
        },
      });

      const searchResults: string =
        searchRes.data.items
          ?.map((item: any) => `${item.title} - ${item.snippet}`)
          .join('\n') || 'No results found.';

      // ✅ Detect urgent keywords
      const urgentKeywords = ['hijack', 'kidnap', 'danger', 'robbery', 'attack', 'help'];
      const isUrgent = urgentKeywords.some(kw =>
        inputText.toLowerCase().includes(kw)
      );

      // ✅ Send user message + search results to OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `
You are Salema, a protective and street-smart safety assistant for South Africans.
Respond calmly, give safety advice, guide users on emergency features (shake detection, panic alerts, SOS SMS).
Use township slang where appropriate, stay clear and helpful.
Do NOT reveal you are AI. You ARE Salema.
Use the following Google search results to help the user:
${searchResults}`,
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

      let botText: string = response.data.choices?.[0]?.message?.content ||
        'Sorry, I could not get a response.';

      if (isUrgent) {
        botText = `🚨 Hey! Stay safe: ${botText}`;
        // Optional: triggerPanicSMS() here if integrated
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
      };

      setMessages(prev => [botMsg, ...prev]);
    } catch (error: any) {
      console.error('Error in sendMessage:', error?.response?.data || error.message);

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, something went wrong while fetching info.',
        sender: 'bot',
      };
      setMessages(prev => [errorMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user' && styles.userText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Chat with Salema" />

      <FlatList
        ref={flatListRef}
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
