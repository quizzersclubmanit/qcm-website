import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Input, Button, SectionHead, Footer, Loader } from "../components/components";
import { useForm } from "react-hook-form";
import authService from "../api/auth.service";
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { handleSubmit, register, formState, watch } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  const { errors } = formState;
  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/signin");
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword
      });
      
      toast.success("Password reset successfully! Please login with your new password.");
      navigate("/signin");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Container
        id="reset-password"
        className="poppins-regular sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col justify-center"
      >
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white sm:pt-0 pt-4 pb-6 sm:px-8 px-6 rounded-2xl flex flex-col gap-8">
            <SectionHead
              blue
              className="poppins-bold text-center text-[50px]"
              label="Reset Password"
              logo
            />
            
            <form onValidate className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="focus:outline-0 p-3 focus:bg-gray-100 transition-all pr-12"
                  style={{ borderBottom: "2px solid blue" }}
                  error={errors.newPassword}
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="focus:outline-0 p-3 focus:bg-gray-100 transition-all pr-12"
                  style={{ borderBottom: "2px solid blue" }}
                  error={errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match"
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>

              <Button
                type="submit"
                label="Reset Password"
                className="p-3 rounded-lg text-lg text-white hover:bg-[#1d2d50] bg-[#14213D] mt-4"
                disabled={loading}
              />
            </form>

            <div className="text-center">
              <Button
                className="text-blue-500 text-sm"
                onClick={() => navigate("/signin")}
              >
                Back to Login
              </Button>
            </div>

            <div className="text-gray-600 text-sm">
              <p className="text-black font-semibold">Security Notice:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Choose a strong password with at least 6 characters</li>
                <li>Don't reuse passwords from other accounts</li>
                <li>This reset link expires in 1 hour</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default ResetPassword;
