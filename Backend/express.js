import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes);
app.get('/', (req, res) => {
    res.send("Ayush is here to rule this world")
})


app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT 1 + 1 AS result"
        );

        res.json({
            message: "MySQL connected successfully",
            result: rows[0].result
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

app.get("/test-me", async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT 2+2 AS result"
        )

        res.json({
            message: "Ayush is here to rule this world",
            result: rows[0].result

        })
    } catch (error) {
        res.status(500).json(
            {
                message: "database connection failes"
            }
        );
    }
})

app.use("/api/ticket", ticketRoutes);

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});

