# Separate Documentation Files Summary

This document provides an overview of the two separate files created for acceptance criteria and user stories with use case diagrams.

---

## Files Created

### 1. ACCEPTANCE_CRITERIA.md (25 KB)

**Purpose:** Comprehensive acceptance criteria for all features in the Rental Management System

**Contents:**
- **Admin Features** (2 main features)
  - AC-A001: Manage Users (7 detailed criteria)
  - AC-A002: Monitor System (5 detailed criteria)

- **Landlord Features** (4 main features)
  - AC-L001: Manage Properties (7 criteria)
  - AC-L002: Manage Leases (7 criteria)
  - AC-L003: Track Payments (7 criteria)
  - AC-L004: Manage Expenses (7 criteria)

- **Tenant Features** (3 main features)
  - AC-T001: View Lease Details (6 criteria)
  - AC-T002: Make Payment (7 criteria)
  - AC-T003: Submit Notification (7 criteria)

- **System-Wide Features** (4 categories)
  - AC-S001: User Authentication (5 criteria)
  - AC-S002: Data Validation (3 criteria)
  - AC-S003: Performance (2 criteria)
  - AC-S004: Security (3 criteria)

**Key Features:**
- ✅ Each criterion is marked with a checkbox for tracking
- Clear, testable acceptance criteria
- Organized by feature with unique AC codes (e.g., AC-A001.1)
- Includes validation rules and error handling requirements
- References can be used in code commits and pull requests

**Usage:**
- **Developers:** Implement features to meet each criterion
- **QA:** Create test cases for each criterion
- **Product Owners:** Verify features meet all criteria during acceptance

---

### 2. USER_STORIES.md (27 KB)

**Purpose:** Complete user stories with use case diagrams for the Rental Management System

**Contents:**

#### Admin User Stories (5 stories)
- A-001: Create User Account
- A-002: Update User Information
- A-003: Delete User Account
- A-004: View System Dashboard
- A-005: Access System Logs

**PlantUML Diagram Included:** Complete Admin use case diagram showing all admin functionality with includes relationships

#### Landlord User Stories (12 stories)
- L-001: Add New Property
- L-002: Upload Property Images
- L-003: Add Units to Property
- L-004: Create Lease Agreement
- L-005: Upload Lease Documents
- L-006: Terminate Lease
- L-007: View Payment List
- L-008: Record Manual Payment
- L-009: View Outstanding Balances
- L-010: Add Property Expense
- L-011: Upload Expense Receipt
- L-012: Generate Expense Report

**PlantUML Diagram Included:** Complete Landlord use case diagram showing property, lease, payment, and expense management

#### Tenant User Stories (11 stories)
- T-001: View My Lease Details
- T-002: Download Lease Documents
- T-003: View Property Information
- T-004: Submit Rent Payment
- T-005: Upload Payment Receipt
- T-006: View Payment History
- T-007: Check Outstanding Balance
- T-008: Send Notification to Landlord
- T-009: Attach Files to Notification
- T-010: View Sent Notifications
- T-011: View Landlord Responses

**PlantUML Diagram Included:** Complete Tenant use case diagram showing lease viewing, payment, and communication features

#### System User Stories (5 stories)
- S-001: Register New Account
- S-002: Login to System
- S-003: Reset Forgotten Password
- S-004: Update Profile Information
- S-005: Upload Profile Picture

**PlantUML Diagram Included:** System-wide use case diagram for authentication and profile management

**Key Features:**
- ✅ Standard Agile format: "As a [role], I want to [action] so that [benefit]"
- Priority levels (High, Medium, Low)
- Story point estimates
- Sprint assignments
- Links to acceptance criteria
- Implementation tasks checklist for each story
- 4 comprehensive PlantUML use case diagrams

**Story Point Guide:**
- 1 point: < 4 hours
- 2 points: 4-8 hours
- 3 points: 1-2 days
- 5 points: 2-3 days
- 8 points: 3-5 days
- 13 points: Should be broken down

---

## How These Files Work Together

### Development Workflow

1. **Planning Phase**
   - Product Owner reviews USER_STORIES.md
   - Stories are prioritized and assigned to sprints
   - Team estimates story points

2. **Implementation Phase**
   - Developer picks a user story from USER_STORIES.md
   - References corresponding acceptance criteria in ACCEPTANCE_CRITERIA.md
   - Implements feature to meet all criteria
   - Checks off tasks in user story

3. **Testing Phase**
   - QA creates test cases based on ACCEPTANCE_CRITERIA.md
   - Each acceptance criterion becomes a test case
   - Tests verify user story meets all criteria
   - Marks criteria as pass/fail

4. **Acceptance Phase**
   - Product Owner reviews feature
   - Verifies all acceptance criteria are met
   - Approves user story
   - Story is marked as complete

### Cross-References

**In Code Commits:**
```
Implements US-L001 and AC-L001.1-3
- Added property creation form
- Implemented address validation
- All acceptance criteria met
```

**In Pull Requests:**
```
This PR implements User Story L-004: Create Lease Agreement
- All tasks completed
- Meets AC-L002.1 criteria 1-8
- Unit tests added
- Integration tests passing
```

**In Test Cases:**
```
Test Case: TC-L001-01
Based on: AC-L001.1 (Property Creation)
Verifies: Landlord can add new property with required fields
```

---

## Document Statistics

### ACCEPTANCE_CRITERIA.md
- **Total Features:** 13
- **Total Criteria:** 73
- **Admin Criteria:** 12
- **Landlord Criteria:** 28
- **Tenant Criteria:** 20
- **System Criteria:** 13

### USER_STORIES.md
- **Total Stories:** 33
- **Admin Stories:** 5 (15 story points)
- **Landlord Stories:** 12 (52 story points)
- **Tenant Stories:** 11 (37 story points)
- **System Stories:** 5 (19 story points)
- **Total Story Points:** 123

### Use Case Diagrams
- **Admin Diagram:** 14 use cases with includes relationships
- **Landlord Diagram:** 25 use cases with includes relationships
- **Tenant Diagram:** 18 use cases with includes relationships
- **System Diagram:** 12 use cases for authentication and profile

---

## PlantUML Diagrams

All 4 use case diagrams can be rendered at http://www.plantuml.com/plantuml/

**Diagrams Included:**
1. **Admin Use Cases** - Shows user management, system monitoring, configuration, and data management
2. **Landlord Use Cases** - Shows property, lease, payment, expense management, and tenant communication
3. **Tenant Use Cases** - Shows lease information, payment management, communication, and profile
4. **System Use Cases** - Shows authentication, profile management, and notifications

Each diagram is complete with:
- Actors
- Use cases
- Include relationships (<<includes>>)
- Clear hierarchical organization
- Proper UML notation

---

## Benefits of Separate Files

### For Project Management
✅ Easy to reference specific acceptance criteria by code  
✅ Can track which stories are complete  
✅ Clear view of total scope (123 story points)  
✅ Priority-based planning enabled  

### For Development
✅ Each story has clear implementation tasks  
✅ Can link commits to specific stories and criteria  
✅ Clear definition of done for each feature  
✅ Easy to estimate work based on story points  

### For Testing
✅ Each criterion is a potential test case  
✅ Clear test boundaries  
✅ Traceable from test to requirement  
✅ Pass/fail criteria are explicit  

### For Documentation
✅ Single source of truth for requirements  
✅ Version controlled with code  
✅ Easy to update as requirements change  
✅ Can generate reports from structured data  

---

## Integration with Main SRS Document

These files complement the main **SRS_RentalManagementSystem.docx**:

- **SRS Document:** Formal IEEE 830-1998 specification
- **USER_STORIES.md:** Agile user stories for development
- **ACCEPTANCE_CRITERIA.md:** Detailed testable requirements

All three documents cover the same system but from different perspectives:
- SRS = Formal specification
- User Stories = Development perspective
- Acceptance Criteria = Testing perspective

---

## Maintenance

### Updating Stories
When a requirement changes:
1. Update the user story in USER_STORIES.md
2. Update corresponding acceptance criteria in ACCEPTANCE_CRITERIA.md
3. Update SRS document if needed
4. Increment version numbers
5. Update revision history

### Adding New Features
When adding a new feature:
1. Create user story in USER_STORIES.md with unique ID
2. Add acceptance criteria in ACCEPTANCE_CRITERIA.md
3. Update use case diagram in PlantUML
4. Estimate story points
5. Assign to appropriate sprint

---

## Quick Reference

### File Locations
- `/ACCEPTANCE_CRITERIA.md` - All acceptance criteria
- `/USER_STORIES.md` - All user stories with diagrams
- `/SRS_RentalManagementSystem.docx` - Formal SRS document
- `/diagrams/` - Individual PlantUML files

### ID Conventions
- **User Stories:** PREFIX-NNN (e.g., A-001, L-012, T-008, S-003)
- **Acceptance Criteria:** AC-PREFIX-NNN.N (e.g., AC-L001.3, AC-T002.5)
- **Prefixes:** A=Admin, L=Landlord, T=Tenant, S=System

---

**Document Version:** 1.0  
**Created:** January 12, 2026  
**Last Updated:** January 12, 2026  

---

**End of Summary**
