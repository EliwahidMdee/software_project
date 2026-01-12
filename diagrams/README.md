# PlantUML Diagrams for Rental Management System SRS

This directory contains PlantUML diagram definitions for the Software Requirements Specification (SRS) document.

## Diagrams Included

1. **figure1_system_environment.puml** - System Environment (Use Case Diagram)
   - Shows the overall system architecture with actors and components

2. **figure3_admin_use_cases.puml** - Admin Use Cases
   - Details all use cases available to Admin users

3. **figure4_landlord_use_cases.puml** - Landlord Use Cases
   - Details all use cases available to Landlord users

4. **figure5_tenant_use_cases.puml** - Tenant Use Cases
   - Details all use cases available to Tenant users

5. **figure6_data_model.puml** - Data Model Structure (Class Diagram)
   - Shows the database entities and their relationships

6. **figure7_lease_process.puml** - Lease Management Process (State Diagram)
   - Shows the lifecycle of a lease agreement

7. **figure8_payment_flow.puml** - Payment Processing Flow (Activity Diagram)
   - Shows the payment submission and processing workflow

## How to Render Diagrams

### Option 1: Online PlantUML Editor

1. Visit [PlantUML Online Editor](http://www.plantuml.com/plantuml/)
2. Copy the contents of any `.puml` file
3. Paste into the editor
4. The diagram will render automatically
5. Download as PNG, SVG, or other formats

### Option 2: Visual Studio Code Extension

1. Install the "PlantUML" extension in VS Code
2. Open any `.puml` file
3. Press `Alt+D` to preview the diagram
4. Right-click and select "Export Current Diagram" to save

### Option 3: Command Line (Local Installation)

**Requirements:**
- Java Runtime Environment (JRE)
- PlantUML JAR file

**Installation:**
```bash
# Download PlantUML
wget https://sourceforge.net/projects/plantuml/files/plantuml.jar/download -O plantuml.jar

# Or use package manager (macOS)
brew install plantuml
```

**Usage:**
```bash
# Generate PNG for a single diagram
java -jar plantuml.jar figure1_system_environment.puml

# Generate all diagrams in the directory
java -jar plantuml.jar *.puml

# Generate SVG instead of PNG
java -jar plantuml.jar -tsvg figure1_system_environment.puml
```

### Option 4: Using Docker

```bash
# Pull PlantUML Docker image
docker pull plantuml/plantuml-server

# Run PlantUML server
docker run -d -p 8080:8080 plantuml/plantuml-server

# Access at http://localhost:8080
```

## PlantUML Syntax Reference

PlantUML uses a simple text-based syntax:

- `@startuml` and `@enduml` - Start and end of diagram
- `actor` - Define an actor in use case diagrams
- `usecase` - Define a use case
- `class` - Define a class in class diagrams
- `-->` - Association/relationship
- `..>` - Dependency (dotted arrow)
- `[*]` - Start/end state in state diagrams
- `note` - Add explanatory notes

## Integration with SRS Document

All diagrams are referenced in the main SRS document:
- **SRS_RentalManagementSystem.docx** - Contains the complete specification with PlantUML code embedded

The PlantUML code is included directly in the document for easy reference and regeneration of diagrams.

## Updating Diagrams

To update a diagram:
1. Edit the corresponding `.puml` file
2. Regenerate the image using one of the methods above
3. Update the SRS document if needed by running `generate_srs.py`

## Questions or Issues?

For PlantUML syntax help, visit the [PlantUML website](https://plantuml.com/)
