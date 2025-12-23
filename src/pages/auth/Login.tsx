import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useOfficer';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const loginMutation = useLogin();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(formData, {
            onSuccess: () => {
                navigate('/dashboard');
            },
        });
    }
    return ( 
        <div className="flex flex-col items-center justify-center h-screen border  bg-gradient-to-bl from-gray-300 to-white">
            <div className=" rounded-lg border border-gray-300 py-12 px-12 w-[40%] bg-white">
                <h1 className="text-3xl text-center uppercase">Login</h1>
                <h2 className="text-lg text-center">Welcome back to EmmaSunny CIS</h2>
                <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
                    <span className="flex flex-col gap-2 ">
                        <label htmlFor="username" className="capitalize font-semibold">username</label>
                        <input type="text" 
                        placeholder="your username"
                        className="border border-gray-400 px-3 py-2 rounded-lg w-full"
                        onChange={handleChange}
                        name="username"
                        disabled={loginMutation.isPending}
                        required
                        />
                    </span>
                    <span className="flex flex-col gap-2 ">
                        <label htmlFor="password" className="capitalize font-semibold">password</label>
                        <input type="your password" 
                        placeholder="Password"
                        className="border border-gray-400 px-3 py-2 rounded-lg "
                        onChange={handleChange}
                        name="password"
                        disabled={loginMutation.isPending}
                        required
                        />
                    </span>

                    {/* Show error message */}
        {loginMutation.isError && (
          <p style={{ color: 'red' }}>
            {loginMutation.error?.response?.data?.message || 'Login failed'}
          </p>
        )}
                    <button type="submit"
                    disabled={loginMutation.isPending}
                    className="bg-emerald-500 text-orange-600 font-semibold rounded-lg py-3 text-lg">
                        {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </button>
                </form>
            </div>
        </div>
     );
}
 
export default Login;