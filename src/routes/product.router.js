import { Router } from 'express'
import ProductManager from '../dao/database/ProductManager.js'
import { uploader } from '../uploader.js'

const productManager = new ProductManager()
const router = Router()

router.get("/", async (req, res) => {
  const {limit, page, category, sort} = req.query
    // const {category} = req.params;
    try {
      const result = await productManager.getProducts(limit, page, category, sort)

      res.status(200).send({ status: 'OK', data: result})
    } catch (error) {
        res.status(500).send(error.message)
    }
  })

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params
    if (!pid) {
        return res.status(404).send(`El producto no existe`)
    } 
    const productById = await productManager.getProductById(pid)

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

    const result = await productManager.addProduct(newProduct)
    res.status(200).send({ status: 'OK', data: result })
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params
    const objModif = req.body
    const productUpdated = await productManager.updateProduct(pid, objModif)
  
    return res.status(200).send({ status: 'OK', data: productUpdated })  
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid
    const productDeleted = await productManager.deleteProductById(pid)
  
    return res.status(200).send({ status: 'OK', data: productDeleted })
  
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

export default router