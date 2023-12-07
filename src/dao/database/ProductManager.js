import productModel from "../models/products.model.js"
import mongoosePaginate from 'mongoose-paginate-v2'

class ProductManager {
    constructor() {
    }

    //leer los productos
    readProducts = async () => {
        try {
            // const products = await productModel.paginate(
            //     {}, 
            //     {   
            //         page: page, 
            //         limit: limit,
            //         category: category,
            //         sort: sort,
            //         lean: true,
            //     }
            // )
            // return products

            const products = await productModel.find().lean()
            return products
        } catch (err) {
            return err.message
        }
    }

    //creación de productos
    addProduct = async (product) => {
        try {
            const productCreated = await productModel.create(product)
            return productCreated
        } catch (err) {
            return err.message
        }
    }

    //obtener todos los productos
    getProducts = async (page, limit, category, sort, status) => {
        let options = {
			page: page || 1,
			limit: limit || 10
		}
		try {
			if (category) {
				const products = await productModel.paginate({ category: category }, options)
				return products
			}

			if (status) {
				const products = await productModel.paginate({ status: status }, options)
				return products
			}

			if (sort) {
				if (sort === 'asc') {
					options.sort = { price: 1 }
					console.log(options)

					const products = await productModel.paginate({}, options)
					return products
				}
				if (sort === 'desc') {
					options.sort = { price: -1 }
					const products = await productModel.paginate({}, options)
					return products
				}
			}

			const products = await productModel.paginate({}, options)
			return products
        } catch (err) {
            return err.message
        }
    }

    //Obtener productos según su id
    getProductById = async (pid) => {
        try {
            const productById = await productModel.findById(pid)
            if (!productById) {
                return "El producto no existe"
            } else {
                return productById
            }
        } catch (err) {
            return err.message
        }
    }

    //Actualizar productos según su id
    updateProduct = async (pid, objModif) => {
        try {
            const productUpdated = await productModel.findByIdAndUpdate(pid, { $set: objModif })
            return productUpdated
        } catch (err) {
            return err.message
        }
    }

    //Borrar productos según su id
    deleteProductById = async (pid) => {
        try {
            const deleteProduct = await productModel.deleteOne({ _id: pid })
            return deleteProduct
        } catch (err) {
            return err.message
        }
    }
}

export default ProductManager