
const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {
        
        if(!req.user) {
            return res.status(401).json({
                messge: "Authentication Required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You donot have permission to access this resources."
            })
        }

        next();
    }
}


module.exports = authorizeRoles;