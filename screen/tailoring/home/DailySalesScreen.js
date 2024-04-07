import React, {useState, useRef, useCallback} from 'react';
import {LineChart, PieChart} from 'react-native-chart-kit';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Card from '../../../Components/UI/Card';
import MainButton from '../../../Components/UI/CustomButton/MainButton';
import * as salesActions from '../../../store/actions/sales';

const DailySalesScreen = () => {
  const dispatch = useDispatch();
  const pieChartRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('year');
  const [errorText, setErrorText] = useState(false);
  const sales = useSelector(state => state.sales.dailySales);
  const store = useSelector(state => state.store.myStore);

  const colors = ['#F44336', '#2196F3', '#4CAF50', '#FFC107', '#FF5722'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  useFocusEffect(
    useCallback(() => {
      if (date != null) {
        dispatch(
          salesActions.fetchDailyCollectedOrders(
            date.getDate(),
            date.getMonth(),
            date.getFullYear(),
            store.storeId,
          ),
        );
      }
    }, [date]),
  );
  let totalRevenue = 0;
  let products = {};
  let product = [];
  if (sales != undefined) {
    if (sales.length != 0) {
      if (date != null) {
        sales.forEach(item => {
          totalRevenue += parseInt(item.totalPrice);
          item.items.map(product => {
            const productId = product.productId;
            const productName =
              productId === '1' ? 'Custom Product' : product.productTitle;

            if (products[productName]) {
              products[productName]++;
            } else {
              products[productName] = 1;
            }
          });
        });
      }
    }
  }
  let mostPopularProduct = null;
  let maxQuantity = 0;

  for (const productName in products) {
    if (products.hasOwnProperty(productName)) {
      const quantity = products[productName];

      if (quantity > maxQuantity) {
        maxQuantity = quantity;
        mostPopularProduct = productName;
      }
    }
  }
  let index = 0;
  for (let x in products) {
    if (index >= colors.length) {
      index = 0; // Reset index if it exceeds the number of available colors
    }
    const newProduct = {name: x, value: products[x], color: colors[index]};
    product.push(newProduct);
    index++;
  }
  const pieData = product;
  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    setShow(false);
  };

  const showMode = modeToShow => {
    setShow(true);
    setMode(modeToShow);
  };
  const generatePdf = async () => {
    try {
      if (sales.length != 0) {
        setErrorText(false);
        const pieChartUri = await pieChartRef.current.capture();
        const chartHtml = `
        <div>
          <h1 style="text-align: center;">${date.getDate()}, ${
          months[date.getMonth()]
        }, ${date.getFullYear()} Sales</h1>
          <p>Total Revenue for ${date.getFullYear()}: ₱${totalRevenue}</p>
          <img src="${pieChartUri}"width="750px" height="300px"/>
          <p>Most Popular Product for ${date.getFullYear()}: ${mostPopularProduct}</p>
          <p>Max Sold: ${maxQuantity}</p>
          </div>
      `;
        const options = {
          html: chartHtml,
          fileName: `${date.getDate()}, ${
            months[date.getMonth()]
          }, ${date.getFullYear()} Report`,
          directory: 'Downloads',
        };
        const pdf = await RNHTMLtoPDF.convert(options);
        openOrSharePDF(pdf.filePath);
      } else {
        setErrorText(true);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  const openOrSharePDF = async file => {
    try {
      await Share.open({
        title: 'Open or Share PDF',
        url: `file://${file}`,
        type: 'application/pdf',
      });
    } catch (error) {}
  };
  return (
    <ScrollView>
      <Card style={styles.container}>
        <Text style={styles.textHeader}>
          {date.getDate()},{months[date.getMonth()]},{date.getFullYear()} Sales
        </Text>
        <View style={styles.buttonDateContainer}>
          <MainButton
            style={styles.button}
            label={'Select Date'}
            onPress={() => {
              showMode('date');
            }}
          />
        </View>
        <View
          style={{
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderWidth: 1,
            borderRadius: 10,
          }}>
          <Text style={styles.tatalText}>Today's Revenue</Text>
          <Text style={styles.revenueText}>₱{totalRevenue}</Text>
        </View>
        <ScrollView horizontal={true}>
          <ViewShot ref={pieChartRef}>
            <PieChart
              data={pieData}
              width={300}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </ViewShot>
        </ScrollView>

        <View>
          <Text style={styles.text}>Most Popular: {mostPopularProduct}</Text>
        </View>

        <View>
          <Text style={styles.text}>Max Sold: {maxQuantity}</Text>
        </View>
      </Card>
      <Card style={styles.container}>
        <View style={styles.buttonContainer}>
          <MainButton
            style={styles.button}
            label={'Generate Report'}
            onPress={generatePdf}
          />
          {errorText && (
            <Text style={{color: 'red', fontWeight: 'bold'}}>
              Nothing to Generate
            </Text>
          )}
        </View>
      </Card>
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2.5,
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },

  text: {
    color: 'black',
  },
  tatalText: {
    color: 'black',

    alignSelf: 'center',
    fontSize: 30,
  },
  revenueText: {
    color: 'black',

    alignSelf: 'center',
    fontSize: 25,
  },
  textHeader: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
  },
  buttonDateContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginBottom: 1,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: '50%',
    margin: 5,
    height: 40,
    borderRadius: 10,
  },
});
export default DailySalesScreen;
