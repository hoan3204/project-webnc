const bcrypt = require('bcryptjs');
const AccountAdmin = require("../../models/account-admin.model")
const jwt = require('jsonwebtoken');

module.exports.login = async (req,res) => {
    res.render("admin/pages/login.pug",{
        pageTitle:"Đăng nhập"
    })
}

module.exports.loginPost = async (req,res) => {
    const { email, password } = req.body;
 
    const existAccount = await AccountAdmin.findOne({
        email:email
    });
    if(!existAccount){
        res.json({
            code:"error",
            message: "Email không tồn tại trong hệ thống!"
        });
        return;
    }

    const ispasswordValid = await bcrypt.compare(password, existAccount.password);
    if(!ispasswordValid){
        res.json({
            code:"error",
            message: "Mật khẩu không đúng!"
        });
        return;
    }

    if(existAccount.status != "active") {
        res.json({
            code: "error",
            message: "Tài khoản chưa được kích hoạt!"
        });
        return;
    };
    
    //tao jwt
    const token = jwt.sign(
        {
            id: existAccount.id,
            email: existAccount.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
        //tao ma va thoi han token
    )

    //luu token vao cookie
    res.cookie("token", token,{
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly:true,
        sameSite: "strict"
    })

    res.json({
        code: "success",
        message: "Đăng nhập thành công!"
    });
}

module.exports.forgotPassword = async (req,res) => {
    res.render("admin/pages/forgot-password",{
        pageTitle:"Quên mật khẩu"
    })
}

module.exports.register = async (req,res) => {
    res.render("admin/pages/register.pug",{
        pageTitle:"Đăng ký"
    })
}

module.exports.registerPost = async (req, res) => {
    const { fullName, email, password } = req.body;
  
    const existAccount = await AccountAdmin.findOne({
      email: email
    });
  
    if(existAccount) {
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!"
      });
      return;
    }
  
    //ma hoa mat khau
    const salt = await bcrypt.genSalt(10);//tao 10 ky tu ngau nhien
    const hashPassword = await bcrypt.hash(password, salt);



    const newAccount = new AccountAdmin({
      fullName: fullName,
      email: email,
      password: hashPassword,
      status: "initial"
    });
  
    await newAccount.save();
  
    res.json({
      code: "success",
      message: "Đăng ký tài khoản thành công!"
    });
  }
  

module.exports.registerInitial = async (req,res) => {
    res.render('admin/pages/register-initial', {
        pageTitle:"Tai khoan duoc khoi tao"
    })
}

module.exports.otpPassword = async (req,res) => {
    res.render("admin/pages/otp-password.pug",{
        pageTitle:"Nhập mã OTP"
    })
}

module.exports.resetPassword = async (req,res) => {
    res.render("admin/pages/reset-password",{
        pageTitle:"Đổi mật khẩu"
    })
}

module.exports.logoutPOST = async (req,res) => {
    res.clearCookie("token");
    res.json({
        code:"success",
        message: "Đăng xuất thành công!"
    })
}