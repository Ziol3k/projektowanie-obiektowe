import Vapor
import Fluent

struct ProductViewController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let products = routes.grouped("web", "products")

        products.get(use: index)
        products.get("create", use: createForm)
        products.post(use: create)
        products.get(":productID", "edit", use: editForm)
        products.post(":productID", "edit", use: update)
        products.post(":productID", "delete", use: delete)
    }

    func index(req: Request) async throws -> View {
        let products = try await Product.query(on: req.db)
            .with(\.$category)
            .with(\.$supplier)
            .all()

        let context = ProductIndexContext(
            products: try products.map { product in
                ProductViewData(
                    id: try product.requireID().uuidString,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    categoryName: product.category.name,
                    supplierName: product.supplier.name
                )
            }
        )

        return try await req.view.render("products/index", context)
    }

    func createForm(req: Request) async throws -> View {
        let categories = try await Category.query(on: req.db).all()
        let suppliers = try await Supplier.query(on: req.db).all()

        let context = ProductFormContext(
            categories: try categories.map {
                CategoryViewData(id: try $0.requireID().uuidString, name: $0.name)
            },
            suppliers: try suppliers.map {
                SupplierViewData(id: try $0.requireID().uuidString, name: $0.name, email: $0.email)
            }
        )

        return try await req.view.render("products/create", context)
    }

    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(ProductInput.self)

        let product = Product(
            name: input.name,
            price: input.price,
            description: input.description,
            categoryID: input.categoryID,
            supplierID: input.supplierID
        )

        try await product.save(on: req.db)
        return req.redirect(to: "/web/products")
    }

    func editForm(req: Request) async throws -> View {
        guard let id = req.parameters.get("productID", as: UUID.self),
            let product = try await Product.query(on: req.db)
                .filter(\.$id == id)
                .with(\.$category)
                .with(\.$supplier)
                .first()
        else {
            throw Abort(.notFound)
        }

        let categories = try await Category.query(on: req.db).all()
        let suppliers = try await Supplier.query(on: req.db).all()

        let context = ProductEditContext(
            product: ProductViewData(
                id: try product.requireID().uuidString,
                name: product.name,
                price: product.price,
                description: product.description,
                categoryName: product.category.name,
                supplierName: product.supplier.name
            ),
            categories: try categories.map {
                CategoryViewData(id: try $0.requireID().uuidString, name: $0.name)
            },
            suppliers: try suppliers.map {
                SupplierViewData(id: try $0.requireID().uuidString, name: $0.name, email: $0.email)
            }
        )

        return try await req.view.render("products/edit", context)
    }

    func update(req: Request) async throws -> Response {
        guard let product = try await Product.find(req.parameters.get("productID"), on: req.db) else {
            throw Abort(.notFound)
        }

        let input = try req.content.decode(ProductInput.self)

        product.name = input.name
        product.price = input.price
        product.description = input.description
        product.$category.id = input.categoryID
        product.$supplier.id = input.supplierID

        try await product.save(on: req.db)
        return req.redirect(to: "/web/products")
    }

    func delete(req: Request) async throws -> Response {
        guard let product = try await Product.find(req.parameters.get("productID"), on: req.db) else {
            throw Abort(.notFound)
        }

        try await product.delete(on: req.db)
        return req.redirect(to: "/web/products")
    }
}

struct ProductIndexContext: Encodable {
    let products: [ProductViewData]
}

struct ProductFormContext: Encodable {
    let categories: [CategoryViewData]
    let suppliers: [SupplierViewData]
}

struct ProductEditContext: Encodable {
    let product: ProductViewData
    let categories: [CategoryViewData]
    let suppliers: [SupplierViewData]
}

struct ProductViewData: Encodable {
    let id: String
    let name: String
    let price: Double
    let description: String
    let categoryName: String
    let supplierName: String
}

struct CategoryListContext: Encodable {
    let categories: [CategoryViewData]
}

struct SupplierListContext: Encodable {
    let suppliers: [SupplierViewData]
}

struct CategoryViewData: Encodable {
    let id: String
    let name: String
}

struct SupplierViewData: Encodable {
    let id: String
    let name: String
    let email: String
}