import 'package:http/http.dart' as http;

void main() async {
  var symbol = 'BTCBRL';
  var interval = '1m';
  var url = Uri.https('api4.binance.com', '/api/v3/klines', {'symbol': symbol, 'interval': interval});
  
  var response = await http.get(url);
  var jsonResponse = response.body;
  print('JSON response: $jsonResponse.');
}
