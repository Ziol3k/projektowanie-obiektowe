package com.example.singleton

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestParam

@RestController
class UserController(private val authService: AuthService) {

    @GetMapping("/users")
    fun listUsers(): List<String> {
        return listOf("admin", "manager", "dev", "tester")
    }

    @GetMapping("/auth")
    fun authenticateUser(
        @RequestParam user: String,
        @RequestParam pass: String
    ): String {
        val success = authService.authenticate(user, pass)
        return if (success) {
            "Login successful! Welcome, $user."
        } else {
            "Login failed! Invalid username or password."
        }
    }
}