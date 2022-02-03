Link: https://coliga-backend.herokuapp.com/

Routes => base_url/api{routes}

Auth
    /auth/register (POST)
    -> Body { name, email, password }

    /auth/active (GET) 
    -> Query { token }

    /auth/authenticate (POST)
    -> Body { email, password }

    /auth/forgot_password (POST)
    -> Body { email }

    /auth/reset_password (POST)
    -> Body { email, token, password }

User
    /user/:id (POST)
    -> Params { id }
