const bcrypt = require("bcrypt");
const _ = require("lodash");
const { saltRounds, hashPassword, checkPasswordUser, checkEmailUser } = require ("../utils/index");
const { handleResponseSuccess, handleResponseError } = require("../utils/responses");
const { generateAccessToken, generateRefreshToken, sampleRefreshTokens } = require("../middleware/auth");

const users = [
    { email: "user1@gmail.com", password: bcrypt.hashSync("user1", saltRounds), role: "admin"},
    { email: "user2@gmail.com", password: bcrypt.hashSync("user2", saltRounds), role: "user"}
];

const register = async (req, res) => {
    const newUser = req.body;
    console.log({ newUser });
    const { password } = newUser;
    try {
        newUser.password = await hashPassword(password);
        users.push({ ...newUser, role: "user" });
        const cloneNewUser = { ...newUser, role: "user"};
        delete cloneNewUser.password;
        handleResponseSuccess(res, 201, "Register successfully", { ...cloneNewUser })
    } catch (err) {
        handleResponseError(res, 500, "Internal server error")
    }
}

const login = async (req, res) => {
    const user = req.body;
    const { email, password } = user;
    try {
        const checkedEmailUser = checkEmailUser(users, email);
        if (!checkedEmailUser) {
            handleResponseError(res, 401, "Email is incorrect")
            return
        }

        const checkedPasswordUser = await checkPasswordUser(password, checkedEmailUser.password);
        if (!checkedPasswordUser) {
            handleResponseError(res, 401, "Password is incorrect")
            return
        }

        const accessToken = generateAccessToken({ email: checkedEmailUser.email, password: checkedEmailUser.password, role: checkedEmailUser.role });

        const refreshToken = generateRefreshToken({ email: checkedEmailUser.email, password: checkedEmailUser.password, role: checkedEmailUser.role });

        sampleRefreshTokens.push(refreshToken);
        const cloneUser = { ...checkedEmailUser };
        delete cloneUser.password;
        handleResponseSuccess(res, 200, "Login successfully", {
            ...cloneUser,
            accessToken, 
            refreshToken
        })
    } catch (error) {
        handleResponseError(res, 500, "Internal server error")
    }
}

const handleRefreshToken = (req, res) => {
    // const authorizationHeader = req.headers.authorization;
    // const refreshToken = _.last(authorizationHeader.split(" "));
    console.log("res.locals.dataTemp", res.locals.dataTemp)
    const newAccessToken = generateAccessToken({
        ...res.locals.dataTemp
    })
    console.log({ newAccessToken })
    handleResponseSuccess(res, 200, "Refresh token successfully", { newAccessToken });
}

const changePassword = async (req, res) => {
    const { email, password, newPassword } = req.body;
    try {
        const checkedEmailUser = checkEmailUser(users, email);
        if (!checkedEmailUser) {
            handleResponseError(res, 401, "Email is incorrect")
            return
        }

        const checkedPasswordUser = await checkPasswordUser(password, checkedEmailUser.password);
        if (!checkedPasswordUser) {
            handleResponseError(res, 401, "Password is incorrect")
            return
        }
        checkedEmailUser.password = await hashPassword(newPassword);
        handleResponseSuccess(res, 200, "Change password successfully")
    } catch (error) {
        handleResponseError(res, 500, "Internal server error")
    }
}

const forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const checkedEmailUser = checkEmailUser(users, email);
        if (!checkedEmailUser) {
            handleResponseError(res, 401, "Email is incorrect")
            return
        }
        checkedEmailUser.password = await hashPassword(newPassword);
        handleResponseSuccess(res, 200, "Reset password successfully")
    } catch (error) {
        handleResponseError(res, 500, "Internal server error")
    }
}

const logout = (req, res) => {
    handleResponseSuccess(res, 200, "Logout successfully")
}

module.exports = {
    register,
    login,
    handleRefreshToken,
    changePassword,
    forgotPassword,
    logout
}
