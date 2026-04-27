package com.example.singleton

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SingletonTaskApplication

fun main(args: Array<String>) {
	runApplication<SingletonTaskApplication>(*args)
}
