const startTaskServer = require('../api-handler');
const { USER_SERVER } = require('../common/config');
const { register, searchData, userLogin, updateUser, formFileMiddleware } = require('./handlers');
const { searchData: searchDataValidator } = require('./validators');
startTaskServer(USER_SERVER.name, {
    port: USER_SERVER.port
}, {
    'register-user': {
        handler: register,
        routeMiddlewares: [formFileMiddleware]
    },
    'search-data': {
        handler: searchData,
        validator: searchDataValidator
    },
    'user-login': {
        handler: userLogin
    },
    'update-user': {
        handler: updateUser,
        routeMiddlewares: [formFileMiddleware]
    }
});