"use client";

import { EmailOutlined, LockOutlined, PersonOutline, } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react"

import { useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';


const AuthForm = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    let res;

    if (type === "register") {
      res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        toast.error("Something went wrong");
      }
    }

    if (type === "login") {
      res = await signIn("credentials", {
        ...data,
        redirect: false,
      })

      if (res && res.ok) {
        router.push("/");
      } else {
        toast.error("Invalid credentials");
      }
    }
  };


  return (
    <div className="auth">
      <div className="overlay">
        <div className="content">
          <h1 className="text-heading1-bold">Nails</h1>

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            {type === "register" && (
              <>
                <div className="input">
                  <input
                    {...register("username", {
                      required: "Username is required",
                      validate: (value) => {
                        if (!value || value.length < 2) {
                          return "Username must be more than 1 character";
                        }
                        return true;
                      },
                    })}
                    type="text"
                    placeholder="Username"
                    className="input-field"
                  />
                  <PersonOutline sx={{ color: "#737373" }} />
                </div>
                {errors.username && (
                  <p className="error">{errors.username.message}</p>
                )}
              </>
            )}

            <div className="input">
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="error">{errors.email.message}</p>
            )}

            <div className="input">
              <input
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (
                      !value ||
                      value.length < 5 ||
                      value.length > 20 ||
                      !value.match(/[a-zA-Z]/)
                    ) {
                      return "Password must be between 5 and 20 character with at least one letter";
                    }
                    return true;
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
              />

              <IconButton 
                type="button"
                aria-label="eye-closed" 
                size="small"
                color="primary" 
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <img src="/assets/eye-open.svg" width={20} height={20} />
                ) : (
                  <img src="/assets/eye-closed.svg" width={20} height={20} />
                )}
              </IconButton>
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            <Button variant="outlined" color="secondary" className="button2" type="submit">
            {type === "register" ? "Join Free" : isSubmitting ? "登入..." : "Let's Pretty"}
            </Button>
          </form>

          {type === "register" ? (
            <Link href="/login">
              <p className="link">Already have an account? Log In Here</p>
            </Link>
          ) : (
            <Link href="/register">
              <p className="link">Don't have an account? Register Here</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm