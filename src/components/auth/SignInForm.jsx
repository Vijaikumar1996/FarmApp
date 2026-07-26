import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginUser } from "../../store/slices/authSlice";

import FormGrid from "../form/FormGrid";
import InputField from "../form/form-input/InputField";
import Button from "../ui/button/Button";

import toast from "react-hot-toast";
import { EyeClosed, EyeOffIcon } from "lucide-react";
import AppConfig from "../../utils/appConfig";

/* ---------------- Schema ---------------- */

const loginSchema = z.object({
  Username: z.string().min(1, "Username is required"),
  Password: z.string().min(1, "Password is required"),
});

export default function SignInForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Username: "",
      Password: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(
      loginUser({
        ...data,
        appType: AppConfig.appType,
      }),
    );
  };

  useEffect(() => {
    if (user) {
      toast.success("Login successful");
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 px-8 pb-5">

        {/* Brand */}

        <div className="flex items-center justify-center gap-3">

          <img
            src="/images/logo/full-logo.png"
            alt="logo"
           className="h-40 rounded-full"
          />
         
        </div>

        {/* Welcome */}

        <div className="mb-8 text-center">

          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>

          <p className="mt-2 text-gray-500">
            Sign in to continue to
          </p>

          <p className="font-semibold text-[#1E5B34]">
            {AppConfig.companyName}
          </p>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(onSubmit)}>

          <FormGrid cols={1}>

            <InputField
              name="Username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              control={control}
              error={errors.Username}
              required
            />

            <div className="relative">

              <InputField
                name="Password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                control={control}
                error={errors.Password}
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-5 text-gray-500" />
                ) : (
                  <EyeClosed className="size-5 text-gray-500" />
                )}
              </span>

            </div>

          </FormGrid>

          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="w-full mt-8 bg-[#1E5B34] hover:bg-[#17462A] text-white rounded-xl"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

        </form>

      </div>
    </div>
  );
}