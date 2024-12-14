import 'package:http/http.dart' as http;

void main() async {
  var url = Uri.https(
    'api4.binance.com',
    '/api/v3/klines',
    { 'symbol': 'BTCBRL', 'interval': '1m', 'limit': '10' }
  );
  var response = await http.get(url);
  print(response.body);
}
