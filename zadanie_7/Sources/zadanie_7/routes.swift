import Vapor

func routes(_ app: Application) throws {
    app.get { req in
        req.redirect(to: "/web/products")
    }

    try app.register(collection: ProductController())
    try app.register(collection: CategoryController())
    try app.register(collection: SupplierController())

    try app.register(collection: ProductViewController())
    try app.register(collection: CategoryViewController())
    try app.register(collection: SupplierViewController())
}