const express = require('express');
const verifyToken = require('../middlewares/auth.middleware');


const router = express.Router();

// only admin can access this routesr :

router.get("/admin", verifyToken, (req, res) => {
    res.json({
        message: "Wellcome Admin"
    });
})

// both admin and manager can access this router :

router.get("/manager", verifyToken, (req, res) => {
    res.json({
        message: "Wellcome Manager"
    });
})

// all can access this router :

router.get("/user", verifyToken, (req, res) => {
    res.json({
        message: "Wellcome User"
    });
})



module.exports = router;