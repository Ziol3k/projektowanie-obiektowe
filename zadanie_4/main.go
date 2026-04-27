package main

import (
	"fmt"
	"net/http"

	"github.com/glebarez/sqlite"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type Weather struct {
	gorm.Model
	Location	string	`json:"location"`
	Temperature	float64 `json:"temperature"`
	Description	string	`json:"description"`
}

var db *gorm.DB

func initDB() {
	var err error
	db, err = gorm.Open(sqlite.Open("weather.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Weather{})

	initialData := []Weather{
		{Location: "Warsaw", Temperature: 20.2, Description: "Cloudy"},
		{Location: "Krakow", Temperature: 28.5, Description: "Sunny"},
		{Location: "Wroclaw", Temperature: 19.0, Description: "Rainy"},
	}

	for _, w := range initialData {
		var count int64
		db.Model(&Weather{}).Where("Location = ?", w.Location).Count(&count)
		if count == 0 {
			db.Create(&w)
			fmt.Printf("Added initial data for: %s\n", w.Location)
		}
	}
}

func GetWeather(c echo.Context) error {
	var weatherData []Weather
	db.Find(&weatherData)
	return c.JSON(http.StatusOK, weatherData)
}

func main() {
	initDB()

	e:= echo.New()

	e.GET("/weather", GetWeather)
	e.POST("/weather", GetWeather)
	e.Logger.Fatal(e.Start(":8081"))
}