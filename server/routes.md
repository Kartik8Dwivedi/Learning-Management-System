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

5) Forgot Password Mail Route
    https://localhost:PORT/api/v1/user/reset
        Payload:  (POST Request)
            - email
        This route will send a reset password link on registered email

6) Reset Password link request (after clicking on reset password link from mail)
    https://localhost:PORT/api/v1/user/reset/:restToken
        Payload:  (POST Request)
            - resetToken from params
            - New Password

7) Change Password Route
    https://localhost:PORT/api/v1/user/change-password
    Payload:  (POST Request)
        - User must be logged in
        - New Password
        - Old Password

8) Update User Profile
    https://localhost:PORT/api/v1/user/update
    Payload:  (PUT Request)
        - User ID (MongoDB ID)
        - Data to be changed (Avatar or Name)