
module.exports = function TemplateController(Service) {
    return {
        getTemplate: async (req, res, next) => {
            try {
                const msg = await Service.templateFunction()
                res.json(msg);
            } catch (error) {
                next(error);
            }
        },
    };
};