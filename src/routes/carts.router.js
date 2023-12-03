import { Router } from "express"
import CartManager from "../dao/database/CartManager.js"

const cart = new CartManager()
const cartsRouter = Router()

cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cart.addCarts()
        return res.status(200).send({ status: "OK", data: newCart })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cart.getCarts()
    
        return res.status(200).send({ status: "OK", data: carts })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const foundCart = await cart.getCartById(cid)
    
        return res.status(200).send({ status: "OK", data: foundCart })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body

        const result = await cart.addProductInCart(cartId, { _id: productId, quantity: quantity })

        return res.status(200).send({ message: `El producto ${productId} ha sido agregado al carrito`, cart: result})
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

export default cartsRouter