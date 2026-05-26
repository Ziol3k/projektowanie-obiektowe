import Vapor
import Fluent

struct CategoryViewController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let categories = routes.grouped("web", "categories")

        categories.get(use: index)
        categories.get("create", use: createForm)
        categories.post(use: create)
        categories.get(":categoryID", "edit", use: editForm)
        categories.post(":categoryID", "edit", use: update)
        categories.post(":categoryID", "delete", use: delete)
    }

    func index(req: Request) async throws -> View {
        let categories = try await Category.query(on: req.db).all()

        let context = CategoryListContext(
            categories: try categories.map {
                CategoryViewData(id: try $0.requireID().uuidString, name: $0.name)
            }
        )

        return try await req.view.render("categories/index", context)
    }

    func createForm(req: Request) async throws -> View {
        try await req.view.render("categories/create")
    }

    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(CategoryInput.self)
        let category = Category(name: input.name)

        try await category.save(on: req.db)
        return req.redirect(to: "/web/categories")
    }

    func editForm(req: Request) async throws -> View {
        guard let category = try await Category.find(req.parameters.get("categoryID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let context = CategoryViewData(
            id: try category.requireID().uuidString,
            name: category.name
        )

        return try await req.view.render("categories/edit", CategoryEditContext(category: context))
    }

    func update(req: Request) async throws -> Response {
        guard let category = try await Category.find(req.parameters.get("categoryID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let input = try req.content.decode(CategoryInput.self)
        category.name = input.name

        try await category.save(on: req.db)
        return req.redirect(to: "/web/categories")
    }

    func delete(req: Request) async throws -> Response {
        guard let category = try await Category.find(req.parameters.get("categoryID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await category.delete(on: req.db)
        return req.redirect(to: "/web/categories")
    }

    struct CategoryEditContext: Encodable {
    let category: CategoryViewData
}
}