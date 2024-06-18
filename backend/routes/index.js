// import route
const UserRouter = require("./user.r");
const ProductRouter = require("./product.r");
const CartRouter = require("./cart.r");
const CommentRouter = require("./comment.r");
const OrderRouter = require("./order.r");

function route(app) {
    app.use("/user", UserRouter);

    app.use("/product", ProductRouter);

    app.use("/cart", CartRouter);

    app.use("/comment",CommentRouter);

    app.use("/order",OrderRouter);
}

module.exports = route;