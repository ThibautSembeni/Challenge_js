module.exports = function productController(productService, options = {}) {
    let result = {
        getOne: async function (req, res, next) {
            try {
                const reference = req.params.reference
                const product = await productService.findOne({ reference: reference })
                if (product) {
                    res.json(product)
                } else {
                    res.status(404).json({ error: "Product not found" })
                }
            } catch (e) {
                next(e)
            }
        },
        getAll: async (req, res, next) => {
            try {
                const results = await productService.findAll()
                if (results) {
                    res.json(results)
                } else {
                    res.status(404).json({ error: "Product not found" })
                }
            } catch (e) {
                next(e)
            }
        },
        create: async (req, res, next) => {
            try {
                const product = req.body;
                const results = await productService.create(product);
                res.status(201).json(product);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        update: async (req, res, next) => {
            try {
                const reference = req.params.reference;
                const product = req.body;
                const results = await productService.update({reference: reference}, product);
                res.status(200).json(product);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        delete: async (req, res, next) => {
            try {
                const reference = req.params.reference;
                const results = await productService.delete({reference: reference});
                res.status(200).json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        }
    }

    return result;
}