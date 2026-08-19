# Project DNA (Student Project Intelligence Platform)

An intelligent knowledge-sharing and lineage-tracking platform designed for discovering, connecting, and extending student projects across all 4 faculties of Kasetsart University Chalermphrakiat Sakon Nakhon Campus (KU CSC).

## Core Entities

**Student Project**:
A completed or ongoing academic project containing source code, research methodology, datasets, tech stack, and documentation.
_Avoid_: Senior thesis, paper, school work

**DNA Card**:
A standardized structured metadata summary of a project encapsulating its problem, target users, tech stack, outcomes, reusable assets, and constraints.
_Avoid_: Project summary sheet, info card

**Faculty (คณะ)**:
An academic faculty division within Kasetsart University Sakon Nakhon Campus (KUSE, FAM, FNRA, FPH).
_Avoid_: Department, school

**Department (สาขาวิชา)**:
An academic major program within a faculty (e.g., CPE, CS, ME, EE, AS, PH, MKT, etc.).
_Avoid_: Class, course

**Lineage (สายการต่อยอด)**:
The chronological and conceptual ancestor-descendant graph linking foundational projects to iterative improvements or derived solutions.
_Avoid_: Fork history, version chain

**Extension Opportunity (ช่องว่างการพัฒนา)**:
An AI-identified limitation or unexplored potential within a project that is recommended as a starting point for new students.
_Avoid_: Bug report, feature request, future work note

**Challenge (โจทย์จริงจากทุกภาคส่วน)**:
A real-world problem statement submitted by community partners, local agencies, industrial enterprises, or university departments seeking student technological solutions.
_Avoid_: Assignment, task, ticket

**Reusable Asset**:
A tangible output of a project (cleaned datasets, repository links, hardware blueprints, trained AI models, APIs) packaged specifically for successor teams to import and build upon.
_Avoid_: Attachment, upload, file

**DNA Vector**:
A multidimensional semantic embedding of a project's core concepts used for similarity clustering and automated gap discovery.
_Avoid_: Search index, keyword tag

**Inception Studio**:
The step-by-step guided workflow that takes an existing DNA Card and helps a student team scaffold a new successor project plan with gap milestones.
_Avoid_: Project creator, new form
