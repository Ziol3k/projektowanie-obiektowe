import Vapor
import Fluent
import FluentSQLiteDriver
import Leaf

public func configure(_ app: Application) async throws {
    app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)

    app.views.use(.leaf)

    app.migrations.add(CreateProduct())

    try routes(app)
}