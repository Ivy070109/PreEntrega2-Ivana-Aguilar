import cartModel from '../models/carts.model.js'
import productsModel from '../models/products.model.js'
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
    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById({ _id: cartId }).populate({ path: 'products', model: productsModel })
            return cart
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
        } catch (err) {
            return err.message
        }
    }

    // addProductInCart = async (cartId, productId) => {
    //     try {
    //         const filter = { _id: cartId, "products._id": productId._id }
    //         const cart = await cartModel.findById(cartId)
    //         const findProduct = cart.products.some((product) => product._id.toString() === productId._id)
    
    //         if (findProduct) {
    //             const update = { $inc: { "products.$.quantity": productId.quantity } }
    //             await cartModel.updateOne(filter, update)
    //         } else {
    //             const update = { $push: { products: { _id: productId._id, quantity: productId.quantity } } }
    //             await cartModel.updateOne({ _id: cartId }, update)
    //         }
    //         return await cartModel.findById(cartId)
    //     } catch (error) {
    //         return error.message('Error al agregar el producto al carrito')
    //     }
    // }

    //borrar carrito según su id
    deleteCart = async (cartId) => {
        try {
            const cart = await cartModel.findByIdAndDelete(cartId)
            return cart
        } catch (err) {
            return err.message(`No se encuentra el carrito con id: ${cartId}`)
        }
    }

    //agregar producto en carrito
    addProductInCart = async (cartId, product) => {
		try {
            const newProduct = { product: product._id, quantity: 1 }
			const cart = await cartModel.findById(cartId)
			const findProduct = cart.products.findIndex(product => product.product.toString() === newProduct.product)

			if (findProduct === -1) {
				cart.products.push(newProduct)
				const savedCart = await cart.save()
				return savedCart
			} else {
				cart.products[findProduct].quantity++
				const savedCart = await cart.save()
				return savedCart
			}
		} catch (err) {
			return err.message('Error al agregar el producto al carrito')
		}
    }

    //borrar productos en carrito
    deleteProductById = async (cartId, productId) => {
        try {
            const newCart = await cartModel.updateOne({ _id: cartId }, { $pull: { products: { _id: productId } } })
            return newCart
        } catch (err) {
            return err.message()
        }
        // try {
        //     const cart = await this.getCartById(cartId)
        //     if (!cart) {
        //         return err.message(`El carrito no existe`)
        //     }

            // const product = await productsModel.getProductById(productId)
            // if (!product) {
            //     return err.message(`El producto no existe`)
            // }

        //     const deleteProduct = cart.products.findIndex(prod => prod.id_prod._id.toString() === productId)
        //     if (index !== -1) {
        //         cart.products.splice(index, 1)
        //     } else {
        //         return err.message(`El producto no se encuentra en el carrito`)
        //     }

        //     return deleteProduct
        // } catch (err) {
        //     return err.message
        // }
    }

    //modificar producto en carrito 
    updateProductInCart = async (cartId, productId, quantity) => {
        try {
            const update = await cartModel.updateOne({ id: cartId, 'products.product': productId }, { $inc: { 'products.$.quantity': quantity } })
            return update
        } catch (err) {
            return err.message
        }
    }

    //borrar todos los productos 
    deleteAllProductsInCart = async (cartId) => {
        try {
            const deleteAll = await cartModel.updateOne({ id: cartId }, { $set: { products: [] } })
            return deleteAll
        } catch (err) {
            return err.message
        }
    }
}

export default CartManager