FROM tmvdl/dart

WORKDIR /app

COPY . .

RUN dart pub add http

RUN dart pub get

RUN dart pub upgrade

CMD dart run ./bin/binance.dart
