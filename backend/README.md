# Backend README

To install backend dependencies:
```
make install-backend-deps
```

To run backend:
```
make run-backend
```

### AUTH

Cookie + CSRF token in `X-CSRF-Token` header

### API

- register
```
POST /register {"login": "login", "password": "password"}

{
    "csrf_token": "...",
    "login": "login",
    "is_demo": boolean,
}
```

- login:
```
POST /login {"login": "login", "password": "password"}

{
    "csrf_token": "...",
    "login": "login",
    "is_demo": boolean,
}
```

- logout:
```
POST /logout

200 OK
```

- who am i?
```
GET /whoami

{
    "login": null or "...",
    "csrf_token": "...",
    "is_demo": boolean,
}

```


- get posts:
```
GET /data[tags=tagA,tagB,...][after=<int>]
{
    "posts": [...]
}
```

- delete post:
```
DELETE /data?post_id=a1

200 OK
```

- restore deleted post:
```
POST /data/restore?post_id=a1

200 OK
```


- add tags:
```
POST /data/tag?post_id=a1
{
    "tags": [<str>],
}
```

- delete tags:
```
POST /data/tag/delete?post_id=a1
{
    "tags": [<str>],
}
```

- suggest tags:
```
GET /tags/suggest[?prefix=...]

{
    "tags": [...],
}
```

- reset demo:
```
POST /data/reset-demo

200 OK
```
