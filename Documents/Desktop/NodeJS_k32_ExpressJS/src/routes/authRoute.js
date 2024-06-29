const express = require("express");
const { register, login, handleRefreshToken, changePassword, forgotPassword, logout } = require("../controller/authControllers");
const { checkRefreshToken, checkAccessToken } = require("../middleware/auth");
const authRoute = express.Router()

authRoute.post("/register", register)
authRoute.post("/login", login)

//middleware verify refresh token
authRoute.post('/refresh-token', checkRefreshToken, handleRefreshToken)
authRoute.put('/change-password', checkAccessToken, changePassword)
authRoute.put('/forgot-password', forgotPassword)
authRoute.post('/logout', checkAccessToken, logout)

module.exports = authRoute;