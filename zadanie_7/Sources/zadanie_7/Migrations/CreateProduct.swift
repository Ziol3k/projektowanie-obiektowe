import Fluent

struct CreateProduct: AsyncMigration {
    func prepare(on database: any Database) async throws {
        try await database.schema("products")
            .id()
            .field("name", .string, .required)
            .field("price", .double, .required)
            .field("description", .string, .required)
            .field("category_id", .uuid, .required, .references("categories", "id"))
            .field("supplier_id", .uuid, .required, .references("suppliers", "id"))
            .create()
    }

    func revert(on database: any Database) async throws {
        try await database.schema("products").delete()
    }
}