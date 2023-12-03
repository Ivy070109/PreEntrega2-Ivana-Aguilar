import { Router } from 'express'
import ProductManager from '../dao/database/ProductManager.js'
import { uploader } from '../uploader.js'

const product = new ProductManager()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const products = parseInt(req.query.limit)
    if(!products) {
      return res.status(200).send({ status: 'OK', data: await product.getProducts() })
    }

    const allProducts = await product.getProducts()
    const limitedProducts = allProducts.slice(0, products)
    return res.status(200).send({ status: 'OK', data: limitedProducts })
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params
    if (!pid) {
        return res.status(404).send(`El producto no existe`)
    } 
    const productById = await product.getProductById(pid)

    res.status(200).send({ status: 'OK', data: productById })
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.post("/", uploader.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ status: 'FIL', data: 'No se pudo subir el archivo' })

    const { title, description, price, category, status, code, stock } = req.body
    if (!title || !description || !price || !category || !status || !code || !stock) {
        return res.status(400).send({ status: 'ERR', data: 'Debes proporcionar todos los campos completos. Todos los valores son obligatorios.' })
    }

    const newProduct = {
        title,
        description,
        price,
        category,
        status,
        thumbnail: req.file.filename,
        code,
        stock
    }

    const result = await product.addProduct(newProduct)
    res.status(200).send({ status: 'OK', data: result })
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params
    const objModif = req.body
    const productUpdated = await product.updateProduct(pid, objModif)
  
    return res.status(200).send({ status: 'OK', data: productUpdated })  
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid
    const productDeleted = await product.deleteProductById(pid)
  
    return res.status(200).send({ status: 'OK', data: productDeleted })
  
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

export default router