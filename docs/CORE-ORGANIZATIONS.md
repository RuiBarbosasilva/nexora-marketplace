# Core domain: organizations and tenant isolation

## Implemented in the foundation branch

- Runtime schemas for organization creation, organization type/status and membership roles.
- Organization slug normalization to lowercase and rejection of invalid characters.
- Strict input schemas reject unexpected fields.
- A pure access-policy helper denies access when membership is missing, inactive, tied to another user, or belongs to another organization.
- Unit tests cover accepted input, malformed input, unexpected properties, inactive membership, role restrictions and cross-organization access.

- Membership input tests also verify UUID format, role allowlisting and rejection of unexpected fields.
- The access helper's documentation now accurately describes `allowedRoles` as an allowlist, not a role hierarchy; it does not infer that OWNER outranks ADMIN.

## Important boundaries

This is domain validation and a policy helper, not a complete authentication or authorization system. It does not authenticate a user, load membership from a database, persist organizations, manage sessions, or protect routes automatically. A future route must obtain the authenticated identity from a trusted authentication layer and retrieve current membership from persistent storage before calling the policy.

## Initial organization roles

| Role | Intended scope |
|---|---|
| OWNER | Ownership and organization-level control |
| ADMIN | Administrative operations |
| MANAGER | Day-to-day management, to be scoped per capability |
| MEMBER | Standard operational access |
| VIEWER | Read-only access |

These are initial domain labels only. Fine-grained permissions and sensitive actions must be explicitly designed and tested before production.

## Tenant isolation rules

1. Every organization-owned record must carry an organization identifier.
2. The server derives the acting user from authenticated context, never from a client-supplied user ID.
3. The server verifies active membership and the requested organization on every protected operation.
4. Database queries must be scoped to the authorized organization; checking only at the UI is insufficient.
5. Background jobs, exports, webhooks and support tooling must apply the same tenant boundaries.
6. Cross-tenant denial tests are required for each new domain and route.
7. Membership changes and privileged actions should produce auditable events.
