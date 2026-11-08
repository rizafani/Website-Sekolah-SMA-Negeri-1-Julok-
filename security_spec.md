# Security Specification: SMA Negeri 1 Julok Portal (Firestore ABAC)

## 1. Data Invariants & Security Principles
- **Global Safety Net**: Default-deny on all documents `match /{document=**} { allow read, write: if false; }`.
- **Public Read Access**: Articles (published only), announcements, agenda, gallery items, and public school settings are readable by anyone.
- **Admin Privilege**: Administrator (`admin` role or email `rizafani@gmail.com`) has full manage rights across all collections.
- **Instant Publishing (Zero-Approval)**: Editor and Guru can directly create and publish articles with `status: 'published'`.
- **Author Guard**: Guru can only edit or delete their own articles (`authorId == request.auth.uid`).
- **PPDB Submission**: Public users can create PPDB registration documents without authentication, but cannot read other applicants' private data.
- **PPDB Management**: Only administrators and authorized staff can read and update PPDB registrations.

## 2. The "Dirty Dozen" Threat Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Article Creation**: Anonymous user attempting to write to `/articles/art_malicious`.
2. **Ghost Field Injection**: Author attempting to inject `shadow_admin: true` in an article document.
3. **Impersonated Author**: User `usr_guru` trying to publish with `authorId: 'usr_admin'`.
4. **Non-Owner Article Modification**: Guru A attempting to update article owned by Guru B.
5. **PPDB Status Tampering**: Applicant attempting to update their own status from `Menunggu Verifikasi` to `Diterima`.
6. **Public PII Harvesting**: Unauthenticated user trying to read all `/ppdb` registrations.
7. **Settings Defacement**: Non-admin user trying to overwrite `/settings/main`.
8. **User Role Self-Escalation**: User attempting to change their role from `guru` to `admin`.
9. **Oversized Field Denial of Wallet**: Malicious payload with a 2MB string in the title field.
10. **Malicious Path Traversal**: Request attempting document ID poisoning with special characters.
11. **Orphaned Sub-Resource Write**: Deleting an article without ownership or admin privilege.
12. **Draft Scrape Bypass**: Unauthenticated visitor attempting to list unpublished draft articles.
