package main

import "fmt"
import "time"

func main() {
	fmt.Printf("hello, concurrency\n")
	parallellDemo()
	bufferredChannelsDemo()
	fibonacciDemo()
	//fibonacciMultiChannelsDemo()
	defaultSelectDemo()
}

func sum(a []int, c chan int) {
	sum := 0
	for _, v := range a {
		sum += v
	}
	c <- sum // send sum to c
}

func parallellDemo() {

	a := []int{7, 2, 8, -9, 4, 0}
	fmt.Printf("2 channels used to calculate a sum of %v\n", a)

	c := make(chan int)
	go sum(a[:len(a)/2], c)
	go sum(a[len(a)/2:], c)
	x, y := <-c, <-c // receive from c

	fmt.Println(x, "+", y, "=", x+y)

}

func bufferredChannelsDemo() {
	c := make(chan int, 2)
	c <- 10
	c <- 21
	//		c <- 3
	fmt.Println(<-c)
	fmt.Println(<-c)
}

func fibonacciDemo() {
	fmt.Println("Fibonacci demo")
	c := make(chan int, 10)
	go fibonacci(cap(c), c)
	for i := range c {
		fmt.Println(i, <-c)
	}
	fmt.Println(<-c)
	fmt.Println(<-c)
	fmt.Println(<-c)
	fmt.Println("Fibonacci demo done")
}

func fibonacci(n int, c chan int) {
	x, y := 0, 1
	for i := 0; i < n; i++ {
		c <- x
		x, y = y, x+y
	}
	close(c)
}

func fibonacciMultiChannelsDemo() {
	func() {
		fmt.Println("fibonacciMultiChannelsDemo started")
	}()

	c := make(chan int)
	quit := make(chan int)
	go func() {
		for i := 0; i < 10; i++ {
			fmt.Println("inside fibonacciMultiChannelsDemo " + fmt.Sprint(i))
			time.Sleep(500 * time.Millisecond)
			fmt.Println(<-c)
		}
		quit <- 0
	}()
	fibonacciMultiChannel(c, quit)
}

func fibonacciMultiChannel(c, quit chan int) {
	x, y := 0, 1
	for {
		//The select statement lets a goroutine wait on multiple communication operations.
		//A select blocks until one of its cases can run, then it executes that case.
		// It chooses one at random if multiple are ready.
		select {
		case c <- x:
			fmt.Println("step for " + fmt.Sprint(x))
			time.Sleep(2000 * time.Millisecond)
			x, y = y, x+y
		case <-quit:
			fmt.Println("quit")
			return

		default:
			//			fmt.Println("default case")
			break
		}
	}
	fmt.Println("exit fibonacciMultiChannel")
}

func defaultSelectDemo() {
	tick := time.Tick(100 * time.Millisecond)
	boom := time.After(500 * time.Millisecond)
	for {
		select {
		case <-tick:
			fmt.Println("tick.")
		case <-boom:
			fmt.Println("BOOM!")
			//			break
			return //fault without return
		default:
			fmt.Println("    .")
			time.Sleep(50 * time.Millisecond)
		}
	}
}
