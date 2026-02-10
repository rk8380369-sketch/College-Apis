const express = require('express');
const app = express();
const db = require('./db');
app.use(express.json());

app.post('/addStudent', (request, response) => {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
        response.status(400).json({
            message: "All Fields are required."
        });
    }
    const sqlQ = "INSERT INTO students(name, email,password) VALUES (?,?,?)";
    db.query(sqlQ, [name, email, password], (error, result) => {
        if (error) {
            response.status(500).json({
                message: "Server Internal Errors: ",
                error
            });
        }
        response.status(201).json({
            message: "New Student Added Successfully.",
            name,
            email
        });
    });
});

app.get("/allStudents", (request, response) => {
    const sqlQ = "SELECT * FROM students";
    db.query(sqlQ, (error, result) => {
        if (error) {
            response.status(500).json({ message: "Server internal Errors:" + error })
        }
        response.status(200).json({
            message: "All Students Fetched Successfully.",
            result
        })
    })
});

// get Student By Name
app.get("/student/name/:name", (request, response) => {

    const name = request.params.name;

    const sqlQ = "SELECT * FROM students WHERE name=?";
    db.query(sqlQ, [name], (error, result) => {
        if (error) {
            response.status(500).json({ message: "Server internal Errors:" + error })
        }
        response.status(200).json({
            message: "All Students Fetched Successfully.",
            result
        })
    })
});

/// Delete Srudent By Id
app.delete('/deleteStudent/id/:id', (request, respnse) => {
    const sId = parseInt(request.params.id);
    const sqlQ = "DELETE FROM students WHERE id=?";

    db.query(sqlQ, [sId], (error, result) => {
        if (error) {
            response.status(500).json({ message: "Server internal Errors:" + error })
        }
        if (result.affectedRows === 0) {

            respnse.status(404).json({
                message: "Student Not Found"
            })

        }
        else {

            respnse.status(201).json({
                message: "Student Deleted Successfully",
                sId
            })
        }

    })
})

/// Update Data using PUT Method  By ID

app.put('/updateStudent/:id', (request, response) => {
    const sId = parseInt(request.params.id);
    const { name, password } = request.body;
    const sqlQ = "UPDATE students SET name=?, password=? WHERE id=?";

    db.query(sqlQ, [name, password, sId], (error, result) => {
        if (error) {
            console.log("Server Internal Error:" + error);
            response.status(500).json({
                message: "Server Internal Error",
                error
            })
        }

        if (result.affectedRows === 0) {
            response.status(404).json({
                message: "User Not Found"
            })
        }
        else {
            response.status(201).json({
                message: "Student Updated Successfully",
                student: {
                    sId, name, password
                }
            })
        }
    })
})

app.listen(8000, () => {
    console.log("Server is Running...")
})
