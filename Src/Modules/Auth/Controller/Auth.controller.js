
import userModel from "../../../../DB/Models/User.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from "../../../Services/sendEmail.js";

export const signup = async (req, res, next) => {

    const { userName, email, password, gender } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(409).json({ message: "Email exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SAlTROUND));

    const createUser = await userModel.create({
        userName, email, password: hashedPassword, gender
    });
    const token = jwt.sign({ email }, process.env.EMAILTOKEN, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ email }, process.env.EMAILTOKEN, { expiresIn: 60 * 60 * 24 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/NewconfirmEmail/${refreshToken}`;
    const html = `<a href=${link}>verify email</a> or <a href=${refreshLink}>request new email to verify your email</a>`;
    sendEmail(email, "confirm email", html);
    return res.status(201).json({ message: "success", user: createUser._id });

}

export const signin = async (req, res, next) => {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        //return res.status(404).json({ message: "data invaild" });
        return next(new Error("data invaild"));
    }

    if (!user.confirmEmail) {
        // return res.status(400).json({ message: "plz confirm your eamil " });
        return next(new Error("plz confirm your eamil"));
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        //return res.status(404).json({ message: "data invaild"});
        return next(new Error("data invaild"));
    }

    const token = jwt.sign({ id: user._id }, process.env.LOGINSIGNATURE, { expiresIn: '1h' });
    return res.status(200).json({ message: "success", token });

}

export const confirmEmail = async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.EMAILTOKEN)

    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false }, { confirmEmail: true });

    if (!user) {
        // return res.status(400).json({ message: "your email is verified" });
        return next(new Error("your email is verified"));
    }

    if (user) {

        return res.redirect(process.env.FRONTEND_LOGIN);
    }

}

export const newconfirmEmail = async (req, res, next) => {
    const { Refreshtoken } = req.params;
    const decoded = jwt.verify(Refreshtoken, process.env.EMAILTOKEN);

    const emailtoken = jwt.sign({ email: decoded.email }, process.env.EMAILTOKEN, { expiresIn: '1h' })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${emailtoken}`
    const html = `<a href='${link}'>verify email</a> or <a href=${link}>request new email to verify your email</a>`

    await sendEmail(decoded.email, "confirm email", html)
    return res.status(201).json({ message: "new email is sent succcessfully" })

} 