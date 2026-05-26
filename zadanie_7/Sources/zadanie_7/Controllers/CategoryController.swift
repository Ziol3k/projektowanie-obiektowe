import Vapor
import Fluent

struct CategoryController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let categories = routes.grouped("categories")

        categories.get(use: index)
        categories.post(use: create)
        categories.get(":categoryID", use: show)
        categories.put(":categoryID", use: update)
        categories.delete(":categoryID", use: delete)
    }

    func index(req: Request) async throws -> [Category] {
        try await Category.query(on: req.db).all()
    }

    func create(req: Request) async throws -> Category {
        let input = try req.content.decode(CategoryInput.self)
        let category = Category(name: input.name)

        try await category.save(on: req.db)
        return category
    }

    func show(req: Request) async throws -> Category {
        guard let category = try await Category.find(req.parameters.get("categoryID"), on: req.db) else {
            throw Abort(.notFound)
        }

        return category
    }

    func update(req: Request) async throws -> Category {
        guard let category = try await Category.find(req.parameters.get("categoryID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let input = try req.content.decode(CategoryInput.self)
        category.name = input.name

        try await category.save(on: req.db)
        return category
    }

    func delete(req: Request) async throws -> HTTPStatus {
        guard let category = try await Category.find(req.parameters.get("categoryID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await category.delete(on: req.db)
        return .noContent
    }
}