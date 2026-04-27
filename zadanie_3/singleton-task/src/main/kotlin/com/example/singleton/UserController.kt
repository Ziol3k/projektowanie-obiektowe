package com.example.singleton

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController {

    @GetMapping("/users")
    fun listUsers(): List<String> {
        return listOf("admin", "manager", "dev", "tester")
    }
}