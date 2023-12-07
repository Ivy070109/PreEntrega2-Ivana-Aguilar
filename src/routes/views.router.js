import { Router } from 'express'
import ProductManager from '../dao/database/ProductManager.js'
import CartManager from '../dao/database/CartManager.js'

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router()

router.get('/', async (req, res) => {
    const productsList = await productManager.getProducts({})
    res.render('home', { productsList })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

router.get('/products', async (req, res) => {
    const products = await productManager.getProducts(req.query.page || 1, req.query.limit || 10)
    //res.render('products',)
    products.pages = []
    for (let i = 1; i <= products.totalPages; i++) products.pages.push(i)

    res.render('products', { products })

    // const data = await productManager.getProducts(req.query.page || 1, req.query.limit || 10)

    // data.pages = []
    // for (let i = 1; i <= data.totalPages; i++) data.pages.push(i)

    /*res.render('products', {
        title: 'Lista de productos',
        data: data
    })
    //res.status(200).render('products')
    */
})

router.get('/carts', async (req, res) => {
    const cartsProducts = await cartManager.getCarts({})
    res.render('carts', { cartsProducts })
})

export default router