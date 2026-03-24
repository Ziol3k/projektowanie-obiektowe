FROM frolvlad/alpine-fpc

WORKDIR /app
COPY src/main.pas .

RUN fpc main.pas

CMD ["./main"]
