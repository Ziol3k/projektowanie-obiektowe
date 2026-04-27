package main

import (
	"encoding/json"
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

type ExternalWeatherResponse struct {
	Current struct {
		Temperature float64 `json:"temperature_2m"`
	} `json:"current"`
}

var db *gorm.DB

func initDB() {
	var err error
	db, err = gorm.Open(sqlite.Open("weather.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Weather{})

	// initialData := []Weather{
	// 	{Location: "Warsaw", Temperature: 20.2, Description: "Cloudy"},
	// 	{Location: "Krakow", Temperature: 28.5, Description: "Sunny"},
	// 	{Location: "Wroclaw", Temperature: 19.0, Description: "Rainy"},
	// }

	// for _, w := range initialData {
	// 	var count int64
	// 	db.Model(&Weather{}).Where("Location = ?", w.Location).Count(&count)
	// 	if count == 0 {
	// 		db.Create(&w)
	// 		fmt.Printf("Added initial data for: %s\n", w.Location)
	// 	}
	// }
}

func fetchExternalWeather(city string) (float64, error) {
	url := "https://api.open-meteo.com/v1/forecast?latitude=52.2297&longitude=21.0122&current=temperature_2m"

	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	var result ExternalWeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return 0, err
	}

	return result.Current.Temperature, nil
}

func GetWeatherProxy(c echo.Context) error {
	city := "Warsaw"

	temp, err := fetchExternalWeather(city)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error fetching external weather")
	}

	newEntry := Weather{
		Location:    city,
		Temperature: temp,
		Description: "Fetched from External Proxy",
	}
	db.Create(&newEntry)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":  "Data fetched via Proxy and saved to DB",
		"city":    city,
		"temp":    temp,
		"source":  "Open-Meteo API",
	})
}

func GetWeather(c echo.Context) error {
	var weatherData []Weather
	db.Find(&weatherData)
	return c.JSON(http.StatusOK, weatherData)
}

func main() {
	initDB()

	e:= echo.New()

	e.GET("/weather/proxy", GetWeatherProxy)
	e.POST("/weather/proxy", GetWeatherProxy)
	e.Logger.Fatal(e.Start(":8081"))
}