import mongoose from "mongoose"
//importar paginate 
import mongoosePaginate from 'mongoose-paginate-v2'
//import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

mongoose.pluralize(null)

const collection = "products"

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        //index: true,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true 
    },
    code: {
        type: String,
        unique: true, 
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: Boolean,
        default: true 
    }
})

schema.plugin(mongoosePaginate)
//schema.plugin(mongooseAggregatePaginate)

const model = mongoose.model(collection, schema)
export default model