import 'package:http/http.dart';

void main() async {
  var response = await get(Uri.https(
    'api4.binance.com',
    '/api/v3/klines',
    { 'symbol': 'BTCBRL', 'interval': '1m', 'limit': '10' }
  ));

  print(response.body);
}
