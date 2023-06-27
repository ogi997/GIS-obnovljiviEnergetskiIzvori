import { useForm } from "react-hook-form";
import styled from './style.module.css';
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../redux-store/userSlice';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { statusCodeMessage } from "../../utils/StatusCodeException/Login/StatusCode";
import { status } from '../../redux-store/userSlice';


const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [statusCode, setStatusCode] = useState(null);

    const { authenticated, loading } = useSelector((state) => state.users);

    const onSubmit = async (loginData) => {
        const response = await dispatch(login(loginData));
        if (response.error) {
            setStatusCode(response.error.message);
            return;
        }
        dispatch(status());
        nav('/');
    }


    useEffect(() => {
        if (authenticated)
            nav('/');
    }, [authenticated, nav, dispatch]);
    return (

        <div className={styled.linearGradient}>
            <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>
                <p className={styled["form-title"]}>Sign in to your account</p>
                <div className={styled["input-container"]}>
                    <input placeholder="Email" type="email"
                        name="email" {...register("email", {
                            required: true,
                            pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                        })}

                    />
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                    </span>
                </div>
                {errors.email && errors.email.type === "required" && (
                    <p className={styled.error}>Email is required</p>)}
                {errors.email && errors.email.type === "pattern" &&
                    (<p className={styled.error}>Invalid email</p>)}

                <div className={styled["input-container"]}>
                    <input placeholder="Password" type="password"

                        name="password" {...register("password", {
                            required: true
                        })} />

                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 256 256"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z"></path></svg>
                    </span>
                </div>
                {errors.password && errors.password.type === "required" && (
                    <p className={styled.error}>Password is required</p>
                )}

                {
                    statusCode &&
                    <p className={styled.error} style={{ maxWidth: "250px" }}>
                        {statusCodeMessage(statusCode)}
                    </p>

                }
                <button className={styled.submit} type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>

                <p className={styled["signup-link"]}>
                    No account?
                    <Link to="/register" className={styled.LoginLink}> Register</Link>
                </p>
            </form>
        </div>

    );
}
export default Login;
