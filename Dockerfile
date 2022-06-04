FROM golang:1.18.3 AS go-build


WORKDIR /go/src/github.com/Armatorix/smallpaf
COPY ./ ./
RUN go mod download
RUN CGO_ENABLED=0 go build

FROM node:slim AS node-build

WORKDIR /app/react

COPY  ./web ./
RUN npm i && npm run build

FROM debian:stretch-slim

WORKDIR /app

COPY --from=go-build \
    /go/src/github.com/Armatorix/smallpaf/smallpaf \
    ./

COPY --from=node-build \
    /app/react/build \
    ./react

CMD ["/app/smallpaf"]
