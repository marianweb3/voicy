import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail, MdOutlineVpnKey } from "react-icons/md";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import bannerImg from "../../assets/bg.webp";
import logo_vector from "../../assets/logo_vector.svg";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../services/api";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Store token and user data
      //@ts-ignore
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("isLoggedIn", "true");

      // Navigate to dashboard
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(email, password);

    if (email && password) {
      try {
        await loginMutation.mutateAsync({ email, password });
      } catch (error) {
        // Error handling is done in the mutation
        console.error("Login failed:", error);
      }
    }
  };

  // Helper function to get error message
  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return error.response.data.message;
    }
    return "Помилка авторизації. Перевірте email та пароль.";
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 px-4 lg:px-6">
        {/* Login Section */}
        <div className="max-w-[692px] w-full h-full flex items-center justify-center flex-col pt-[14px] lg:pt-[14px]  order-2 lg:order-1">
          <div className="max-w-[400px] w-full flex flex-col items-center gap-20">
            <img
              src={logo_vector}
              alt="logo"
              className="max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] w-full"
            />

            <div className="max-w-[350px] sm:max-w-[400px] w-full flex flex-col gap-6 sm:gap-8 lg:gap-10">
              <div className="flex flex-col gap-3 items-center justify-center text-center">
                <h1 className="text-[#00101F] text-[24px] sm:text-[28px] lg:text-[40px] leading-[100%]">
                  Авторизація
                </h1>
                <p className="text-[#9A9A9A] text-[14px] sm:text-[15px] lg:text-[16px] leading-[120%] lg:leading-[100%]">
                  Введіть email та пароль для входу в систему
                </p>
              </div>

              {/* Error Message */}
              {loginMutation.error && (
                <div className="bg-[#FFE5E5] border border-[#B24545] rounded-[12px] p-3 text-center">
                  <p className="text-[#B24545] text-[14px] font-medium">
                    {getErrorMessage(loginMutation.error)}
                  </p>
                </div>
              )}

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                  id="login"
                  icon={<MdOutlineEmail size={16} />}
                  name="login"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loginMutation.isPending}
                />
                <div className="flex flex-col gap-3">
                  <Input
                    id="password"
                    name="password"
                    icon={<MdOutlineVpnKey size={16} />}
                    placeholder="Пароль"
                    showPasswordToggle={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={loginMutation.isPending}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-[#739C9C] text-[14px] sm:text-[15px] font-semibold lg:text-[16px] leading-[100%] hover:underline focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        // Handle forgot password logic
                        console.log("Forgot password clicked");
                      }}
                      disabled={loginMutation.isPending}
                    >
                      Забули пароль?
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-4 sm:mt-6 w-full"
                  disabled={!email || !password || loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Вхід..." : "Увійти"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="max-w-[692px] w-full h-[200px] sm:h-[250px] lg:h-full order-1 lg:order-2">
          <img
            src={bannerImg}
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
