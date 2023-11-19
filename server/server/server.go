package server

import (
	"fmt"
	"log"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type AsciiArt struct {
	AsciiArt []string `json:"ascii_art"`
}

const tmpImgDir string = "./images"

func Server() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, conversion-method, Accept",
	}))

	aa := AsciiArt{}
	cache, err := newFIFOCache(10)
	if err != nil {
		log.Panic(err)
	}

	app.Post("/ascii-art", func(c *fiber.Ctx) error {
		fmt.Println("POST")
		f, err := c.MultipartForm()
		if err != nil {
			fmt.Println(err)
			return err
		}
		header := f.File["file"][0]
		fmt.Printf("File Name: %s\n", header.Filename)
		fmt.Printf("File Size: %d\n", header.Size)
		fmt.Printf("File Type: %s\n", header.Header["Content-Type"])
		fmt.Printf("Conversion Method: %s\n", c.Get("conversion-method"))

		savePath := filepath.Join(tmpImgDir, "tmp"+filepath.Ext(header.Filename))
		if err := c.SaveFile(header, savePath); err != nil {
			fmt.Println(err)
		}
		hash, err := getHash(savePath)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("hash:", hash)

		var method Method
		switch c.Get("conversion-method") {
		case "Luminance":
			method = LUM
		case "Average":
			method = AVR
		default:
			fmt.Println("Invalid conversion method")
		}

		key := hashAndMethod{hash, method}

		if val, found := cache.get(key); found {
			// fmt.Println("Cache hit!")
			aa.AsciiArt = val
			return c.JSON(aa)
		} else {
			// fmt.Println("Cache miss!")
			aa.AsciiArt = convert(savePath, method)
			cache.push(key, aa.AsciiArt)
			return c.JSON(aa)
		}
	})

	app.Get("/ascii-art", func(c *fiber.Ctx) error {
		fmt.Println("GET")
		return c.JSON(aa)
	})

	app.Delete("/ascii-art", func(c *fiber.Ctx) error {
		fmt.Println("DELETE")
		aa.AsciiArt = nil
		return c.JSON(aa)
	})

	log.Fatal(app.Listen(":4000"))
}
