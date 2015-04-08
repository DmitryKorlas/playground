// +build OMIT

package main

import (
	"fmt"
	"log"
	"net/http"
)

type Hello struct{}

type String string

type Struct struct {
	Greeting string
	Punct    string
	Who      string
}

func (stringHandler String) ServeHTTP(
	w http.ResponseWriter,
	r *http.Request) {
	fmt.Fprint(w, String("I'm a frayed knot."))
}
func (structHandler Struct) ServeHTTP(
	w http.ResponseWriter,
	r *http.Request) {
	fmt.Fprint(w, structHandler.Greeting, structHandler.Punct, structHandler.Who)
}

func (h Hello) ServeHTTP(
	w http.ResponseWriter,
	r *http.Request) {
	fmt.Fprint(w, "Hello!")
}

func main() {
	var helloHandler Hello
	var stringHandler String
	var structHandler = &Struct{"Hello", ":", "Gophers!"}

	//	err := http.ListenAndServe("192.168.1.160:4000", nil)
	http.Handle("/string", stringHandler)
	http.Handle("/struct", structHandler)
	http.Handle("/", helloHandler)

	//	http.Handle("", h)

	log.Fatal(http.ListenAndServe("192.168.1.160:4000", nil))
	//	if err != nil {

	//		log.Fatal(err)
	//	}
}
