import Vapor

func routes(_ app: Application) throws {
    app.get { req in
        req.redirect(to: "/web/products")
    }

    try app.register(collection: ProductController())
    try app.register(collection: ProductViewController())
}