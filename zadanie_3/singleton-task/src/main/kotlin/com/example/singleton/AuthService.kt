package com.example.singleton

import org.springframework.stereotype.Service

@Service
class AuthService {

    init {
        println("--- EAGER: AuthService singleton has been initialized at startup ---")
    }

    fun authenticate(username: String, pass: String): Boolean {
        return username == "admin" && pass == "admin123"
    }
}