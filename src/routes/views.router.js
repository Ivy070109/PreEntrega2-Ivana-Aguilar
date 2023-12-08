import { Router } from 'express'
import ProductManager from '../dao/database/ProductManager.js'
import CartManager from '../dao/database/CartManager.js'

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router()

router.get('/', async (req, res) => {
    const productsList = await productManager.getProducts()
    res.render('home', { productsList })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

router.get('/products', async (req, res) => {
    const products = await productManager.getProducts(req.query.page || 1, req.query.limit || 3)
    
    products.pages = []
    for (let i = 1; i <= products.totalPages; i++) products.pages.push(i)

    res.render('products', { products })
})

router.get('/carts', async (req, res) => {
    const cartsProducts = await cartManager.getCarts()
    res.render('carts', { cartsProducts })
})

export default router