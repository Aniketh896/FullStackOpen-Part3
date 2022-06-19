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

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
              } else {
                response.status(404).end()
              }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndRemove(request.params.id)
      .then(result => {

        if (result) {
            response.status(204).end()
        } else {
            response.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: `${!body.name ? 'name' : 'number'} missing`
        })
    }
    
    Person.find({ name: body.name })
        .then(person => {
            if (person) {

                const updatedPerson = {
                    number: body.number
                }
                
                Person.findByIdAndUpdate(person.id, updatedPerson, { new: true })
                    .then(updatedPerson => {
                      response.json(updatedPerson)
                    })

            } else {

                const person = new Person({
                    name: body.name,
                    number: body.number
                })
              
                person.save().then(savedNote => {
                    response.status(201).json(savedNote)
                })
              }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)