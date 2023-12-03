import { Router } from 'express'
import ProductManager from '../dao/database/ProductManager.js'

const productManager = new ProductManager()

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

export default router