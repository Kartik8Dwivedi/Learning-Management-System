1) Register Route
    https://localhost:PORT/api/v1/user/register
        Payload:  (POST Request)
            - fullName
            - email
            - password
            - avatar (NotMandatory)

2) Login Route
    https://localhost:PORT/api/v1/user/login
        Payload:  (POST Request)
            - email
            - password

3) Logout Route
    https://localhost:PORT/api/v1/user/logout
        (GET Request)

4) Get Profile Route
    https://localhost:PORT/api/v1/user/me
        (GET Request)
        LogIn cookie required