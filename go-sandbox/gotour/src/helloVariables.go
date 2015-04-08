package main

import (
	"fmt"
	"math"
	"math/rand"
	"time"
)

var c, python, java bool

func main() {
	rand.Seed(time.Now().UnixNano())
	fmt.Println("My favorite number is:", rand.Intn(1001))
	fmt.Println("My second favorite number is:", rand.Intn(1001))
	fmt.Println("My favorite number sequence is:", rand.Perm(12))
	fmt.Println(math.Pi)
	test()
}

func test() {
	fmt.Println("test fun called")
	x := int(5)
	y := 55
	y = 56
	var z = 57
	res := multiply(x, y)
	fmt.Printf("multiply %g x %g = %g\n", x, y, res)
	//	fmt.Println(res)
	fmt.Println(split(res + z))
	c = true
	var c = 5

	fmt.Println(z, c, python, java)

	printType(float64(420))
	//	printType(float32(420))
}

func multiply(a, b int) int {
	return a * b
}

func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}

//func printType(v float32) {
//
//	fmt.Printf("variable v is of type %T\n", v)
//}
func printType(v float64) {
	//v := float64(42) // change me!
	fmt.Printf("v is of type %T\n", v)
}
