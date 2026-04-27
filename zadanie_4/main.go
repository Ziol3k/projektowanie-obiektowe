package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

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

type GeocodingResponse struct {
	Results []struct {
		Name      string  `json:"name"`
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
		Country   string  `json:"country"`
	} `json:"results"`
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

func getCoords(city string) (float64, float64, string, error) {
	apiUrl := fmt.Sprintf("https://geocoding-api.open-meteo.com/v1/search?name=%s&count=1&language=en&format=json", url.QueryEscape(city))
	
	resp, err := http.Get(apiUrl)
	if err != nil {
		return 0, 0, "", err
	}
	defer resp.Body.Close()

	var geo GeocodingResponse
	json.NewDecoder(resp.Body).Decode(&geo)

	if len(geo.Results) == 0 {
		return 0, 0, "", fmt.Errorf("city not found")
	}

	res := geo.Results[0]
	return res.Latitude, res.Longitude, fmt.Sprintf("%s, %s", res.Name, res.Country), nil
}

func fetchExternalWeather(lat, lon float64) (float64, error) {
	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m", lat, lon)
	
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	var result ExternalWeatherResponse
	json.NewDecoder(resp.Body).Decode(&result)
	return result.Current.Temperature, nil
}

func GetWeatherProxy(c echo.Context) error {
	cityInput := c.QueryParam("city")
	if cityInput == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Please provide a city name, e.g., ?city=Tokyo"})
	}

	lat, lon, fullName, err := getCoords(cityInput)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
	}

	temp, err := fetchExternalWeather(lat, lon)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error fetching weather")
	}

	db.Create(&Weather{
		Location:    fullName,
		Temperature: temp,
		Description: "Real-time Proxy search",
	})

	var history []Weather
	db.Where("location = ?", fullName).Find(&history)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"found_location": fullName,
		"latitude":       lat,
		"longitude":      lon,
		"current_temp":   temp,
		"search_history": history,
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
	e.File("/", "index.html")
	e.GET("/weather/proxy", GetWeatherProxy)
	e.POST("/weather/proxy", GetWeatherProxy)
	e.Logger.Fatal(e.Start(":8081"))
}