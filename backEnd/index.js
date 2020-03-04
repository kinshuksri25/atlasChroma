/*
 *
 *Primary file for backend requests
 *
 */

//Dependencies
var server = require('./src/server');

//declare the app
var app = {};


//define the init method
app.init = function(runtimeEnvironment,callback) {

    //start the server
    server.init(runtimeEnvironment);
};


//self invoking only if required directly
if (require.main == module)
{
    const runtimeEnvironment = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : "Development";
    app.init(runtimeEnvironment,function() {});    
}
