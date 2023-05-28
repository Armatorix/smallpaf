FROM golang:1.20.4 AS go-build


WORKDIR /go/src/github.com/Armatorix/smallpaf
COPY ./ ./
RUN go mod download
RUN CGO_ENABLED=0 go build

FROM node:slim AS node-build

WORKDIR /app/react

COPY  ./web ./
RUN npm i && npm run build

FROM debian:bookworm-slim

WORKDIR /app

COPY --from=go-build \
    /go/src/github.com/Armatorix/smallpaf/smallpaf \
    /app/smallpaf

COPY --from=node-build \
    /app/react/build \
    /app/public

RUN apt-get update -y && apt-get install ca-certificates -y

CMD ["/app/smallpaf"]
