"use client";

import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

interface FormData {
  username?: string; // Make it optional because we don't need it for login page
  email: string;
  password: string;
}

const AuthForm = ({ type }: { type: "register" | "login" }) => {
  const router = useRouter();
  const [loading,setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues:
      type === "register"
        ? { username: "", email: "", password: "" }
        : { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)
    let res;
   try{
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
  }catch (err) {
    toast.error("Failed to handle authentication");
  }finally{
    setLoading(false)
  }
  };

  return (
    <div className="auth">
      <div className="overlay">
        <div className="content">
          <img src="/assets/logo.png" alt="logo" className="logo" />

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            {type === "register" && (
              <>
                <div className="input">
                  <input
                   disabled={loading}
                    {...register("username", {
                      required: "Username is required",
                      validate: (value: string | undefined) => {
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
                  <PersonOutline sx={{ color: "white" }} />
                </div>
                {errors.username && (
                  <p className="error">{errors.username.message}</p>
                )}
              </>
            )}

            <div className="input">
              <input
               disabled={loading}
                {...register("email", {
                  required: "Email is required",
                })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "white" }} />
            </div>
            {errors.email && <p className="error">{errors.email.message}</p>}

            <div className="input">
              <input
               disabled={loading}
                {...register("password", {
                  required: "Password is required",
                  validate: (value: string | undefined) => {
                    if (
                      !value ||
                      value.length < 2
                    ) {
                      return "Password must be 2 characters long";
                    }
                    return true;
                  },
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <LockOutlined sx={{ color: "white" }} />
            </div>
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            <button  disabled={loading} className="button" type="submit">
              {type === "register" ? "Join Free" : "Let's Watch"}
            </button>
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
  );
};

export default AuthForm;
