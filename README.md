# Small Planning Async Format

created for asynchronous planning sessions

## Developemnt requirement

- [air](https://github.com/cosmtrek/air) - for API hot reload

## Development

Open 4 windows
Run each command in the different one

```bash
npm start
export $(cat .env | grep -v "#"| xargs) && air
docker-compose up
```

The last one is for you <3

Hot reload on API and WEB
