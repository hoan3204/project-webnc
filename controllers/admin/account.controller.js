const bcrypt = require('bcryptjs');
const AccountAdmin = require("../../models/account-admin.model")
const jwt = require('jsonwebtoken');
const generateHelper = require('../../helpers/generate.helper');
const ForgotPassword = require('../../models/forgot-password.model');
const mailHelper = require('../../helpers/mail.helper')

module.exports.login = async (req,res) => {
    res.render("admin/pages/login.pug",{
        pageTitle:"Đăng nhập"
    })
}

module.exports.loginPost = async (req,res) => {
    const { email, password, rememberPassword } = req.body;
 
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
            expiresIn: rememberPassword ? '30d' :'1d'
        }
        //tao ma va thoi han token
    )

    //luu token vao cookie
    res.cookie("token", token,{
        maxAge: rememberPassword ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000),
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

module.exports.forgotPasswordPOST = async (req, res) => {

    const { email } = req.body;


    //kiểm tra email có tồn tại trong db hay k
    const existAccount = await AccountAdmin.findOne({
        email: email,
    })

    if(!existAccount) {
        res.json({
            code: "error",
            message: "Email khong ton tai trong he thong"
        });
        return;
    }

    //tao otp ngẫu nhiên
    const otp = generateHelper.generateRandomNumber(6);

    //kiem tra email co trong forgotpassword chua
    const existEmailForgotPassword = await ForgotPassword.findOne({
        email:email,
    })
    if(existEmailForgotPassword) {
        res.json({
            code:"error",
            message:"vui lòng thử lại sau 5p"
        });
        return;
    }
    //luu vao db và : email, otp. sau 5p xoa ban ghi
    const newRecord = new ForgotPassword({
        email: email,
        otp: otp,
        expireAt: Date.now() + 5*60*1000,
    })

    await newRecord.save();
    //gui ma otp qua email cho nguoi dung tu dong
    const subject = "Mã OTP lấy lại mật khẩu";
    const content = `Mã OTP của bạn là <b style="color: green">${otp}</b>. Vui lòng không cung cấp cho bất kỳ ai.`;
    mailHelper.sendMail(email, subject, content);

    res.json({
        code:"success",
        message: "Đã gửi mã otp!",
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
module.exports.otpPasswordPost = async (req, res) => {
    const { otp , email } = req.body;

    //kiem tra xem co ton tai ban ghi trong forgotpassword 
    const existRecord = await ForgotPassword.findOne({
        otp: otp,
        email: email,
    })

    if(!existRecord) {
        res.json({
            code:"error",
            message:"Mã OTP không chính xác."
        })
        return;
    }

    //tim thong tin nguoi dung trong accoutadmin
    const account = await AccountAdmin.findOne({
        email: email,
    })
  

    //tao jwt
    const token = jwt.sign(
        {
            id: account.id,
            email: account.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
    //luu vao cookie
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 *1000,
        httpOnly: true,
        sameSite: "strict"
    })


    res.json({
        code:"success",
        message:"Nhập mãotp thành công."
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