module.exports = function productController(productService, options = {}) {
    let result = {
        getOne: async function (req, res, next) {
            try {
                const reference = req.params.reference
                let criteria = {}
                if (req?.user?.id) {
                    console.log("ok")
                    criteria = {merchant_id: req.user.id, reference: reference}
                } else {
                    console.log("ok")
                    criteria = {reference: reference}
                }
                const product = await productService.findOne(criteria)
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
                let criteria = {}
                if (req?.user?.role === 'customer') {
                    criteria = {}
                }
                else {
                    criteria = {merchant_id: req.user.id}
                }
                const results = await productService.findAll(criteria)
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
    }

    return result;
}