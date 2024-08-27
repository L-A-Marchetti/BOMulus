package core

import (
	"fmt"
	"strings"
	"time"
)

var vitalCount int

func StartBenchmark(name string, isVital bool) *BenchmarkTimer {
	if isVital {
		tab := strings.Repeat("   ", vitalCount)
		if vitalCount == 0 {
			fmt.Println("◻ \033[1m****" + name + "****\033[0m")
		} else if vitalCount == 1 {
			fmt.Println("├───────◻ \033[1m****" + name + "****\033[0m")
		} else {
			fmt.Println("│ " + tab + "├───────◻ \033[1m****" + name + "****\033[0m")
		}
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
		if vitalCount < 1 {
			vitalCount = 1
		}
		tab := strings.Repeat("│\t", vitalCount-1)
		fmt.Printf("%s◻ =====> \033[4mTotal execution time of %s: %v\n\033[0m", tab, b.name, duration)
		vitalCount--
	} else {
		textDuration := fmt.Sprintf("%v", duration)
		if duration >= time.Millisecond {
			textDuration = fmt.Sprintf("\033[1;31m%v\033[0m", duration)
		}
		if vitalCount < 1 {
			vitalCount = 1
		}
		tab := strings.Repeat("│\t", vitalCount-1)
		if vitalCount == 1 {
			fmt.Printf("├──%s: %s\n", b.name, textDuration)
		} else {
			fmt.Printf("%s├──%s: %s\n", tab, b.name, textDuration)
		}
	}
}

/* usage example (place this at the beginning of a function):
if config.DEBUGGING {
        defer core.StartBenchmark("GuiInit()", true).Stop()
    }
*/
