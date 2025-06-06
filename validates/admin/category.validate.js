const Joi = require('joi');


module.exports.createPost = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty" : "vui lòng nhập tên danh muc!",
            }),
        parent: Joi.string().allow(""),
        position: Joi.string().allow(""),
        avatar: Joi.string().allow(""),
        status: Joi.string().allow(""),
        description: Joi.string().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;

        res.json({
            code:"error",
            message:errorMessage,
        });
        return;
    }
    next();
}
