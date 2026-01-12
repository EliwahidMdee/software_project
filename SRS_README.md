# Software Requirements Specification (SRS) - Rental Management System

## Overview

This document provides a complete Software Requirements Specification for the Rental Management System, following the IEEE 830-1998 standard and based on the structure of the reference document (SRSExample-webapp.pdf).

## Generated Files

### 1. Main SRS Document
- **File:** `SRS_RentalManagementSystem.docx`
- **Format:** Microsoft Word (DOCX)
- **Size:** ~44 KB
- **Contents:** Complete SRS document with all sections

### 2. PlantUML Diagram Files (diagrams/ directory)
All diagrams are provided as PlantUML code for easy modification and regeneration:

1. **figure1_system_environment.puml** - System architecture with actors
2. **figure3_admin_use_cases.puml** - Admin functionality
3. **figure4_landlord_use_cases.puml** - Landlord functionality  
4. **figure5_tenant_use_cases.puml** - Tenant functionality
5. **figure6_data_model.puml** - Database class diagram
6. **figure7_lease_process.puml** - Lease lifecycle state diagram
7. **figure8_payment_flow.puml** - Payment processing activity diagram

### 3. Python Script
- **File:** `generate_srs.py`
- **Purpose:** Automated generation of the SRS document
- **Usage:** `python3 generate_srs.py`

## Document Structure

The SRS document follows the standard IEEE format:

### Section 1: Introduction
- 1.1 Purpose
- 1.2 Scope of Project
- 1.3 Glossary
- 1.4 References
- 1.5 Overview of Document

### Section 2: Overall Description
- 2.1 System Environment
- 2.2 Functional Requirements Specification
  - 2.2.1 Admin Use Cases
  - 2.2.2 Landlord Use Cases
  - 2.2.3 Tenant Use Cases
- 2.3 User Characteristics
- 2.4 Non-Functional Requirements

### Section 3: Requirements Specification
- 3.1 External Interface Requirements
  - User Interfaces
  - Hardware Interfaces
  - Software Interfaces
  - Communication Interfaces
- 3.2 Functional Requirements (detailed)
  - User Authentication
  - Property Management
  - Unit Management
  - Lease Creation
  - Payment Recording
  - Expense Tracking
  - Document Management
  - Notification System
- 3.3 Detailed Non-Functional Requirements
  - Performance Requirements
  - Security Requirements
  - Reliability Requirements
  - Usability Requirements
  - Maintainability Requirements
- 3.4 Data Model (with class diagram)

### Appendix
- PlantUML Diagram Instructions

## Key Features of This SRS

### ✅ Use Case Diagrams
Each user role (Admin, Landlord, Tenant) has detailed use case diagrams showing all available functionality.

### ✅ User Stories
Every use case includes user stories in the format:
> "As a [role], I want to [action] so that [benefit]"

### ✅ Acceptance Criteria
Each use case has clear, testable acceptance criteria defining when the feature is complete.

### ✅ PlantUML Code
All diagrams are provided as PlantUML code, which can be:
- Rendered online at plantuml.com
- Edited and regenerated as needed
- Version controlled easily
- Converted to PNG, SVG, or other formats

### ✅ Comprehensive Coverage
The document covers:
- Functional requirements (what the system does)
- Non-functional requirements (how well it performs)
- External interfaces (API, database, UI)
- Data model (database structure)
- Process flows (state and activity diagrams)

## Adapting from Reference Example

This SRS was created by:

1. **Analyzing the reference PDF** (SRSExample-webapp.pdf) for structure and format
2. **Understanding the project** - Rental Management System with Django and React
3. **Mapping features** - Converting web publishing system concepts to rental management
4. **Creating diagrams** - 8 comprehensive diagrams vs 4 in reference
5. **Adding modern requirements** - REST API, JWT authentication, responsive design
6. **Including user stories** - Agile methodology integration
7. **Defining acceptance criteria** - Clear, testable requirements

## Using This Documentation

### For Developers
- Reference Section 3.2 for functional requirements
- Use PlantUML diagrams to understand system architecture
- Follow acceptance criteria for implementation validation

### For Testers
- Use acceptance criteria to create test cases
- Reference user stories for test scenarios
- Validate against non-functional requirements

### For Project Managers
- Track progress against functional requirements
- Use as basis for project planning
- Reference for stakeholder communication

### For Maintenance
- Data model provides database schema reference
- Use case diagrams show feature relationships
- State diagrams explain business processes

## Rendering Diagrams

### Quick Start (Online)
1. Visit http://www.plantuml.com/plantuml/
2. Copy any `.puml` file content
3. Paste and view rendered diagram
4. Download as PNG/SVG

### Local Setup
```bash
# Install PlantUML
brew install plantuml  # macOS
# or
apt-get install plantuml  # Linux

# Generate diagrams
cd diagrams/
plantuml *.puml
```

## Technology Stack Covered

The SRS addresses:
- **Frontend:** React 18, Tailwind CSS, Axios
- **Backend:** Django 5.x, Django REST Framework
- **Database:** MySQL 8.0
- **Authentication:** JWT tokens
- **Architecture:** REST API, client-server

## Compliance

This document complies with:
- IEEE Std 830-1998 (SRS standard)
- Agile user story format
- Modern software engineering practices
- Industry standard diagram notation (UML)

## Regenerating the Document

To regenerate with modifications:

1. Edit `generate_srs.py`
2. Run: `python3 generate_srs.py`
3. New DOCX file will be created with updates

## Questions?

For questions about:
- **Document structure:** Reference IEEE 830-1998
- **PlantUML syntax:** Visit plantuml.com
- **Requirements:** See Section 3 of the SRS
- **Use cases:** See Section 2.2 of the SRS

---

**Version:** 1.0  
**Date:** January 12, 2026  
**Project:** Rental Management System  
**Document Type:** Software Requirements Specification
