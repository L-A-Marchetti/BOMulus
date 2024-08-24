package core

import (
	"fmt"
	"time"
)

type BenchmarkTimer struct {
	startTime time.Time
	name      string
}

func StartBenchmark(name string) *BenchmarkTimer {
	return &BenchmarkTimer{
		startTime: time.Now(),
		name:      name,
	}
}

func (b *BenchmarkTimer) Stop() {
	duration := time.Since(b.startTime)
	fmt.Printf("Execution time of %s: %v\n", b.name, duration)
}

/* usage example (place this at the beginning of a function):
if config.DEBUGGING {
        defer core.StartBenchmark("GuiInit").Stop()
    }
*/
