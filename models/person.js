const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {    
        console.log('connected to MongoDB')  
    })  
    .catch((error) => {    
        console.log('error connecting to MongoDB:', error.message)  
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: [customValidator, 'Number should be of the form \d{2,3}-\d{1,}'],
        required: true
    }
  })

const customValidator = (value) => {
    const regex = new RegExp('\d{2,3}-\d{1,}');
    return regex.test(value)
}

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)