import mongoose from 'mongoose'
//hay que importar el model de productos porque los vamos a utilizar para el populate
import productsModel from '../models/products.model.js'

mongoose.pluralize(null)

const collection = "carts"

const schema = new mongoose.Schema({
    products: [
        {
            product: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'products' },
            quantity: Number, 
            _id: false, 
        }
    ]

        //[
        //     {
        //         product: {
        //             type: mongoose.Schema.Types.ObjectId, 
        //             ref: 'products'
        //         },
        //         quantity: Number,
        //         _id: false,
        //     },
        // ],


})

//populate
schema.pre('find', function() {
    this.populate({ path: 'products', model: productsModel });
})

const model = mongoose.model(collection, schema)
export default model