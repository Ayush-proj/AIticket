import express from "express";
import db from "../config/db.js";


export const createTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, category } = req.body;
        const [result] = await db.execute(
            `INSERT INTO tickets (user_id,title,description,category) values(?,?,?,?)`,
            [userId, title, description, category]
        );

        res.status(201).json({
            message: "ticket created successfully",
            ticketId: result.insertId
        })

    } catch (error) {
        console.log("error in creating tickets");
        res.status(500).json({
            message: "internal server error"
        });

    }
}

export const getMyTickets = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.execute(
            "SELECT * FROM tickets WHERE user_id = ?",
            [userId]
        );

        res.status(200).json({
            message: "Tickets fetched successfully",
            tickets: rows
        });

    } catch (error) {
        console.log("error in fetching tickets", error);

        res.status(500).json({
            message: "Failed to fetch tickets"
        });
    }
};

export const getTicketById = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const userId = req.user.id;

        const [rows] = await db.execute(
            `SELECT * FROM tickets
            where id=? and user_id=?`,
            [ticketId, userId]
        );

        if (rows.length == 0) {
            return res.status(400).json({
                message: "ticket not found",
            });
        }
        res.status(200).json({
            message: "ticlet fetched successfully",
            ticketId: rows[0]
        });


    } catch (error) {
        console.log("error in fetching tickets", error);

        res.status(500).json({
            message: "Failed to fetch tickets"
        });

    }


}

export const updateTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const ticketId = req.params.id;

        const { title, description } = req.body;

        const [rows] = await db.execute(
            `UPDATE tickets set title=?,description =? where id= ? and user_id=? and status="open"`,
            [title, description, ticketId, userId]
        )
        if (rows.affectedRows == 0) {
            return res.status(400).json({
                message: "ticket not found or already closed"

            });
        }
        res.status(200).json({
            message: "ticket updated successfully",
            ticketId: ticketId
        })


    } catch (error) {
        console.log("error in updating ticket", error);
        res.status(500).json({
            message: "Failed to update ticket"
        });
    }
}

export const getAllTicktes = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT
                tickets.id,
                tickets.title,
                tickets.description,
                tickets.category,
                tickets.priority,
                tickets.status,
                tickets.created_at,

                users.name AS customer_name,
                users.email AS customer_email

             FROM tickets

             JOIN users
             ON tickets.user_id = users.id
             ORDER BY tickets.created_at DESC`
        );

        res.status(200).json({
            message: "All tickets fetched Successfully",
            tickets: rows
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch tickets",
        })
    }

}

export const updateTicketStatus = async (req, res) => {

    try {
        const ticketId = req.params.id;
        const { status } = req.body;
        const allowedStatus = [
            "open",
            "in_progress",
            "resolved",
            "closed"
        ];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "invalid ticket status"
            })
        }
        const [result] = await db.execute(
            `UPADATE tickets
            SET status=? where id = ?`, [status, ticketId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            message: "Ticket status updated successfully"
        });

    } catch (error) {
        console.log("error in updating ticket status", error);
        res.status(500).json({
            message: "Failed to update ticket status",
        });

    }
}