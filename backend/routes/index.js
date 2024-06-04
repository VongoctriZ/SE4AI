// import route
const UserRouter = require("./user.r");
const ProductRouter = require("./product.r");
const CartRouter = require("./cart.r");


function route(app) {
    app.use("/user", UserRouter);

    app.use("/product", ProductRouter);

    app.use("/cart", CartRouter);
}

module.exports = route;