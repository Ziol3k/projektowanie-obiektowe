import Vapor
import Fluent
import FluentSQLiteDriver
import FluentPostgresDriver
import Leaf
import Redis
import NIOSSL

public func configure(_ app: Application) async throws {
    if let databaseURL = Environment.get("DATABASE_URL") {
        try app.databases.use(.postgres(url: databaseURL), as: .psql)
    } else {
        app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)
    }

    app.views.use(.leaf)

    let redisURL = Environment.get("REDIS_URL")
        ?? Environment.get("HEROKU_REDIS_URL")
        ?? "redis://localhost:6379"

    var tlsConfiguration = TLSConfiguration.makeClientConfiguration()
    tlsConfiguration.certificateVerification = .none

    app.redis.configuration = try RedisConfiguration(
        url: redisURL,
        tlsConfiguration: redisURL.hasPrefix("rediss://") || app.environment == .production
            ? tlsConfiguration
            : nil
    )

    app.migrations.add(CreateCategory())
    app.migrations.add(CreateSupplier())
    app.migrations.add(CreateProduct())

    try routes(app)
}