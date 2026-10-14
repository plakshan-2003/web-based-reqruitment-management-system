# CareerLink Backend (Spring Boot)

A layered (Controller → Service → Repository → Model) backend for the
CareerLink EER diagram (User ISA JobSeeker | Staff | Admin), built to demonstrate all four OOP pillars explicitly
for the IT2140 / SE2030 assignments.

## How to run

1. Requires Java 17+ and Maven.
2. `mvn spring-boot:run` (or import into IntelliJ/Eclipse as a Maven project and run `CareerLinkApplication`).
3. Uses an in-memory H2 database by default — no setup needed. Console at
   `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:careerlink`).
4. Swap the H2 dependency/properties for MySQL or Postgres for anything
   beyond local testing — see `application.properties`.

## Folder structure

```
src/main/java/com/careerlink/backend/
  entity/           JPA entities (User hierarchy, JobPosting, Application, ...)
  entity/enums/     AccountStatus, JobStatus, ApplicationStatus, ...
  dto/              request/response DTOs (empty for now)
  repository/        Spring Data JpaRepository interfaces, one per entity
  service/           service interfaces (the abstraction layer)
  service/impl/      concrete implementations, annotated @Service
  controller/        REST controllers, one per feature area
  exception/         ResourceNotFoundException + global @RestControllerAdvice
  config/            (empty - supply a PasswordEncoder bean, e.g. BCryptPasswordEncoder, which UserServiceImpl injects)
```

## Where each OOP pillar lives

**Encapsulation** — every entity (`User`, `JobPosting`, `Application`, ...)
keeps its fields `private` and exposes only getters/setters or intention-
revealing methods (e.g. `Notification.markAsRead()` instead of a public
setter for `readStatus`).

**Abstraction** — `User` is an abstract class with two abstract methods
(`getRole()`, `getDashboardSummary()`) that force every subtype to define
its own behaviour. Every service is defined first as an interface
(`UserService`, `JobPostingService`, ...) that controllers depend on —
the concrete `*ServiceImpl` classes could be swapped out without touching
a single controller.

**Inheritance** — `JobSeeker`, `Staff`, and `Admin` all `extends User`,
mapped with JPA's `SINGLE_TABLE` inheritance strategy (matching the ISA
hierarchy in the EER diagram) and inheriting every shared field/method for
free.

**Polymorphism** —
- *Runtime (overriding):* `getRole()` / `getDashboardSummary()` return a
  different answer depending on which concrete subclass is actually
  instantiated, even when called through a plain `User` reference (see
  `UserServiceImpl.describeUser(User user)` and `NotificationService.send
  (User recipient, ...)` — both accept the abstract type and work correctly
  for any subtype passed in).
- *Overriding a concrete method:* `Admin.canLogIn()` overrides `User`'s
  default implementation so a banned Admin can still log in read-only.
- *Compile-time (overloading):* `JobPostingService.search(String keyword)`
  vs `search(String category, String location)` —
  two methods, same name, resolved by the compiler based on the arguments.

## CRUD by major function (FR numbers refer to the SE2030 proposal)

**1. Candidate Management** (FR-01, 05-09)

| | Endpoint |
|---|---|
| Profile C | `POST /api/auth/register/job-seeker` (staff: `/register/staff` with `jobTitle`, `departmentName`; admin: `/register/admin`) |
| Profile R | `GET /api/job-seekers`, `GET /api/job-seekers/{id}` |
| Profile U | `PUT /api/job-seekers/{id}` (firstName, lastName, profilePicture, bio, `emails` list, `contactNumbers` list) |
| Profile D | `DELETE /api/job-seekers/{id}` |
| CV C / R | `POST /api/cvs/job-seeker/{id}`, `GET /api/cvs/job-seeker/{id}`, `GET /api/cvs/{cvId}` |
| CV U / D | `PUT /api/cvs/{cvId}`, `DELETE /api/cvs/{cvId}` |
| Search | `GET /api/jobs/search?keyword=` or `?category=&location=` |
| Apply C / R / U | `POST /api/applications?jobSeekerId=&jobId=`, `GET /api/applications/job-seeker/{id}`, `PUT /api/applications/{id}/withdraw` |
| Bookmark C / R / D | `POST /api/bookmarks`, `GET /api/bookmarks/job-seeker/{id}`, `DELETE /api/bookmarks?jobSeekerId=&jobId=` |

**2. Job Posting Management** (FR-10-13)

| | Endpoint |
|---|---|
| C | `POST /api/jobs/staff/{staffId}` (title and deadline required) |
| R | `GET /api/jobs?status=PUBLISHED`, `GET /api/jobs/{id}`, `GET /api/jobs/staff/{id}` |
| U | `PUT /api/jobs/{id}` (partial), `PUT /api/jobs/{id}/publish\|unpublish\|archive` |
| D | `DELETE /api/jobs/{id}` |

**3. Applicant Tracking Management** (FR-14-17)

| | Endpoint |
|---|---|
| R | `GET /api/applications/job/{jobId}`, `GET /api/applications/{id}`, `GET /api/applications/{id}/cvs`, `GET /api/applications/job/{jobId}/cvs` |
| U | `PUT /api/applications/{id}/status?status=SHORTLISTED\|REJECTED\|HIRED...` (notifies the candidate) |
| D | `DELETE /api/applications/{id}` |

**4. Interview Scheduling Management** (FR-18-20)

| | Endpoint |
|---|---|
| C | `POST /api/interviews?jobSeekerId=&staffId=` (body: `dateTime`, `mode`; notifies the candidate) |
| R | `GET /api/interviews/{id}`, `/staff/{id}`, `/job-seeker/{id}` |
| U | `PUT /api/interviews/{id}`, `/{id}/reschedule`, `/{id}/cancel`, `/{id}/complete` |
| D | `DELETE /api/interviews/{id}` |

**5. Admin Moderation & Notifications** (FR-21-23)

| | Endpoint |
|---|---|
| Moderation C | `POST /api/moderation/{jobId}/approve\|reject?adminId=` (notifies the staff member who posted the job) |
| Moderation R | `GET /api/moderation/{jobId}/history`, `/logs`, `/logs/{logId}`, `/logs/admin/{adminId}` |
| Moderation U / D | `PUT /api/moderation/logs/{logId}`, `DELETE /api/moderation/logs/{logId}` |
| Users R | `GET /api/admin/users`, `GET /api/admin/users/{id}` |
| Users U / D | `PUT /api/admin/users/{id}/ban\|unban`, `DELETE /api/admin/users/{id}` |
| Job posting request | `POST /api/admin/job-requests?adminId=` - body: `jobTitle`, `salaryMin`, `salaryMax`, `deadline`, optional `notes` and `staffId` (omit to notify all staff); creates a `JOB_POSTING_REQUEST` notification |
| Notification C | `POST /api/notifications` (userId, message, type) - plus automatic ones from the actions above |
| Notification R | `GET /api/notifications/user/{id}`, `/user/{id}/unread`, `/{id}` |
| Notification U / D | `PUT /api/notifications/{id}/read`, `PUT /api/notifications/user/{id}/read-all`, `DELETE /api/notifications/{id}` |

## Mapping to the EER diagram

| Diagram | Code |
|---|---|
| User (UserID, Name = FirstName + LastName, ProfilePicture, RegisteredDate, PasswordHash) | `User` (abstract, SINGLE_TABLE) |
| ContactNo, Email (multivalued) | `user_contact_numbers`, `user_emails` collection tables (first email is the login/primary one) |
| IS A: JobSeeker (Bio), Staff (JobTitle, departmentName), Admin (AdminLevel) | `JobSeeker`, `Staff`, `Admin` extend `User` |
| User 1 -- Receives -- N Notification | `Notification.user` |
| JobSeeker 1 -- Belongs -- N CV | `CV.jobSeeker` |
| JobSeeker -- Applies -- JobPosting (Application) | `Application` (jobSeeker + jobPosting) |
| JobSeeker M -- Saves -- N JobPosting (Bookmark) | `Bookmark` (jobSeeker + jobPosting) |
| Staff 1 -- Posts -- N JobPosting | `JobPosting.staff` |
| Staff 1 -- Scheduled by -- N Interview | `Interview.staff` |
| JobSeeker 1 -- Scheduled for -- N Interview | `Interview.jobSeeker` |
| Admin 1 -- Moderates -- N ModerationLog, N JobPosting | `ModerationLog` (admin + jobPosting) |
| Tags (JobPosting) | `job_posting_tags` collection table |

Not in the diagram but kept: `User.accountStatus` (ACTIVE/BANNED) for the
admin ban/unban feature and the `Admin.canLogIn()` override.

## Known simplifications (worth stating in your report)

- Each `JobSeeker` has one current CV per upload slot, not a versioned
  snapshot per `Application`.
- An `Interview` is linked to a job seeker and a staff member only (as in the
  diagram), so it is not tied to a particular application or job.
- No JWT/session layer is wired up yet — `AuthController.login()` returns
  the resolved role and a dashboard summary; add Spring Security's
  filter chain if the assignment requires real session/token auth.
- Notifications are in-app only (no email sending yet); they are created automatically on application status
  changes, interview schedule/reschedule/cancel, and job moderation decisions.
- Not compiled or run here (no JDK/Maven in this environment) - run `mvn spring-boot:run` once to confirm.
