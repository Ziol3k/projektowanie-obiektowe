import Vapor
import Fluent

struct SupplierViewController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let suppliers = routes.grouped("web", "suppliers")

        suppliers.get(use: index)
        suppliers.get("create", use: createForm)
        suppliers.post(use: create)
        suppliers.get(":supplierID", "edit", use: editForm)
        suppliers.post(":supplierID", "edit", use: update)
        suppliers.post(":supplierID", "delete", use: delete)
    }

    func index(req: Request) async throws -> View {
        let suppliers = try await Supplier.query(on: req.db).all()

        let context = SupplierListContext(
            suppliers: try suppliers.map {
                SupplierViewData(id: try $0.requireID().uuidString, name: $0.name, email: $0.email)
            }
        )

        return try await req.view.render("suppliers/index", context)
    }

    func createForm(req: Request) async throws -> View {
        try await req.view.render("suppliers/create")
    }

    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(SupplierInput.self)
        let supplier = Supplier(name: input.name, email: input.email)

        try await supplier.save(on: req.db)
        return req.redirect(to: "/web/suppliers")
    }

    func editForm(req: Request) async throws -> View {
        guard let supplier = try await Supplier.find(req.parameters.get("supplierID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let context = SupplierViewData(
            id: try supplier.requireID().uuidString,
            name: supplier.name,
            email: supplier.email
        )

        return try await req.view.render("suppliers/edit", SupplierEditContext(supplier: context))
    }

    func update(req: Request) async throws -> Response {
        guard let supplier = try await Supplier.find(req.parameters.get("supplierID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let input = try req.content.decode(SupplierInput.self)

        supplier.name = input.name
        supplier.email = input.email

        try await supplier.save(on: req.db)
        return req.redirect(to: "/web/suppliers")
    }

    func delete(req: Request) async throws -> Response {
        guard let supplier = try await Supplier.find(req.parameters.get("supplierID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await supplier.delete(on: req.db)
        return req.redirect(to: "/web/suppliers")
    }

    struct SupplierEditContext: Encodable {
    let supplier: SupplierViewData
}
}