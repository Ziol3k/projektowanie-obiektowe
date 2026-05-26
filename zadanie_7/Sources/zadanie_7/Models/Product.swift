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

    @Parent(key: "category_id")
    var category: Category

    @Parent(key: "supplier_id")
    var supplier: Supplier

    init() {}

    init(
        id: UUID? = nil,
        name: String,
        price: Double,
        description: String,
        categoryID: UUID,
        supplierID: UUID
    ) {
        self.id = id
        self.name = name
        self.price = price
        self.description = description
        self.$category.id = categoryID
        self.$supplier.id = supplierID
    }
}

struct ProductInput: Content {
    let name: String
    let price: Double
    let description: String
    let categoryID: UUID
    let supplierID: UUID
}