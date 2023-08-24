import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewItem = props => {
  const webViewRef = useRef(null);

  // Function to send data to the WebView and inject JavaScript
  const sendDataToWebView = () => {
    const dataToSend = { message: props.cartId };
    const jsCode = `window.postMessage(JSON.stringify(${JSON.stringify(
      dataToSend
    )}), '*');`;
    webViewRef.current.injectJavaScript(jsCode);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://patahi-dev.web.app/' }}
        onLoad={() => sendDataToWebView()} // This sends data once the WebView has loaded
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewItem;