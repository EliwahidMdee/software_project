# GitHub Copilot Prompt for SRS Document Generation

## Context
Use this prompt with GitHub Copilot to generate a comprehensive Software Requirements Specification (SRS) document for a software project.

## Master Prompt

```
Create a comprehensive Software Requirements Specification (SRS) document following IEEE 830-1998 standard with the following structure and requirements:

## Document Structure:

### TITLE PAGE
- Project title
- Document type: "Software Requirements Specification"
- Version number and date
- Team information

### TABLE OF CONTENTS
Auto-generate section links for all major sections

### LIST OF FIGURES
Include all diagrams and visual elements

### 1.0 INTRODUCTION

1.1 Purpose
- Define the purpose of this SRS document
- Identify the intended audience (developers, testers, project managers, stakeholders)
- Explain how different audiences should use this document

1.2 Scope of Project
- Project name and overview
- Main features and capabilities
- Goals and benefits
- What is included and excluded from scope
- User roles supported

1.3 Glossary
- Define all technical terms, acronyms, and abbreviations
- Domain-specific terminology
- System-specific terms

1.4 References
- IEEE standards followed
- Technology documentation (frameworks, libraries, APIs)
- Related documents and resources

1.5 Overview of Document
- Brief description of remaining sections
- How sections relate to each other

1.6 Stakeholders
- Primary Stakeholders:
  * Project lead/owner with their role
  * Development team members and responsibilities
  * Consider GitHub Student benefits if applicable
- Secondary Stakeholders:
  * End users and their characteristics
  * Partners and service providers
  * System administrators

### 2.0 OVERALL DESCRIPTION

2.1 System Environment
- Architecture overview (client-server, microservices, etc.)
- Technology stack (frontend, backend, database)
- External systems and integrations
- Include PlantUML use case diagram showing system actors

2.2 Functional Requirements Specification
For each user role, provide:
- Use case diagrams (PlantUML format)
- Detailed use cases including:
  * Brief description
  * Step-by-step flow
  * User story ("As a [role], I want to [action] so that [benefit]")
  * Acceptance criteria (clear, testable conditions)
- Cover all major system features

2.3 User Characteristics
For each user role:
- Technical proficiency level
- Domain knowledge
- Frequency of use
- Special needs or considerations

2.4 Non-Functional Requirements
High-level overview of:
- Performance (response time, throughput)
- Security (authentication, authorization, encryption)
- Usability (interface design, accessibility)
- Reliability (uptime, recovery)
- Scalability (concurrent users, data volume)
- Maintainability (code quality, documentation)

2.5 Budget (Estimated)
- Detailed budget breakdown by category:
  * Development costs (if outsourced)
  * Design costs (UI/UX)
  * Infrastructure (domain, hosting, database)
  * Security tools and certificates
  * Development tools and licenses
  * Testing and QA tools
  * Marketing and promotion
  * Maintenance (first year)
  * Contingency buffer
- Consider GitHub Student Developer Pack benefits:
  * Free hosting credits (DigitalOcean, Azure, Heroku)
  * Free domain name
  * Free development tools (JetBrains, GitHub Pro)
  * Free database hosting
  * Free SSL certificates
  * Free cloud storage
- Total estimated budget
- Cost breakdown notes and assumptions

2.6 Feasibility Study
Comprehensive analysis across:

2.6.1 Technical Feasibility
- Technology availability and maturity
- Team expertise and learning curve
- Infrastructure requirements
- Scalability potential
- Integration capabilities
- Development tools availability
- Conclusion: Feasible/Not Feasible with justification

2.6.2 Economic Feasibility
- Initial investment requirements
- Recurring costs
- Revenue potential
- Cost-benefit analysis
- Break-even analysis
- Long-term sustainability
- Impact of student benefits or free tiers
- Conclusion: Feasible/Not Feasible with justification

2.6.3 Operational Feasibility
- User acceptance likelihood
- Market demand
- Training requirements
- Support requirements
- Deployment complexity
- Maintenance considerations
- Organizational readiness
- Conclusion: Feasible/Not Feasible with justification

2.6.4 Legal and Risk Feasibility
- Regulatory compliance
- Software licensing compliance
- Data protection and privacy laws
- Terms of service requirements
- Liability considerations
- Risk mitigation strategies
- Security compliance
- Conclusion: Feasible/Not Feasible with justification

2.6.5 Overall Feasibility Conclusion
- Summary of all feasibility dimensions
- Key strengths and advantages
- Potential challenges and mitigation
- Go/No-Go recommendation

### 3.0 REQUIREMENTS SPECIFICATION

3.1 External Interface Requirements
- 3.1.1 User Interfaces: Describe UI components, screens, navigation
- 3.1.2 Hardware Interfaces: Client and server hardware needs
- 3.1.3 Software Interfaces: External systems, APIs, libraries
- 3.1.4 Communication Interfaces: Protocols, data formats

3.2 Functional Requirements
For each major feature:
- Requirement ID and title
- Detailed description
- Processing steps/algorithm
- Input/output specifications
- Error handling
- Business rules

3.3 Detailed Non-Functional Requirements
Specific, measurable requirements for:
- 3.3.1 Performance (with metrics)
- 3.3.2 Security (specific measures)
- 3.3.3 Reliability (uptime, MTBF, MTTR)
- 3.3.4 Usability (accessibility, user experience)
- 3.3.5 Maintainability (code standards, documentation)

3.4 Data Model
- PlantUML class diagram showing:
  * All entities/models
  * Attributes with data types
  * Relationships and cardinality
  * Primary and foreign keys
- State diagrams for complex workflows
- Activity diagrams for key processes

### APPENDICES

Appendix A: PlantUML Diagram Instructions
- How to render diagrams online
- Local PlantUML setup instructions
- Editing and regenerating diagrams

## Format Requirements:

1. Use Microsoft Word DOCX format via python-docx library
2. Include proper heading hierarchy (Heading 1, 2, 3, 4)
3. Use bullet points for lists
4. Use bold text for emphasis on key terms
5. Include PlantUML code blocks in "Intense Quote" style
6. Add page breaks between major sections
7. Set standard page margins (1 inch)
8. Include current date in document

## PlantUML Diagrams Required:

1. System Environment Use Case Diagram - showing all actors and system
2. Role-specific Use Case Diagrams - for each user role
3. Data Model Class Diagram - complete entity relationship diagram
4. State Diagram - for key business processes
5. Activity Diagram - for complex workflows
6. Sequence Diagrams (optional) - for critical interactions

## Additional Requirements:

1. Every use case must include user stories in the format:
   "As a [role], I want to [action] so that [benefit]"

2. Every use case must have clear acceptance criteria that:
   - Are specific and measurable
   - Can be tested
   - Define "done" clearly

3. Budget section must:
   - Consider free/student resources
   - Include realistic cost estimates
   - Provide line-item breakdown
   - Note assumptions and variables

4. Feasibility study must:
   - Cover all four dimensions thoroughly
   - Provide evidence-based conclusions
   - Address risks and mitigation
   - Give clear go/no-go recommendation

5. All requirements must be:
   - Clear and unambiguous
   - Verifiable and testable
   - Consistent with each other
   - Traceable to user needs

## Python Script Generation:

Generate a Python script using python-docx library that:
1. Creates all sections programmatically
2. Uses helper functions for repetitive sections
3. Includes proper document formatting
4. Adds all required diagrams as PlantUML code
5. Saves the document with appropriate filename
6. Can be easily modified for future updates

## Usage Notes:

- Adapt technology stack to project specifics
- Adjust user roles to match application domain
- Scale budget based on project scope
- Include project-specific stakeholders
- Consider actual student benefits available
- Tailor diagrams to system architecture
```

## Example Usage

When starting a new project, provide this prompt to GitHub Copilot along with:
1. Your project name and type
2. Technology stack
3. User roles
4. Main features
5. Budget constraints
6. Team information

Example:
```
Using the SRS generation prompt above, create an SRS document for:
- Project: Online Learning Management System
- Tech Stack: Node.js, Express, MongoDB, React
- User Roles: Student, Instructor, Admin
- Main Features: Course management, video lessons, assignments, grading
- Budget: Student project with GitHub Student benefits
- Team Lead: [Your Name]
```

## Customization Tips

1. **For Different Domains:**
   - Adjust glossary terms to match domain
   - Modify user roles and characteristics
   - Adapt use cases to domain workflows

2. **For Different Tech Stacks:**
   - Update software interfaces section
   - Modify architecture diagrams
   - Adjust technical feasibility analysis

3. **For Different Budget Scales:**
   - Scale infrastructure costs appropriately
   - Add/remove budget categories
   - Consider commercial vs. free tools

4. **For Academic vs. Commercial:**
   - Adjust feasibility study depth
   - Modify stakeholder section
   - Change budget assumptions

## Document Maintenance

When updating the SRS:
1. Increment version number
2. Update date
3. Mark changed sections
4. Maintain consistency across sections
5. Regenerate using updated script
6. Review all cross-references

## Quality Checklist

Before finalizing the SRS, verify:
- [ ] All sections are complete
- [ ] All diagrams are included
- [ ] All user stories are present
- [ ] All acceptance criteria are testable
- [ ] Budget is realistic and detailed
- [ ] Feasibility study is comprehensive
- [ ] Stakeholders are properly identified
- [ ] Requirements are clear and unambiguous
- [ ] Document formatting is consistent
- [ ] Page numbers and TOC are correct
- [ ] References are accurate
- [ ] Glossary is complete
- [ ] No spelling or grammar errors

## Benefits of Using This Prompt

1. **Consistency:** Ensures all SRS documents follow the same structure
2. **Completeness:** Includes all IEEE 830-1998 required sections plus modern additions
3. **Efficiency:** Automates document generation with minimal manual work
4. **Quality:** Built-in best practices and standards compliance
5. **Maintainability:** Script-based generation allows easy updates
6. **Reusability:** Template works for various project types
7. **Education:** Teaches proper SRS structure and content

## Notes

- This prompt incorporates IEEE 830-1998 standards
- Includes modern Agile practices (user stories, acceptance criteria)
- Considers cost-effective solutions for students/startups
- Emphasizes visual documentation with PlantUML
- Focuses on completeness and clarity
- Suitable for both academic and commercial projects
