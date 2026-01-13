# Software Requirements Specification (SRS) - Rental Management System

## Overview

This document provides a complete Software Requirements Specification for the Rental Management System, following the IEEE 830-1998 standard and based on the structure of the reference document (SRSExample-webapp.pdf).

## Generated Files

### 1. Main SRS Document
- **File:** `SRS_RentalManagementSystem.docx`
- **Format:** Microsoft Word (DOCX)
- **Size:** ~50 KB
- **Contents:** Complete SRS document with all sections including Budget, Stakeholders, and Feasibility Study

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

### 4. GitHub Copilot Prompt
- **File:** `COPILOT_SRS_PROMPT.md`
- **Purpose:** Master prompt for generating SRS documents using GitHub Copilot
- **Usage:** Copy the prompt and provide it to GitHub Copilot with your project details

## Document Structure

The SRS document follows the standard IEEE format with additional modern sections:

### Section 1: Introduction
- 1.1 Purpose
- 1.2 Scope of Project
- 1.3 Glossary
- 1.4 References
- 1.5 Overview of Document
- **1.6 Stakeholders** ⭐ NEW
  - Primary Stakeholders (including Eliwahid Mdee as Project Lead)
  - Secondary Stakeholders

### Section 2: Overall Description
- 2.1 System Environment
- 2.2 Functional Requirements Specification
  - 2.2.1 Admin Use Cases
  - 2.2.2 Landlord Use Cases
  - 2.2.3 Tenant Use Cases
- 2.3 User Characteristics
- 2.4 Non-Functional Requirements
- **2.5 Budget (Estimated)** ⭐ NEW
  - Budget breakdown considering GitHub Student Developer Pack benefits
  - Total first-year cost: ~$62 USD
  - Detailed notes on free services and credits available
- **2.6 Feasibility Study** ⭐ NEW
  - 2.6.1 Technical Feasibility
  - 2.6.2 Economic Feasibility
  - 2.6.3 Operational Feasibility
  - 2.6.4 Legal and Risk Feasibility
  - 2.6.5 Overall Feasibility Conclusion

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

### ✅ Complete IEEE 830-1998 Compliance
Following all standard sections plus modern additions

### ✅ Stakeholders Section
Identifies all project stakeholders including:
- Eliwahid Mdee as Project Lead with GitHub Student benefits
- Development team and their roles
- End users and secondary stakeholders

### ✅ Budget Analysis
Comprehensive budget breakdown with:
- Line-item costs for all components
- GitHub Student Developer Pack benefits integration
- Free hosting, tools, and services identification
- Total first-year cost: ~$62 USD
- Cost-effective approach for educational projects

### ✅ Feasibility Study
Four-dimensional feasibility analysis:
- Technical Feasibility: Technology availability and expertise
- Economic Feasibility: Cost-benefit and ROI analysis
- Operational Feasibility: User acceptance and market demand
- Legal/Risk Feasibility: Compliance and risk mitigation
- Overall conclusion with go/no-go recommendation

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
- Budget and cost analysis
- Feasibility across all dimensions
- Stakeholder identification and roles

## Adapting from Reference Example

This SRS was created by:

1. **Analyzing the reference PDF** (SRSExample-webapp.pdf) for structure and format
2. **Understanding the project** - Rental Management System with Django and React
3. **Mapping features** - Converting web publishing system concepts to rental management
4. **Creating diagrams** - 8 comprehensive diagrams vs 4 in reference
5. **Adding modern requirements** - REST API, JWT authentication, responsive design
6. **Including user stories** - Agile methodology integration
7. **Defining acceptance criteria** - Clear, testable requirements
8. **Adding Stakeholders section** - Identifying project team and beneficiaries
9. **Comprehensive Budget** - Including GitHub Student benefits analysis
10. **Feasibility Study** - Four-dimensional viability analysis

## GitHub Student Developer Pack Benefits

The project leverages the GitHub Student Developer Pack, which provides:

- **$200 in DigitalOcean credits** (2 years) - Hosting and deployment
- **$100 in Microsoft Azure credits** - Cloud services and database hosting
- **Free domain name** via Namecheap (1 year) - Professional web presence
- **JetBrains Professional Tools** - IDEs for Python, JavaScript, and more
- **GitHub Pro features** - Unlimited private repositories and advanced tools
- **Free SSL certificates** via Cloudflare - Secure HTTPS connections
- **PlanetScale or Railway** - Free MySQL database hosting
- **SendGrid** - Free email service (100 emails/day)
- **Many more tools** - CI/CD, monitoring, analytics, and development tools

These benefits reduce the project's first-year cost to approximately **$62 USD**, making it highly accessible for educational purposes while maintaining professional quality.

## Using GitHub Copilot Prompt

A comprehensive prompt has been created for generating SRS documents using GitHub Copilot:

### Quick Start
1. Open the file `COPILOT_SRS_PROMPT.md`
2. Copy the master prompt section
3. Paste it into GitHub Copilot Chat
4. Add your project-specific details:
   - Project name and type
   - Technology stack
   - User roles
   - Main features
   - Budget constraints
   - Team information

### Example Usage
```
Using the SRS generation prompt from COPILOT_SRS_PROMPT.md, create an SRS document for:
- Project: E-Commerce Mobile Platform
- Tech Stack: React Native, Node.js, PostgreSQL
- User Roles: Customer, Vendor, Admin
- Main Features: Product browsing, ordering, payment, delivery tracking
- Budget: Student project with GitHub Student benefits
- Team Lead: Your Name
```

### Benefits
- **Automated Generation**: Create complete SRS in minutes
- **Consistency**: Follow IEEE 830-1998 standards automatically
- **Completeness**: All required sections included
- **Customizable**: Easy to adapt for different projects
- **Best Practices**: Built-in quality and structure guidelines

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
