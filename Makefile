# Variables
BINARY_NAME=BOMulus
BUILD_DIR=build
SRC_DIR=cmd/$(BINARY_NAME)

# Default target: build
.PHONY: all
all: build run

# Build the project
.PHONY: build
build:
	@echo "Building $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) main.go

# Run the project
.PHONY: run
run:
	@echo "Running $(BINARY_NAME)..."
	@$(BUILD_DIR)/$(BINARY_NAME)

# Clean up build artifacts
.PHONY: clean
clean:
	@echo "Cleaning up..."
	@rm -rf $(BUILD_DIR)