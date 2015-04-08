package main

import (
	"code.google.com/p/go-tour/pic"
	"fmt"
	"math"
	"math/rand"
)

type Point struct {
	X int
	Y int
}

func main() {
	fmt.Printf("hello, world\n")
	simpleStructs()
	//	simpleArray()
	//	slices()
	//	iteratorViaRange()
	renderPicture()
	simpleMap()
	moreMap()
	mapMutator()
	innerFun()
	closureDemo()
}

func simpleStructs() {
	fmt.Println(randomPoint())
	point := randomPoint()
	fmt.Println(point, "X=", point.X)
}

func randomPoint() Point {

	return Point{
		rand.Intn(100),
		rand.Intn(100)}
}

func simpleArray() {
	var a [2]string
	a[0] = "Hello"
	a[1] = "World"
	//	a[2] = "!"

	fmt.Println(a)
	fmt.Println("...")

	p := []int{2, 3, 5, 7, 11, 13}
	fmt.Println("p ==", p)

	for i := 0; i < len(p); i++ {
		fmt.Printf("p[%d] == %d\n", i, p[i])
	}

	p = []int{2, 3, 5, 7, 11, 13}
	fmt.Println("p ==", p)
	fmt.Println("p[1:4] ==", p[1:4])

	// missing low index implies 0
	fmt.Println("p[:3] ==", p[:3])

	// missing high index implies len(s)
	fmt.Println("p[4:] ==", p[4:])
}

func slices() {
	var a []int
	printSlice("a", a)

	// append works on nil slices.
	a = append(a, 0)
	printSlice("a", a)

	// the slice grows as needed.
	a = append(a, 1)
	printSlice("a", a)

	// we can add more than one element at a time.
	a = append(a, 2, 3, 4)
	printSlice("a", a)
}
func printSlice(s string, x []int) {
	fmt.Printf("%s len=%d cap=%d %v\n",
		s, len(x), cap(x), x)
}

func iteratorViaRange() {
	var pow = []int{1, 2, 4, 8, 16, 32, 64, 128}
	for i, v := range pow {
		fmt.Printf("2**%d = %d\n", i, v)
	}

	fmt.Println(".........")
	pow = make([]int, 10)
	for i := range pow {
		pow[i] = 1 << uint(i)
	}
	for _, value := range pow {
		fmt.Printf("%d\n", value)
	}
}

func Pic(dx, dy int) [][]uint8 {
	fmt.Printf("dx: %d dy: %d\n", dx, dy)
	var data [][]uint8
	var row []uint8

	for x := 0; x < dx; x++ {
		row = make([]uint8, dy)
		for y := 0; y < dy; y++ {
			//			fmt.Printf("put [%d][%d]\n", x, y)
			row[y] = uint8((x*2 + y/3) / 2)
		}
		data = append(data, row)
	}
	return data
}
func renderPicture() {
	pic.Show(Pic)
	//fmt.Println(10)
	//fmt.Println(Pic(5, 4))
}

type Vertex struct {
	Lat, Long float64
}

func simpleMap() {
	var m map[string]Vertex
	m = make(map[string]Vertex)
	m["Bell Labs"] = Vertex{
		40.68433, -74.39967,
	}
	fmt.Println(m["Bell Labs"])
}

func moreMap() {
	var m = map[string]Vertex{
		"Bell Labs": Vertex{
			40.68433, -74.39967,
		},
		"Google": Vertex{
			37.42202, -122.08408,
		},
	}
	fmt.Println(m)

	m = map[string]Vertex{
		"Bell Labs": {40.68433, -74.39967},
		"Google":    {37.42202, -122.08408},
	}

	fmt.Println(m)
}

func mapMutator() {
	m := make(map[string]int)

	m["Answer"] = 42
	fmt.Println("The value:", m["Answer"])

	m["Answer"] = 48
	fmt.Println("The value:", m["Answer"])

	delete(m, "Answer")
	fmt.Println("The value:", m["Answer"])

	v, ok := m["Answer"]
	fmt.Println("The value:", v, "Present?", ok)
}

func innerFun() {
	hypot := func(x, y float64) float64 {
		return math.Sqrt(x*x + y*y)
	}

	fmt.Println(hypot(3, 4))
	fmt.Println("hight order fun run", fuArg(hypot, 3, 4))

}

func fuArg(dummy func(x, y float64) float64, a, b float64) float64 {
	return dummy(a, b)
}

func closureDemo() {
	pos, neg := adder(), adder()
	for i := 0; i < 10; i++ {
		fmt.Println(
			pos(i),
			neg(-1),
		)
	}

	fmt.Println("Fibbonacci demo")
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}

func adder() func(int) int {
	sum := 0
	return func(x int) int {
		sum += x
		return sum
	}
}

// fibonacci is a function that returns
// a function that returns an int.
func fibonacci() func() int {
	a := 0
	b := 1
	//val := a

	return func() int {
		//0,1,1,2,3,5,8,13
		fib := a
		next := a + b
		a = b
		b = next
		return fib
	}
}
