package core

import (
	"fmt"
	"strings"
	"time"
)

type BenchmarkTimer struct {
	startTime time.Time
	name      string
	isVital   bool
}

var vitalCount int

func StartBenchmark(name string, isVital bool) *BenchmarkTimer {
	if isVital {
		tab := strings.Repeat("├───────", vitalCount)
		fmt.Println(tab + "◻ \033[1m****" + name + "****\033[0m")
		vitalCount++
	}
	return &BenchmarkTimer{
		startTime: time.Now(),
		name:      name,
		isVital:   isVital,
	}
}

func (b *BenchmarkTimer) Stop() {
	duration := time.Since(b.startTime)
	if b.isVital {
		tab := strings.Repeat("│\t", vitalCount-1)
		fmt.Printf("%s◻ =====> \033[4mTotal execution time of %s: %v\n\033[0m", tab, b.name, duration)
		vitalCount--
	} else {
		tab := strings.Repeat("\t├──", vitalCount-1)
		if vitalCount == 1 {
			fmt.Printf("├──%s%s: %v\n", tab, b.name, duration)
		} else {
			fmt.Printf("│%s%s: %v\n", tab, b.name, duration)
		}
	}
}

/* usage example (place this at the beginning of a function):
if config.DEBUGGING {
        defer core.StartBenchmark("GuiInit").Stop()
    }
*/
