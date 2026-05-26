import Fluent

struct CreateProduct: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema("products")
            .id()
            .field("name", .string, .required)
            .field("price", .double, .required)
            .field("description", .string, .required)
            .create()
    }

    func revert(on database: any Database) async throws {
        try await database.schema("products").delete()
    }
}