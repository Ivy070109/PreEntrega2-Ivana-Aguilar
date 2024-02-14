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

//products solo se mostrará luego de login 
router.get('/products', async (req, res) => {
    const data = await productManager.getProducts(req.query.page, req.query.limit)
    
    data.pages = []
    for (let i = 1; i <= data.totalPages; i++) data.pages.push(i)

    res.render('products', { data })    
})

router.get('/carts', async (req, res) => {
    const cartsProducts = await cartManager.getCarts()
    res.render('carts', { cartsProducts })
})

// Ruta para obtener un carrito por su id.
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params
    let cart = await cartManager.getCartById(cid)

    res.render('cart', { cart })
})

export default router