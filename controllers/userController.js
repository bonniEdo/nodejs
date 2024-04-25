const asyncHanlder = require("express-async-handler");
const User = require("../models/userModels")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//register a user
const registerUser = asyncHanlder(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        console.log("11")
        res.status(400);
        throw new Error("All fields is mandatory")
    }

    const userAvailible = await User.findOne({ email })
    if (userAvailible) {
        res.status(400);
        throw new Error("User already registered!")
    }


    // hash pwd
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Passeord: ", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,

    });
    console.log(`user create, ${user}`)
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email })
    } else {
        res.status(400)
        throw new Error("user data is not vaild")
    }
    res.json({ message: "Register the user" });
});
//login user
const loginUser = asyncHanlder(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json(404)
        throw new Error("all fields are mandatory")
    }
    const user = await User.findOne({ email });
    //compare current pwd and hash password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_SECERT,
            { expiresIn: "15m" });

        res.status(200).json({ accessToken })

    } else {
        res.status(401)
        throw new Error("email or password is not vaild")

    }
});
//current user information
const currentUser = asyncHanlder(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser }