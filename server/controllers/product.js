module.exports = function productController(productService, options = {}) {
    return {
        getOne: async function (req, res, next) {
            try {
                const reference = req.params.reference
                const product = await productService.findOne({merchant_id: req.user.id, reference: reference})
                if (product) {
                    res.json(product)
                } else {
                    res.status(404).json({error: "Product not found"})
                }
            } catch (e) {
                next(e)
            }
        },
        getAll: async (req, res, next) => {
            try {
                const results = await productService.findAll({merchant_id: req.user.id})
                if (results) {
                    res.json(results)
                } else {
                    res.status(404).json({error: "Product not found"})
                }
            } catch (e) {
                next(e)
            }
        },
        create: async (req, res, next) => {
            try {
                const product = req.body;
                product.merchant_id = req.user.id;
                const results = await productService.create(product);
                res.status(201).json(results);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
    };
}