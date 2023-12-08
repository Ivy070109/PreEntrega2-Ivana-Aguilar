import { Router } from 'express'
import ProductManager from '../dao/database/ProductManager.js'
import { uploader } from '../uploader.js'
//import productModel from '../dao/models/products.model.js'

const productManager = new ProductManager()
const router = Router()

/*
router.get("/", async (req, res) => {
  const {limit, page, category, status, sort} = req.query
    // const {category} = req.params;
    try {
        let product = await productManager.getProducts(page, limit, category, status, sort)

        const productExist = () => {
            if (Boolean(product.docs)) return 'success'
            else return 'error'
        }
        res.status(200).send({
            status: productExist(),
            payload: product.docs,
            totalDocs: product.totalDocs, 
            limit: product.limit, 
            totalPages: product.totalPages, 
            page: product.page, 
            pagingCounter: product.pagingCounter, 
            hasPrevPage: product.hasPrevPage,
            hasNextPage: product.hasNextPage,
            prevLink: product.prevPage, 
            nextLink: product.nextPage,
        })
    
    } catch (error) {
        res.status(500).send(error.message)
    }
})
*/

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


  /*try {

    //const limit = parseInt(req.query.limit) 
    //const page = parseInt(req.query.page) 
    //const category = req.query
    //const sort = parseInt(req.query.sort) || 0

    // const result = await productModel.Paginate(
    //   {}, 
    //   {
    //   page: page, 
    //   limit: 10, 
    //   //category: category,
    //   //sort: ({price: -1}), 
    //   lean: true
    // })

    const users = await productManager.getProducts()
    res.status(200).send({ status: 'OK', data: users })

    // const response = {
    //   status: "success",
    //         payload: result.docs, 
    //         totalPages: result.totalPages,
    //         prevPage: result.prevPage,
    //         nextPage: result.nextPage,
    //         page: result.page,
    //         hasPrevPage: result.hasPrevPage,
    //         hasNextPage: result.hasNextPage,
    //         prevLink: result.hasPrevPage ? `http://${req.headers.host}${req.baseUrl}?limit=${limit}&page=${result.prevPage}&category=${category}&sort=${sort}` : null,
    //         nextLink: result.hasNextPage ? `http://${req.headers.host}${req.baseUrl}?limit=${limit}&page=${result.nextPage}&category=${category}&sort=${sort}` : null
    //     }

    // res.render('products', { result: result.docs})
    // //limit y page llevan parseo porque se manejaran con números
    // const page = parseInt(req.query.page) || 1
    // const sort = req.query.sort
    // const category = req.query.category
    // const status = req.query.status
    // let options = { page: page, limit: limit, sort: sort, }

    // if(sort === 'desc') {
    //     options.sort = {price : -1}
    // }
    // if(sort === 'asc') {
    //     options.sort = {price : 1}
    // }

    // let filters = {}

    // if(category) {
    //     filters.category = category
    // }

    // if(status) {
    //     filters.status = status
    // }

  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }*/

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