import React, {useState, useCallback, useRef} from 'react';
import {LineChart, PieChart} from 'react-native-chart-kit';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Card from '../../../Components/UI/Card';
import MainButton from '../../../Components/UI/CustomButton/MainButton';
import * as salesActions from '../../../store/actions/sales';

const YearlySalesScreen = () => {
  const dispatch = useDispatch();

  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const colors = ['#F44336', '#2196F3', '#4CAF50', '#FFC107', '#FF5722'];

  const sales = useSelector(state => state.sales.yearSales);
  const store = useSelector(state => state.store.myStore);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('year');
  const [errorText, setErrorText] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState();
  useFocusEffect(
    useCallback(() => {
      return dispatch(
        salesActions.fetchYearlyCollectedOrders(
          date.getFullYear(),
          store.storeId,
        ),
      );
    }, [date]),
  );

  let totalRevenue = 0;
  let monthsData = [
    {month: 'January', value: 0},
    {month: 'February', value: 0},
    {month: 'March', value: 0},
    {month: 'April', value: 0},
    {month: 'May', value: 0},
    {month: 'June', value: 0},
    {month: 'July', value: 0},
    {month: 'August', value: 0},
    {month: 'September', value: 0},
    {month: 'October', value: 0},
    {month: 'November', value: 0},
    {month: 'December', value: 0},
  ];
  let products = {};
  let product = [];
  if (sales != undefined) {
    if (sales.length != 0) {
      if (date != null) {
        sales.forEach(item => {
          const datePickedupTimestamp = item.datePickedup;
          const datePickedup = new Date(datePickedupTimestamp.seconds * 1000);
          const monthIndex = datePickedup.getMonth();
          monthsData[monthIndex].value += parseInt(item.totalPrice);
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
  //line
  const labels = monthsData.map(month => month.month);
  const number = monthsData.map(month => month.value);
  const data = {
    labels: labels,
    datasets: [
      {
        data: number,
      },
    ],
  };
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
  const onCapture = useCallback(
    uri => {
      setCapturedImageUri(uri);
    },
    [date],
  );
  const captureAndUpdateImage = () => {
    ref.current.capture().then(uri => {
      onCapture(uri);
    });
  };
  const generatePdf = async () => {
    try {
      if (sales.length != 0) {
        setErrorText(false);
        const lineChartUri = await lineChartRef.current.capture();
        const pieChartUri = await pieChartRef.current.capture();
        const chartHtml = `
      <div>
        <h1 style="text-align: center;">${date.getFullYear()} SALES</h1>
        <img src="${lineChartUri}"width="750px" height="300px" />
        <p>Total Revenue for ${date.getFullYear()}: ₱${totalRevenue}</p>
        <img src="${pieChartUri}"width="750px" height="300px"/>
        <p>Most Popular Product for ${date.getFullYear()}: ${mostPopularProduct}</p>
        <p>Max Sold: ${maxQuantity}</p>
        </div>
    `;
        const options = {
          html: chartHtml,
          fileName: `${date.getFullYear()} Report`,
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
        <Text style={styles.textHeader}>{date.getFullYear()} SALES</Text>
        <View style={styles.buttonDateContainer}>
          <MainButton
            style={styles.button}
            label={'Select Date'}
            onPress={() => {
              showMode('date');
            }}
          />
        </View>
        <Text style={styles.headerText}>Revenue:</Text>
        <ScrollView horizontal={true}>
          <ViewShot ref={lineChartRef}>
            <LineChart
              key={1}
              data={data}
              width={750}
              height={250}
              yAxisLabel="₱"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              renderDotContent={({x, y, index}) => (
                <Text
                  key={index}
                  style={{
                    position: 'absolute',
                    top: y - 15,
                    left: x,
                    textAlign: 'center',
                  }}>
                  {data.datasets[0].data[index].toFixed(2)}
                </Text>
              )}
            />
          </ViewShot>
        </ScrollView>

        <View>
          <Text style={styles.text}>Total Revenue: {totalRevenue}</Text>
        </View>
        <Text style={styles.headerText}>Product Sold:</Text>
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
export default YearlySalesScreen;
