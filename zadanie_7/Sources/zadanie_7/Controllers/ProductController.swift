import Vapor
import Fluent

struct ProductController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let products = routes.grouped("products")

        products.get(use: index)
        products.post(use: create)
        products.get(":productID", use: show)
        products.put(":productID", use: update)
        products.delete(":productID", use: delete)
    }

    func index(req: Request) async throws -> [Product] {
        try await Product.query(on: req.db)
            .with(\.$category)
            .with(\.$supplier)
            .all()
    }

    func create(req: Request) async throws -> Product {
        let input = try req.content.decode(ProductInput.self)

        let product = Product(
            name: input.name,
            price: input.price,
            description: input.description,
            categoryID: input.categoryID,
            supplierID: input.supplierID
        )

        try await product.save(on: req.db)
        return product
    }

    func show(req: Request) async throws -> Product {
        guard let id = req.parameters.get("productID", as: UUID.self),
              let product = try await Product.query(on: req.db)
                .filter(\.$id == id)
                .with(\.$category)
                .with(\.$supplier)
                .first()
        else {
            throw Abort(.notFound)
        }

        return product
    }

    func update(req: Request) async throws -> Product {
        guard let product = try await Product.find(req.parameters.get("productID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let input = try req.content.decode(ProductInput.self)

        product.name = input.name
        product.price = input.price
        product.description = input.description
        product.$category.id = input.categoryID
        product.$supplier.id = input.supplierID

        try await product.save(on: req.db)
        return product
    }

    func delete(req: Request) async throws -> HTTPStatus {
        guard let product = try await Product.find(req.parameters.get("productID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await product.delete(on: req.db)
        return .noContent
    }
}