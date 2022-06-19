require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', (request) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const getRandomId = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

app.get('/', (request, response) => {
    response.send('<h1>Root URL | Go To /api/persons for PhoneBook</h1>')
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    // const person = persons.find(person => person.id === id)

    Note.findById(request.params.id).then(person => {
        response.json(person)
      })

    // if (person) {    
    //     response.json(person)  
    // } else {    
    //     response.status(404).end()  
    // }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    // const found = persons.find(person => person.name === body.name)
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: `${!body.name ? 'name' : 'number'} missing`
        })
    } // else if (found) {
    //     return response.status(400).json({ 
    //         error: 'name must be unique '
    //     })
    // }
  
    const person = new Person({
        name: body.name,
        number: body.number
    })
  
    person.save().then(savedNote => {
        response.status(201).json(savedNote)
      })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)