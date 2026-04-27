package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetWeather(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Weather controller is working!",
	})
}

func main() {
	e:= echo.New()

	e.GET("/weather", GetWeather)
	e.POST("/weather", GetWeather)
	e.Logger.Fatal(e.Start(":8081"))
}