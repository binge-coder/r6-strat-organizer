# How to use

- Make sure you have valid .env file
- do this first:
```
npm install
```
- then make the db schema using this command (only needed to be done one time ):
```
npm run push-sql-schema
```

# Running in dev mode (will run slower)
```
npm run dev
```

# Running in production mode (better performance, faster app)
- first build the app once using
```
npm run build
```

- then start the app using this everytime you need this
```
npm run start
```