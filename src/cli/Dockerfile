FROM tmvdl/dart

WORKDIR /app

COPY . .

RUN dart compile exe ./bin/binance.dart

CMD ./bin/binance.exe
