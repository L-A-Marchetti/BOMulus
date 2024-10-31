/*
* Package: core
* File: benchmark.go
*
* Description:
* This file provides functionality for benchmarking and timing execution of
* code blocks in a hierarchical manner. It includes functions to start and
* stop timers, and to print formatted output of execution times.
*
* Main Structures and Functions:
* - BenchmarkTimer: A struct that holds timing information.
* - StartBenchmark: Starts a new benchmark timer.
* - (BenchmarkTimer) Stop: Stops the timer and prints the execution time.
*
* Features:
* - Supports nested benchmarks with visual indentation in output.
* - Differentiates between "vital" (major) and non-vital (minor) benchmarks.
* - Color-coded output for easy reading (red for durations >= 1ms).
*
* Usage:
* Place the following at the beginning of a function to be benchmarked:
*   if config.DEBUGGING {
*       defer core.StartBenchmark("FunctionName()", true/false).Stop()
*   }
*
* Note:
* This benchmarking tool is designed for development and debugging purposes.
* It's recommended to disable it in production environments.
 */

package core

import (
	"fmt"
	"strings"
	"time"
)

// vitalCount keeps track of the nesting level of vital benchmarks
var vitalCount int

// StartBenchmark initiates a new benchmark timer
func StartBenchmark(name string, isVital bool) *BenchmarkTimer {
	if isVital {
		// Print formatted output for vital benchmarks
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
	// Return a new BenchmarkTimer
	return &BenchmarkTimer{
		startTime: time.Now(),
		name:      name,
		isVital:   isVital,
	}
}

// Stop ends the benchmark and prints the execution time
func (b *BenchmarkTimer) Stop() {
	duration := time.Since(b.startTime)
	if b.isVital {
		// Handle vital benchmark output
		if vitalCount < 1 {
			vitalCount = 1
		}
		tab := strings.Repeat("│\t", vitalCount-1)
		fmt.Printf("%s◻ =====> \033[4mTotal execution time of %s: %v\n\033[0m", tab, b.name, duration)
		vitalCount--
	} else {
		// Handle non-vital benchmark output
		textDuration := fmt.Sprintf("%v", duration)
		if duration >= time.Millisecond {
			textDuration = fmt.Sprintf("\033[1;31m%v\033[0m", duration) // Red color for >=1ms
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
