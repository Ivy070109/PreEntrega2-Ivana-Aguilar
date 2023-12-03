import cartModel from '../models/carts.model.js'
class CartManager {
    constructor() {
    }

    //obtener carrito
    getCarts = async () => {
        try {
            const carts = await cartModel.find().lean()
            return carts
        } catch (err) {
            return err.message
        }
    }

    //obtener el carrito según id
    getCartById = async (cid) => {
        try {
            const cartId = await cartModel.findById({ _id: cid })
            return cartId
        } catch (err) {
            return err.message
        }
    }

    //crear carrito
    addCarts = async (products) => {
        try {
            let cartProducts = {}
            if (products && products.length > 0) {
                cartProducts.products = products
            }
            await cartModel.create(cartProducts)
            return (`Carrito creado`)
        } catch (error) {
            return err.message
        }
    }

    //agregar producto en carrito
    addProductInCart = async (cartId, productId) => {
        try {
            const filter = { _id: cartId, "products._id": productId._id }
            const cart = await cartModel.findById(cartId)
            const findProduct = cart.products.some((product) => product._id.toString() === productId._id);
    
            if (findProduct) {
                const update = { $inc: { "products.$.quantity": productId.quantity } }
                await cartModel.updateOne(filter, update);
            } else {
                const update = { $push: { products: { _id: productId._id, quantity: productId.quantity } } }
                await cartModel.updateOne({ _id: cartId }, update)
            }
            return await cartModel.findById(cartId)
        } catch (err) {
            return err.message('Error al agregar el producto al carrito')
        }
    }
}

export default CartManager