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
    }

    return result;
}