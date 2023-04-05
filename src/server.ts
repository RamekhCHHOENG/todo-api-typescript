import express, { Express, Request, Response } from 'express'
import mongoose, { ConnectOptions } from 'mongoose'
import cors, { CorsOptions } from 'cors'

const app: Express = express()

// connection to mongodb
const uri: string = process.env.MONGODB_URI || "mongodb://localhost/todo_express"

interface MongoOptions extends ConnectOptions {
    useNewUrlParser: boolean
    useUnifiedTopology: boolean
}

const options: MongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  

mongoose.connect(uri, options).then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error(`Error connecting to MongoDB: ${err}`))

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// routes
import todoRoutes from './routes/todo'
app.use(todoRoutes)

// server configurations
const port: number = parseInt(process.env.PORT || "3100")
app.listen(port, () => console.log(`Server started listening on port: ${port}`))
