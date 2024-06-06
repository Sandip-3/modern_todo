import { useForm } from "react-hook-form";
import Lottie from "lottie-react";
import SignupAnimation from "../../assets/Lottie/Signup.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/apis/user.api";
import { useUser } from "@/context/userContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { UserLogin } from "@/types/type";

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser(userData);
      navigate("/home");
    }
  }, []);

  const onSubmit = async (values: UserLogin) => {
    await loginUser(values)
      .then((response) => {
        const data = response.data;
        localStorage.setItem("userData", JSON.stringify(data.data.userInfo));
        localStorage.setItem("accessToken", JSON.stringify(data.data.accessToken))
        console.log(data.data.accessToken);
        setUser(data.data.userInfo);
        // console.log(data.data.userInfo);
        const message = response?.data.message;
        toast.success(message);
        navigate("/home");
      })
      .catch((error) => {
        const data = error.response?.data;
        toast.error(data.message);
      });
  };

  return (
    <div className="w-screen h-[90vh] p-4  flex flex-col md:flex-row  md:items-center md:justify-center">
      <div className="max-w-md flex-shrink-0 md:w-3/4">
        <Lottie animationData={SignupAnimation} loop autoplay />
      </div>
      <div className="signup_form width-full md:w-1/4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <p className="text-3xl font-serif text-center">Login</p>
          <div className="space-y-6">
            <div>
              <label className="block mb-1">Email</label>
              <Input
                variant="signup"
                placeholder="Email"
                {...form.register("email")}
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <Input
                variant="signup"
                placeholder="Password"
                type="password"
                {...form.register("password")}
              />
            </div>
          </div>
          <Button variant="signup" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
