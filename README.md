# BOMulus

<img src="assets/logo.ico" alt="BOMulus" width="100" height="100"><br>

BOMulus is a Go application with a GTK-based GUI that allows users to compare and analyze Bill of Materials (BOM) files. It provides version control functionality to identify added, deleted, and updated lines between two BOMs.

## Features

- 🖱️ Drag and drop interface for loading two BOM files
- 📊 Simple version control to compare BOMs
- ➕ Identifies INSERT, DELETE, and UPDATE changes
- 📋 Tabular output with rearrangeable columns for better visibility 
- 🎨 Color-coded schema for easy change identification

## 📦 Installing BOMulus

To install BOMulus, download the latest release from the [GitHub Releases page](https://github.com/L-A-Marchetti/BOMulus/releases).

## 🔧 Development

### 📖 Prerequisites

- Go 1.8 or newer
- GTK 3.6-3.22
- GLib 2.36-2.40
- Cairo 1.10 or 1.12

### 🔌 Installing Dependencies

#### Linux
Follow the instructions [here](https://github.com/gotk3/gotk3/wiki/Installing-on-Linux) to install GTK and other dependencies.

#### macOS
Follow the instructions [here](https://github.com/gotk3/gotk3/wiki/Installing-on-macOS) to install GTK and other dependencies.

#### Windows
Follow the instructions [here](https://github.com/gotk3/gotk3/wiki/Installing-on-Windows) to install GTK and other dependencies.

### ⚙️ Setting up the Development Environment

1. Install Go and GTK dependencies as mentioned in the Installation section.

2. Clone the repository:

```bash
git clone https://github.com/L-A-Marchetti/BOMulus.git
cd BOMulus
```

3. Install the required Gotk3 (GTK bindings for Golang) Go package:

```bash
go get github.com/gotk3/gotk3@v0.6.5-0.20240618185848-ff349ae13f56
```

### 🔨 Building

## Linux

Use the provided Makefile to build the project:

```bash
make
```

This will create the BOMulus binary in the `build` directory and `run` it.
You can also use `build`, `run` or `clean` after make.

## Windows

You can use the `win-build.ps1` script to automate the build and the dependencies copying:

```powershell
.\win-build.ps1 -version "<version>"
```

You won't be able to launch the script if Execution_Policies are not set correctly:

```powershell
Get-ExecutionPolicy
```

if it's `Restricted`:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 🚀 Running

## Linux

To run the application:

```bash
make run
```

Or directly:

```bash
./BOMulus
```

## Windows

You can double click or :

```powershell
start BOMulus.exe
```

## 🌸 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

#
