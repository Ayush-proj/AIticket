import express from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
    try {

        const { name, email, password, role = "customer" } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await db.execute(
            'INSERT INTO users(name,email,password,role) values(?,?,?,?)',
            [name, email, hashedPassword, role]
        )
        console.log(name, email, hashedPassword,role);
        res.status(200).json({
            message: "user is registered",
            userId: result.insertId
        });

    } catch (error) {
        console.log("registration error :", error);
        res.status(500).json({
            message: "Internal Server Error: user cannot register"
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email=?',
            [email]
        )
        if (rows.length == 0) {
            return res.status(401).json({ message: "invalid email or password" })
        }

        const user = rows[0]
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: "invalid email or password" })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.status(200).json({
            message: "Login successful", token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {
        console.log("login error", error)
        res.status(500).json({
            message: "internal server error"
        })
    }
};
