FROM tmvdl/dart

WORKDIR /app

COPY . .

RUN dart pub get

CMD dart run ./bin/binance.dart
