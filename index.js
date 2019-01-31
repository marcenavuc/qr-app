import {name as appName} from './app.json';
import React, { Component, ActivityIndicator, } from 'react';
 
import {
  AppRegistry,
  StyleSheet,
  Text,
} from 'react-native';
 
import QRCodeScanner from 'react-native-qrcode-scanner';
class ScanScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
        text: '',
        visitText: '',
        activate: false,
        lastId: 0};
    }

  onSuccess(e) {
    if (e.data != this.state.lastId) {
      this.setState({activate: false})
      this.getResponse(e.data)
    }
  }

  componentDidMount() {
    this.updateServer()
  }

  updateServer() {
    this.setState({text: 'Будим сервер'})
    fetch('https://qr-test-for-school.herokuapp.com/')
    .then((response) => {
      if (response.status == 200) {
        this.setState({activate: true})
        this.setState({text: 'Сервер готов к работе)'})
      }
    })
    .catch(() => {
      alert("Что-то пошло не так. Перезагрузите приложение")
    })
  }

  getResponse(id_num) {
    this.setState({text: 'Ждем ответ от сервера'})
    fetch('https://qr-test-for-school.herokuapp.com/json-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        id: id_num
      }),
    })
    .then((response) => {
      if (response.status == 200) {
        return response.json()
      } else {
        alert("Something went wrong")
      }
    })
    .then((responseJson) => {
      if(responseJson.visited) {
        this.setState({visitText: 'Билет уже отсканирован'})
      } else {
        this.setState({visitText: 'Билет засчитан'})
      }
      alert(this.state.visitText + '\n' + 
      'Ряд: ' + responseJson['row'] + '\n' +
      'Место: ' + responseJson['place'])
      this.setState({text: 'Ряд: ' + responseJson['row'] +
       'Место: ' + responseJson['place']})
      return responseJson
    })
    .catch((error) => {
      alert("Что-то пошло не так. Перезагрузите приложение")
    });
    this.setState({activate : true, lastId: id_num})
  }

  render() {
    return (
      <QRCodeScanner
        reactivate = {this.state.activate}
        onRead={this.onSuccess.bind(this)}
        reactivateTimeout={1000}
        bottomContent={
          <Text style={styles.centerText}>
             {this.state.text}
          </Text>
        }
      />
    );
  }
}
 
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
 
AppRegistry.registerComponent(appName, () => ScanScreen);
