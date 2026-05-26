import Vapor
import Fluent
import FluentSQLiteDriver
import Leaf
import Redis

public func configure(_ app: Application) async throws {
    app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)

    app.views.use(.leaf)

    let redisURL = Environment.get("REDIS_URL") ?? "redis://localhost:6379"
    app.redis.configuration = try RedisConfiguration(url: redisURL)

    app.migrations.add(CreateCategory())
    app.migrations.add(CreateSupplier())
    app.migrations.add(CreateProduct())

    try routes(app)
}