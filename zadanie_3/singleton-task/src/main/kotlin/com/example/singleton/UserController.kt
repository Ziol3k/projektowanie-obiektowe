package com.example.singleton

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestParam

@RestController
class UserController(
    private val authService: AuthService,
    private val lazyAuthService: LazyAuthService
) {

    @GetMapping("/users")
    fun listUsers(): List<String> {
        return listOf("admin", "manager", "dev", "tester")
    }

    @GetMapping("/auth/eager")
    fun authenticateUser(
        @RequestParam user: String,
        @RequestParam pass: String
    ): String {
        val success = authService.authenticate(user, pass)
        return if (success) {
            "Login successful (Eeger)! Welcome, $user."
        } else {
            "Login failed (Eager)! Invalid username or password."
        }
    }

    @GetMapping("/auth/lazy")
    fun authenticateLazy(
        @RequestParam user: String,
        @RequestParam pass: String
    ): String {
        val success = lazyAuthService.authenticate(user, pass)
        return if (success) {
            "Login successful (Lazy)! Welcome, $user."
        } else {
            "Login failed (Lazy)! Invalid username or password."
        }
    }
}