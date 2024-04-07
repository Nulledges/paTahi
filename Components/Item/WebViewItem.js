import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import * as paymentActions from '../../store/actions/payment';
const WebViewItem = props => {
  const dispatch = useDispatch();
  const webViewRef = useRef(null);

  // Function to send data to the WebView and inject JavaScript
  const sendDataToWebView = () => {
    const data = {
      message: props.items,
    };
    const dataToSend = {
      message: [
        {
          id: 'order1',
          items: [
            {name: 'Item 1', price: 500.0, quantity: 1},
            {name: 'Item 2', price: 1000.0, quantity: 2},
          ],
        },
        {
          id: 'order2',
          items: [
            {name: 'Item 3', price: 50.0, quantity: 3},
            {name: 'Item 4', price: 300.0, quantity: 1},
          ],
        },
      ],
    };

    const jsCode = `window.postMessage(JSON.stringify(${JSON.stringify(
      data,
    )}), '*');`;
    webViewRef.current.injectJavaScript(jsCode);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: 'https://patahi-dev.web.app/'}}
        onLoad={() => sendDataToWebView()} // This sends data once the WebView has loaded
        onMessage={event => {
       
          dispatch(
            paymentActions.AddPayment(JSON.parse(event.nativeEvent.data)),
          );
        }}
        javaScriptEnabled={true}
        cacheEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});

export default WebViewItem;
