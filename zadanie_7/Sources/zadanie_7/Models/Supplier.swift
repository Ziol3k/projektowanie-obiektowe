import Vapor
import Fluent

final class Supplier: Model, Content, @unchecked Sendable {
    static let schema = "suppliers"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "email")
    var email: String

    @Children(for: \.$supplier)
    var products: [Product]

    init() {}

    init(id: UUID? = nil, name: String, email: String) {
        self.id = id
        self.name = name
        self.email = email
    }
}

struct SupplierInput: Content {
    let name: String
    let email: String
}