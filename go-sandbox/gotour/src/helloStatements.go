package main

import (
	"fmt"
	"math"
	"runtime"
)

func main() {
	fmt.Printf("hello, Statements\n")
	simpleLoop()
	simpleLoopNoCounter()
	simpleStatements(9)
	//	sqrtTour()
	simpleSwitch()
	simpleDefer()
}

func simpleLoop() {
	var sum int
	for i := 0; i < 10; i++ {
		sum += i
		fmt.Println("step", i+1)
	}
}

func simpleLoopNoCounter() {
	sum := 1
	var i int
	for sum < 100 {
		sum += sum
		i++
		fmt.Printf("step %g, sum=%s\n", i+1, sum)
	}
}

func simpleStatements(n int) {
	if float64(n) < math.Pi {
		fmt.Println("Hey, is less that Pi:", n)
	} else {
		fmt.Println("number greater than Pi:", n)
	}
}

func sqrtTour() {
	fmt.Println("sqrt 9 is", sqrt(9.00), math.Sqrt(9.00))
	fmt.Println("sqrt 16 is", sqrt(16.0), math.Sqrt(16.0))
	fmt.Println("sqrt 24 is", sqrt(24.0), math.Sqrt(24.0))
	fmt.Println("sqrt 8 is", sqrt(8.0), math.Sqrt(8.0))
}

func sqrt(n float64) float64 {
	z := 1.00
	//	prevDelta := 0.00
	delta := 0.00
	for i := 1; i < 10; i++ {

		delta = step(z, n)

		fmt.Println(i, delta)
		z += 1.00

	}
	return 1.0
}

func step(z float64, value float64) float64 {
	return (z - (z*z-value)/2*z)
}

func simpleSwitch() {
	fmt.Print("Go runs on ")
	switch os := runtime.GOOS; os {
	case "darwin":
		fmt.Println("OS X.")
	case "linux":
		fmt.Println("Linux.")
	default:
		// freebsd, openbsd,
		// plan9, windows...
		fmt.Printf("%s.", os)
	}

}

func simpleDefer() {
	defer say("four" + say("zero"))
	defer say("three")
	say("one")
	say("two")
}

func say(whatToSay string) string {
	fmt.Println(whatToSay)
	return ""
}
