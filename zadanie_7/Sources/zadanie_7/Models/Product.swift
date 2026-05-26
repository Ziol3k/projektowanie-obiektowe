import Vapor
import Fluent

final class Product: Model, Content, @unchecked Sendable {
    static let schema = "products"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "price")
    var price: Double

    @Field(key: "description")
    var description: String

    init() {}

    init(id: UUID? = nil, name: String, price: Double, description: String) {
        self.id = id
        self.name = name
        self.price = price
        self.description = description
    }
}

struct ProductInput: Content {
    let name: String
    let price: Double
    let description: String
}