# PlantUML Diagrams for Rental Management System SRS

This directory contains PlantUML diagram definitions for the Software Requirements Specification (SRS) document.

## Diagrams Included

1. **figure1_system_environment.puml** - System Environment (Use Case Diagram)
   - Shows the overall system architecture with actors and components

2. **figure3_admin_use_cases.puml** - Admin Use Cases (Updated)
   - Details all use cases available to Admin users
   - Includes: User Management, Properties, Units, Tenants, Leases, Payments, Expenses, Documents, Notifications, System Monitoring

3. **figure4_landlord_use_cases.puml** - Landlord Use Cases (Updated)
   - Details all use cases available to Landlord users
   - Includes: Property Management, Unit Management, Tenant Management, Lease Management, Payment Tracking, Expense Management, Document Management, Notification Handling, Dashboard

4. **figure5_tenant_use_cases.puml** - Tenant Use Cases (Updated)
   - Details all use cases available to Tenant users
   - Includes: Lease Viewing, Property Information, Payment History, Document Access, Notification Creation, Dashboard

5. **figure6_data_model.puml** - Data Model Structure (Class Diagram)
   - Shows the database entities and their relationships

6. **figure7_lease_process.puml** - Lease Management Process (State Diagram)
   - Shows the lifecycle of a lease agreement

7. **figure8_payment_flow.puml** - Payment Processing Flow (Activity Diagram)
   - Shows the payment submission and processing workflow

## Recent Updates

The use case diagrams (figures 3, 4, and 5) have been updated to reflect the comprehensive implementation of all frontend pages:

### Admin Use Cases (Figure 3)
- Added complete CRUD operations for all entities
- Separated Units, Tenants, and Leases management into distinct use cases
- Added Document and Notification management capabilities
- Expanded system monitoring features

### Landlord Use Cases (Figure 4)
- Separated Units management from Properties (now distinct use cases)
- Added comprehensive Tenant management (separate from Leases)
- Expanded Document management with upload, delete, view, filter, and download
- Enhanced Notification handling with create, view, mark as read, and filter capabilities
- Added detailed filtering and search capabilities across all modules
- Included expense totals and category filtering

### Tenant Use Cases (Figure 5)
- Expanded Lease Details viewing with comprehensive information access
- Added Property and Unit information viewing
- Enhanced Document access with filtering and downloading
- Expanded Notification system with multiple types (maintenance, complaint, inquiry, payment, general)
- Added Dashboard with lease summary and payment status

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

## Alignment with Implementation

The updated diagrams now accurately reflect the complete implementation as documented in:
- `IMPLEMENTATION_SUMMARY.md` - Technical details of all implemented features
- `PROJECT_COMPLETION.md` - User-friendly overview of the completed system

All 6 new frontend pages are now represented in the use case diagrams:
1. Units Page - Full CRUD with filtering
2. Tenants Page - Profile management with search
3. Leases Page - Lease agreement management with cascading selections
4. Expenses Page - Expense tracking with category filtering and totals
5. Documents Page - File upload/download with type categorization
6. Notifications Page - Communication system with read/unread status

## Questions or Issues?

For PlantUML syntax help, visit the [PlantUML website](https://plantuml.com/)
