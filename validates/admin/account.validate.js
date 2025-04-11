const Joi = require('joi');


module.exports.registerPost = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string()
            .required()
            .min(5)
            .max(50)
            .messages({
                "string.empty" : "vui lòng nhập họ tên!",
                "string.min": "Họ tên có ít nhất 5 ký tự!",
                "string.max": "Họ tên có tối đa 50 ký tự"
            }),
        email: Joi.string()
            .required()
            .email()

            .messages({
                "string.empty": "viu lòng nhập email!",
                "string.email": "Email không đúng định dạng!"
            }),
        password: Joi.string()
            .required()
            .min(8)
            .custom((value, helpers) => {
                if(!/[A-Z]/.test(value)) {
                    return helpers.error('password.uppercase');
                }
                if(!/[a-z]/.test(value)) {
                    return helpers.error('password.lowercase')
                }
                if(!/\d/.test(value)){
                    return helpers.error('password.number')
                }
                if(!/[@$!%*?&]/.test(value)){
                    return helpers.error('password.special')
                }
                return value;
            })
            .messages({
                "string.empty": "Vui lòng nhập mật khẩu!",
                "string.min": "mật khẩu có ít nhất 8 ký tự!",
                "password.uppercase":"Mật khẩu phải có chữ viết hoa!",
                "password.lowercase": "Mật khẩu phải có chữ cái thường!",
                "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
                "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!"

            }),
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


module.exports.loginPost = async (req, res , next) => {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email()
            .messages({
                "string.empty": "Vui lòng nhập email!",
                "string.email": "Email không đúng định dạngdạng",
            }),
        password: Joi.string()
        .required()
        .min(8)
        .custom((value, helpers) => {
            if(!/[A-Z]/.test(value)) {
                return helpers.error('password.uppercase');
            }
            if(!/[a-z]/.test(value)) {
                return helpers.error('password.lowercase')
            }
            if(!/\d/.test(value)){
                return helpers.error('password.number')
            }
            if(!/[@$!%*?&]/.test(value)){
                return helpers.error('password.special')
            }
            return value;
        })
        .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "mật khẩu có ít nhất 8 ký tự!",
            "password.uppercase":"Mật khẩu phải có chữ viết hoa!",
            "password.lowercase": "Mật khẩu phải có chữ cái thường!",
            "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
            "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!"

        }),
    });

    const { error } = schema.validate(req.body);

    if(error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
}