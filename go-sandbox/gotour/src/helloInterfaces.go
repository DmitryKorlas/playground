package main

import (
	"errors"
	"fmt"
	"math"
	"os"
	"strconv"
	"time"
)

type Vertex struct {
	X, Y float64
}

func main() {
	fmt.Printf("hello, interfaces\nnow:%s\n", time.Now())
	methodsDemo()
	interfaceDemo()
	stringerDemo()
	errorsDemo()
}

func methodsDemo() {
	v := Vertex{3, 4}
	fmt.Println(v.Abs())
	list := MyList{1, 2, 3, 4, 5}
	fmt.Printf("list %d, %v\n", list, list.toMap())

}

type MyList []int

func (list MyList) toMap() map[string]int {
	fmt.Println(len(list))
	m := make(map[string]int)

	for i := 0; i < len(list); i++ {
		m["key"+string(i)] = i
	}
	return m
}
func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

type Writer interface {
	Write(b []byte) (n int, err error)
}

func interfaceDemo() {
	var w Writer
	// os.Stdout implements Writer
	w = os.Stdout

	fmt.Fprintf(w, "hello, writer\n")
}

type IPAddr [4]byte

func (ip IPAddr) String() string {
	var (
		a uint8 = ip[0]
		b uint8 = ip[1]
		c uint8 = ip[2]
		d uint8 = ip[3]
	)

	return fmt.Sprintf("test %d.%d.%d.%d", a, b, c, d)
}

func stringerDemo() {
	addrs := map[string]IPAddr{
		"loopback":  {127, 0, 0, 1},
		"googleDNS": {8, 8, 8, 8},
	}
	for n, a := range addrs {
		fmt.Printf("%v: %v\n", n, a)
	}
}

func errorsDemo() {
	if err := runWithError(false); err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("no error here")
	}

	fmt.Println("devide demo")

	divideNumbers(15, 3)
	divideNumbers(4.2, 0)

	//DivideByZero(2.0).Error()
}

func runWithError(succcess bool) error {
	if succcess == true {
		return nil
	} else {
		return errors.New("error ocurred")
	}
}

func divideNumbers(a float64, b float64) {
	fmt.Printf("try %v/%v\n", a, b)
	res, err := divide(a, b)
	if err != nil {
		fmt.Println("error catched")
		fmt.Println(err)
	} else {
		fmt.Printf("%v/%v = %v\n", a, b, res)
	}
}

type DivideByZero float64

func (e DivideByZero) Error() error {
	fmt.Println(e)
	errors.New("cannot devide by zero: " + strconv.FormatFloat(float64(e), 'f', 6, 64))
	return errors.New("cannot devide by zero: " + fmt.Sprint(float64(e)))
}

func divide(a float64, b float64) (float64, error) {
	if b == 0 {
		return a, DivideByZero(a).Error()
	} else {
		return b, nil
	}
}
