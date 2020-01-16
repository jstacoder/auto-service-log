const mongoose = require("mongoose")
const Schema = mongoose.Schema

const EASY = 'EASY'
const INTERMEDIATE = 'INTERMEDIATE'
const HARD = 'HARD'
const IMPOSSIBLE = 'IMPOSSIBLE'

const difficulty = [
    EASY,
    INTERMEDIATE,
    HARD,
    IMPOSSIBLE,
]

const ServiceSchema = new Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true
  },
  estimatedTimeToComplete: {
    minutes: Number,
    hours: Number,
    days: Number,
    months: Number,
    years: Number,
  },
  difficulty:{
    type: String,
    enum: difficulty,
  },
  suggestedServiceInterval: {
    months: Number,
    years: Number,
    miles: Number,
  },
  notes: String,
})

exports = module.exports = mongoose.model('Service', ServiceSchema )
exports.ServiceSchema = ServiceSchema
