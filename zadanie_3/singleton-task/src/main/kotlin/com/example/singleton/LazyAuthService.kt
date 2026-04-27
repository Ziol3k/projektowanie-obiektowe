package com.example.singleton

import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service

@Service
@Lazy
class LazyAuthService {

    init {
        println("--- LAZY: LazyAuthService singleton has been initialized ON DEMAND ---")
    }

    fun authenticate(username: String, pass: String): Boolean {
        return username == "poweruser" && pass == "secret123"
    }
}