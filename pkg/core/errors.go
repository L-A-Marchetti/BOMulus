package core

import "log"

func ErrorsHandler(err error) {
	if err != nil {
		log.Print(err)
	}
}
