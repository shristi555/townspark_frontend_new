# TownSpark Testing Documentation

This document outlines the testing strategy and results for the TownSpark platform, covering unit testing, integration testing, and system-level testing.

## 1. Unit Testing

Unit testing focused on individual components, validation logic, and specific backend views to ensure each piece of logic performs as expected in isolation.

### 1.1. Authentication & Registration
| S.N | Case | Input | Expected Outcome | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---:|
| 1 | Admin Login with invalid credentials | Email: admin@wrong.com, Pass: 123 | "These credentials do not match our records." | As expected | Pass |
| 2 | New User Registration (Empty Email) | Name: John, Email: "", Pass: secure123 | Validation error: "Email is required." | As expected | Pass |
| 3 | Password Complexity Validation | Pass: "123" (too short) | Validation error regarding minimum length. | As expected | Pass |
| 4 | Successful Login | Email: user@gmail.com, Pass: val123 | Redirect to user dashboard. | As expected | Pass |

### 1.2. Issue Management Logic
| S.N | Case | Input | Expected Outcome | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---:|
| 1 | Archive an active issue | Issue ID: 15, Action: Archive | `is_archived` becomes `true`. | As expected | Pass |
| 2 | Delete unarchived issue | Issue ID: 20 (is_archived: false) | HTTP 400 error: "Archive first to delete." | As expected | Pass |
| 3 | Unarchive an issue | Issue ID: 15, Action: Unarchive | `is_archived` becomes `false`. | As expected | Pass |
| 4 | Delete archived issue | Issue ID: 15 (is_archived: true) | HTTP 204: Issue deleted successfully. | As expected | Pass |

---

## 2. Integration Testing

Integration testing ensures that the frontend, backend API, and database services work seamlessly together.

| S.N | Integrated Modules | Test Scenario | Expected Outcome | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---:|
| 1 | Frontend + Media Storage | Uploading 3 images with a new report | Images are saved in `/media/` and displayed on the details page. | Working | Pass |
| 2 | API + Database | Posting a comment on an issue | Comment is persisted and count increases in the issue list. | Working | Pass |
| 3 | Authentication + Service | Token-based request for private issues | User sees only their reported issues in the "My Issues" list. | Working | Pass |
| 4 | Real-time Updates | Changing issue status (Resolved) | The status badge updates immediately on the frontend. | Working | Pass |

---

## 3. System Testing

System testing evaluates the application as a complete, integrated system to verify compliance with business requirements.

| S.N | Test Type | Description | Expected Outcome | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---:|
| 1 | Usability Testing | User navigates from Home to Explore and reports an issue | Navigation is intuitive and user-friendly. | Usable | Pass |
| 2 | Load Testing | 100 parallel requests to the Explore feed | System handles requests without significant delay. | Working | Pass |
| 3 | Regression Testing | Verify existing features after adding Archive logic | Reporting and commenting functions remain stable. | No new bugs | Pass |
| 4 | Recovery Testing | Intentionally crash the dev server | Server restarts and database state remains consistent. | Reliable | Pass |
| 5 | Functional Testing | Complete end-to-end report-to-resolution flow | All phases (Report -> Progress -> Resolve) work smoothly. | Functional | Pass |
