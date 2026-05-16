# API Documentation

Base URL: `http://localhost:5000/api`

All responses use:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Readable error message",
  "errors": []
}
```

## Auth

### Register

`POST /auth/register`

```json
{
  "name": "Asha Mehta",
  "email": "asha@example.com",
  "password": "StrongPass123",
  "role": "sales"
}
```

`role` is optional and can be `admin` or `sales`.

### Login

`POST /auth/login`

```json
{
  "email": "asha@example.com",
  "password": "StrongPass123"
}
```

### Current User

`GET /auth/me`

Requires `Authorization: Bearer <token>`.

## Leads

All lead routes require `Authorization: Bearer <token>`.

### List Leads

`GET /leads?page=1&status=qualified&source=instagram&search=rahul&sort=latest`

Query parameters:

- `page`: positive number, defaults to `1`
- `limit`: fixed to `10` by default
- `status`: `new`, `contacted`, `qualified`, `lost`
- `source`: `website`, `instagram`, `referral`
- `search`: name or email text
- `sort`: `latest` or `oldest`

Response includes pagination metadata:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 27,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "new",
  "source": "instagram"
}
```

### Get Lead

`GET /leads/:id`

### Update Lead

`PATCH /leads/:id`

```json
{
  "status": "qualified"
}
```

### Delete Lead

`DELETE /leads/:id`

Admin only.
