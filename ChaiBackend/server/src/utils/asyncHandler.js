/* const asyncHandler = (requestHandler) => async (req, res, next) => {

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
*/

const asyncHandler = (requestHandler) => (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
};

module.exports =  asyncHandler;




/*
    higher level function :

    const asyncHandler = () => {}
    const asyncHandler = (func) => () => {}
    const asyncHandler = (func) => async () => {}
*/