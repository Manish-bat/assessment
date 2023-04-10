const processTask = async ({
    handler,
    data,
    req
}) => {
    let result = null;
    try {
        result = await handler({
            data,
            req,
        });

    } catch (e) {
        throw new Error(e)
    }

    return result;
};


module.exports = {
    processTask
}