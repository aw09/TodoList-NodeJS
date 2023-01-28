const response = (res, code, message = "success", data = {}) => {
    let status = "Success";

    if (code == 400) status = "Bad Request";
    else if (code == 404) status = "Not Found";

    return res.status(code).send({
        status, message, data
    });
}

module.exports = {
    response
}