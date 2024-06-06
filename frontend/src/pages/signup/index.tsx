import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import SignupAnimation from "../../assets/Lottie/Signup.json";
import { registerUser } from "@/apis/user.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";


const formSchema = z.object({
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const SignUp = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await registerUser(values);
      toast.success("Registration Successful Enter OTP to Proceed"); 
      navigate("/verify");
    } catch (error : any) {
      const errorMessage =  error.response?.data?.message || "An error occurred";
      toast.error(errorMessage); 
    }
  };

  return (
    <div className="w-screen h-[90vh] p-4  flex flex-col md:flex-row  md:items-center md:justify-center" >
        <div className="max-w-md flex-shrink-0 md:w-3/4">
          <Lottie animationData={SignupAnimation} loop autoplay />
        </div>
        <div className="signup_form width-full md:w-1/4">
          <Form {...form}>
            <p className="text-3xl font-serif text-center">Signup</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        variant="signup"
                        placeholder="Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input variant="signup" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        variant="signup"
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant={"signup"} type="submit">
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
    </div>
  );
};

export default SignUp;
