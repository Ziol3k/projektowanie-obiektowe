import Vapor
import Fluent

struct SupplierController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let suppliers = routes.grouped("suppliers")

        suppliers.get(use: index)
        suppliers.post(use: create)
        suppliers.get(":supplierID", use: show)
        suppliers.put(":supplierID", use: update)
        suppliers.delete(":supplierID", use: delete)
    }

    func index(req: Request) async throws -> [Supplier] {
        try await Supplier.query(on: req.db).all()
    }

    func create(req: Request) async throws -> Supplier {
        let input = try req.content.decode(SupplierInput.self)
        let supplier = Supplier(name: input.name, email: input.email)

        try await supplier.save(on: req.db)
        return supplier
    }

    func show(req: Request) async throws -> Supplier {
        guard let supplier = try await Supplier.find(req.parameters.get("supplierID"), on: req.db) else {
            throw Abort(.notFound)
        }

        return supplier
    }

    func update(req: Request) async throws -> Supplier {
        guard let supplier = try await Supplier.find(req.parameters.get("supplierID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let input = try req.content.decode(SupplierInput.self)

        supplier.name = input.name
        supplier.email = input.email

        try await supplier.save(on: req.db)
        return supplier
    }

    func delete(req: Request) async throws -> HTTPStatus {
        guard let supplier = try await Supplier.find(req.parameters.get("supplierID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await supplier.delete(on: req.db)
        return .noContent
    }
}