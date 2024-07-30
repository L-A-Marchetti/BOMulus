# Variables
BINARY_NAME=BOMulus
BUILD_DIR=build
SRC_DIR=cmd/$(BINARY_NAME)
LINUX_DIR=$(BUILD_DIR)/linux
WINDOWS_DIR=$(BUILD_DIR)/windows

# Build for Linux and run
.PHONY: linux
linux: build-linux run-linux

build-linux:
	@echo "Building $(BINARY_NAME) for Linux..."
	@mkdir -p $(LINUX_DIR)
	@go build -o $(LINUX_DIR)/$(BINARY_NAME) cmd/$(BINARY_NAME)/main.go

run-linux:
	@echo "Running $(BINARY_NAME) for Linux..."
	@$(LINUX_DIR)/$(BINARY_NAME)

# Build for Windows and run
.PHONY: win
win: build-win run-win

build-win:
	@echo "Building $(BINARY_NAME) for Windows..."
	@mkdir -p $(WINDOWS_DIR)
	@$env:CGO_ENABLED=1; go build -ldflags "-H windowsgui" -o $(WINDOWS_DIR)/$(BINARY_NAME).exe $(SRC_DIR)/main.go

run-win:
	@echo "Running $(BINARY_NAME) for Windows..."
	@start $(WINDOWS_DIR)/$(BINARY_NAME).exe

# Clean up build artifacts
.PHONY: clean
clean:
	@echo "Cleaning up..."
	@rm -rf $(BUILD_DIR)