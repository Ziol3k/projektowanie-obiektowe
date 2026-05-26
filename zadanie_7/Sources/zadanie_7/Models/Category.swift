import Vapor
import Fluent

final class Category: Model, Content, @unchecked Sendable {
    static let schema = "categories"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Children(for: \.$category)
    var products: [Product]

    init() {}

    init(id: UUID? = nil, name: String) {
        self.id = id
        self.name = name
    }
}

struct CategoryInput: Content {
    let name: String
}
