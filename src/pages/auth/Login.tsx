const Login = () => {
    return ( 
        <div className="">
            <div className="">
                <h1>Login</h1>
                <form action="">
                    <span>
                        <label htmlFor="username">username</label>
                        <input type="text" 
                        placeholder="Username"
                        name="username"
                        />
                    </span>
                    <span>
                        <label htmlFor="password">password</label>
                        <input type="password" 
                        placeholder="Password"
                        name="password"
                        />
                    </span>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
     );
}
 
export default Login;