import styled from './Register.module.css';
import { useForm } from 'react-hook-form';
import { registration } from '../../api/auth.service';
import {
    errorCPass, errorLength, invalidEmail, isRequired,
    signUpTitle, passwordForm, emailForm, confirmPassForm, passwordContainsDigits
} from '../../constant/constants';
import { useState } from 'react';
import { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

//toast notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Register() {

    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPass, setErrorPass] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { authenticated } = useSelector((state) => state.users);

    useEffect(() => {
        if (authenticated)
            navigate('/');
    }, [authenticated, navigate, dispatch]);

    const { register, handleSubmit, getValues, formState: { errors } } = useForm();

    const containsOnlyDigits = (value) => {
        return /^\d+$/.test(value); // check if the value contains only digits
    };

    const notify = () => {
        toast.success('Successfully registered!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    const onSubmit = async (registerData) => {
        setIsDisabled(true);
        try {
            const response = await registration(registerData);
            if (response.status === 200 || response.status === 201) {
                notify();
                setTimeout(() => {
                    navigate("/login");
                    setIsDisabled(false);
                }, 3000);
            } else {
                setIsDisabled(false);
            }
        } catch (error) {
            setErrorEmail(error.response?.data.email);
            setErrorPass(error.response?.data.password);
            setIsDisabled(false);
        }

    }

    return (
        <div>
            <div className={styled.linearGradient}>
                <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>
                    <p className={styled["form-title"]}>{signUpTitle}</p>

                    <div className={styled["input-container1"]}>
                        <input
                            type="text"
                            className="input"
                            name="first_name"
                            placeholder="First name"
                            {...register("first_name", {
                                required: true,
                                minLength: 3
                            })} />
                        {errors.first_name && errors.first_name.type === "required" && (
                            <p className={styled.errorFirsField}>Required field</p>
                        )}
                        {errors.first_name && errors.first_name.type === "minLength" && (
                            <p className={styled.errorFirsField}>3 characters minimum.</p>
                        )}

                        <input
                            type="text"
                            className="input"
                            name="last_name"
                            placeholder="Last name"
                            {...register("last_name", {
                                required: true,
                                minLength: 3
                            })} />
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>
                        </span>

                        {errors.last_name && errors.last_name.type === "required" && (
                            <p className={styled.errorSecondField}>Required field</p>
                        )}
                        {errors.last_name && errors.last_name.type === "minLength" && (
                            <p className={styled.errorSecondField}>3 characters minimum</p>
                        )}

                    </div>

                    <div className={styled["input-container"]}>
                        <input
                            type="email"
                            className="input"
                            name="email"
                            placeholder="Email"
                            {...register("email", {
                                required: true,
                                pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                            })} />
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 256 256"><path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                        </span>
                    </div>
                    {errors.email && errors.email.type === "required" &&
                        (<p className={styled.error}>{emailForm} {isRequired}</p>)}

                    {errors.email && errors.email.type === "pattern" &&
                        (<p className={styled.error}>{invalidEmail}</p>)}

                    <div className={styled["input-container"]}>
                        <input
                            type="password"
                            placeholder='Password'
                            name="password"
                            className='input input-field'
                            {...register("password", {
                                required: true,
                                minLength: 8,
                                validate: {
                                    containsOnlyDigits: (value) => !containsOnlyDigits(value)
                                }
                            })} />

                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 256 256"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z"></path></svg>
                        </span>
                    </div>
                    {errors.password && errors.password.type === "required" &&
                        (<p className={styled.error}>{passwordForm} {isRequired}</p>)}


                    {errors.password && errors.password.type === "minLength" &&
                        (<p className={styled.error}>{errorLength}</p>)}

                    {errors.password && errors.password.type === "containsOnlyDigits" &&
                        (<p className={styled.error}>{passwordContainsDigits}</p>)}

                    <div className={styled["input-container"]}>
                        <input
                            type="password"
                            placeholder='Confirm Password'
                            name="password_confirm"
                            className='input'
                            {...register("password_confirm", {
                                required: true,
                                validate: (value) => {
                                    const { password } = getValues();
                                    return password === value
                                }
                            })} />

                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 256 256"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z"></path></svg>
                        </span>

                        {errors.password_confirm && errors.password_confirm.type === "required" &&
                            (<p className={styled.error}>{confirmPassForm} {isRequired} </p>)}


                        {errors.password_confirm && errors.password_confirm.type === "validate" &&
                            (<p className={styled.error}>{errorCPass}</p>)}
                    </div>


                    <button className={styled.submit} disabled={isDisabled} >
                        {!isDisabled ? 'Sign up' : 'Loading...'}</button>


                    <p className={styled["signup-link"]}>
                        Already have an account?
                        <Link to="/login" className={styled.signupLink}> Login</Link>
                    </p>
                    <p className={styled.error} style={{ textAlign: "center" }}>{errorEmail !== null && errorEmail}</p>
                    <p className={styled.error} style={{ textAlign: "center" }}>{errorPass !== null && errorPass}</p>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}
