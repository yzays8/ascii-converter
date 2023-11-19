package server

import (
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"os"
)

type Method int

const (
	LUM = iota
	AVR
)

const mat string = "`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$" // 65 chars

func convert(path string, method Method) []string {
	if len(mat) != 65 {
		log.Panic("mat length is not 65")
	}

	f, err := os.Open(path)
	if err != nil {
		log.Panic(err)
	}
	defer f.Close()

	img, _, err := image.Decode(f)
	if err != nil {
		log.Panic(err)
	}

	bounds := img.Bounds()
	rgba := image.NewNRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			rgba.Set(x, y, img.At(x, y))
		}
	}

	var buf []string

	var calc func(r, g, b uint8) int
	switch method {
	case LUM:
		calc = func(r, g, b uint8) int {
			lum := 0.2126*float64(r) + 0.7152*float64(g) + 0.0722*float64(b)
			rlum := 255 - lum // reverse tone
			return int(rlum) * len(mat) / 256
		}
	case AVR:
		calc = func(r, g, b uint8) int {
			avr := (r + g + b) / 3
			ravr := 255 - avr // reverse tone
			return int(ravr) * len(mat) / 256
		}
	default:
		log.Panic(err)
	}

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			c := rgba.NRGBAAt(x, y)
			r := c.R
			g := c.G
			b := c.B
			i := calc(r, g, b)
			buf = append(buf, string(mat[i]))
		}
		buf = append(buf, "\n")
	}

	return buf
}
