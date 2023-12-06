import mongoose from 'mongoose'
//hay que importar el model de productos porque los vamos a utilizar para el populate
//import productsModel from '../models/products.model.js'

mongoose.pluralize(null)

const collection = "carts"

const schema = new mongoose.Schema({
    // // products: [
    // //     {
    // //         product: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'products' },
    // //         quantity: Number, 
    // //         _id: false, 
    // //     }
    // // ]
    // products: [ { product: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'products' }},
    // quantity: { type: Number, _id: false },]

    // products: [
    //         {
    //             product: {
    //                 type: [ mongoose.Schema.Types.ObjectId ], 
    //                 ref: 'products',
    //                 quantity: Number,
    //                 _id: false,    
    //             },
    //         },
    //     ],

    // products: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'products' }, // ref a la colección
    // //el ref quiere decir que éste array (products) tiene/guarda una referencia con la colección de products (a la que corresponde)
    // quantity: { type: Number, required: true }


    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number, 
                _id: false,
            }
        ],
        default: []
    }
    
})

//populate
// schema.pre('find', function() {
//     this.populate({ path: 'products', model: productsModel });
// })
// schema.pre('find', function () {
//     this.populate('products.productId')
// })
schema.pre('find', function(){
    this.populate('products.product')
})


const model = mongoose.model(collection, schema)
export default model