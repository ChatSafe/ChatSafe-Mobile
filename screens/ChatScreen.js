import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { WebBrowser } from 'expo';
import { TextField } from 'react-native-material-textfield';

import { MonoText } from '../components/StyledText';

export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      textBoxValue: ''
    };

    this.scrollView = null;
  }

  componentDidMount() {
    for(let i = 0; i < 20; i++) {
      this.addMessage({
        identifier: 'someone',
        text: 'Hey what\'s up!?'
      });
    }

    if(Platform.os === 'android') {
      SoftInputMode.set(SoftInputMode.ADJUST_PAN);
    }

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  static navigationOptions = {
    title: 'Chat'
  };

  render() {
    const messages = this.state.messages.map((message, index) =>
      <View style={styles.message} key={index}>
        <Text style={styles.identifier}>{message.identifier}</Text>
        <Text style={styles.text}>{message.text}</Text>
      </View>
    );

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        keyboardVerticalOffset={Platform.select({ios: 0, android: 80})}
        enabled
      >
        <ScrollView
          ref={ref => this.scrollView = ref}
          style={styles.container} contentContainerStyle={styles.contentContainer}
          onContentSizeChange={(width, height) => {
            this.scrollView.scrollToEnd({animated: true});
          }}
        >
          <View style={styles.messagesContainer}>
            {messages}
          </View>
        </ScrollView>

        <View style={styles.textBoxContainer}>
          <TextField
            label='Message'
            style={styles.chatTextBox}
            value={this.state.textBoxValue}
            returnKeyType='send'
            onSubmitEditing={this._sendPress.bind(this)}
            onChangeText={(textBoxValue) => this.setState({textBoxValue})}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  //<editor-fold desc="Keyboard Events">

  _keyboardDidShow() {
    this.scrollView.scrollToEnd({animated: true});
  }

  _sendPress() {
    alert(this.state.textBoxValue);

    this.setState({
      textBoxValue: ''
    });
  }

  //</editor-fold>

  addMessage(message) {
    const messages = this.state.messages;

    messages.push(message);

    this.setState({
      messages: messages
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  textBoxContainer: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    backgroundColor: '#fbfbfb',
    paddingHorizontal: 10,
  },
  chatTextBox: {
    height: -10
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  messagesContainer: {
    marginHorizontal: 5,
    marginBottom: 10
  },
  message: {
    backgroundColor: '#cdcdcd',
    borderRadius: 3,
    padding: 3,

    marginVertical: 5,
  },
  ownMessage: {
    backgroundColor: '#a5a5a5',
  },
  identifier: {
    fontWeight: '500',
    fontSize: 17
  },
  text: {
    fontSize: 17
  }
});
