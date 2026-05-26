import Fluent

struct CreateSupplier: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema("suppliers")
            .id()
            .field("name", .string, .required)
            .field("email", .string, .required)
            .create()
    }

    func revert(on database: any Database) async throws {
        try await database.schema("suppliers").delete()
    }
}