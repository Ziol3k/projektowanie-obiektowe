import Vapor
import Fluent

struct ProductViewController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let products = routes.grouped("web", "products")

        products.get(use: index)
        products.get("create", use: createForm)
        products.post(use: create)
        products.get(":productID", "edit", use: editForm)
        products.post(":productID", "edit", use: update)
        products.post(":productID", "delete", use: delete)
    }

    func index(req: Request) async throws -> View {
        let products = try await Product.query(on: req.db).all()

        let context = ProductIndexContext(
            products: try products.map { product in
                ProductViewData(
                    id: try product.requireID().uuidString,
                    name: product.name,
                    price: product.price,
                    description: product.description
                )
            }
        )

        return try await req.view.render("products/index", context)
    }

    func createForm(req: Request) async throws -> View {
        try await req.view.render("products/create")
    }

    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(ProductInput.self)

        let product = Product(
            name: input.name,
            price: input.price,
            description: input.description
        )

        try await product.save(on: req.db)
        return req.redirect(to: "/web/products")
    }

    func editForm(req: Request) async throws -> View {
        guard let product = try await Product.find(req.parameters.get("productID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let context = ProductEditContext(
            product: ProductViewData(
                id: try product.requireID().uuidString,
                name: product.name,
                price: product.price,
                description: product.description
            )
        )

        return try await req.view.render("products/edit", context)
    }

    func update(req: Request) async throws -> Response {
        guard let product = try await Product.find(req.parameters.get("productID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let input = try req.content.decode(ProductInput.self)

        product.name = input.name
        product.price = input.price
        product.description = input.description

        try await product.save(on: req.db)
        return req.redirect(to: "/web/products")
    }

    func delete(req: Request) async throws -> Response {
        guard let product = try await Product.find(req.parameters.get("productID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await product.delete(on: req.db)
        return req.redirect(to: "/web/products")
    }
}

struct ProductIndexContext: Encodable {
    let products: [ProductViewData]
}

struct ProductEditContext: Encodable {
    let product: ProductViewData
}

struct ProductViewData: Encodable {
    let id: String
    let name: String
    let price: Double
    let description: String
}