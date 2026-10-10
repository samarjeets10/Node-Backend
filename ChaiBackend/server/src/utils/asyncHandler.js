const asyncHandler = (requestHandler) => async (req, res, next) => {

    try {
        await requestHandler(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        });
    }
} 

module.exports =  asyncHandler;


/*
    Using the Promis then catch method :

    const asyncHandler = (requestHandler) => {
        (req, res, next) => {
            Promis.resolve(requesthandler(req, res, next)).catch(error) => next((error))    
        }
    }

*/



/*
    higher level function :

    const asyncHandler = () => {}
    const asyncHandler = (func) => () => {}
    const asyncHandler = (func) => async () => {}
*/