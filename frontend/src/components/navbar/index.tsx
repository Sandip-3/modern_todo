import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/userContext";
import { FaAngleDown } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "sonner";
import {
  Close,
  Dialog,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { getUser, updateUser } from "@/apis/user.api";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [updateUserName, setUpdateUserName] = useState<string>("");
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.success("Logout Success");
    navigate("/login");
  };
  const handleCLick = () => {
    setShowMenu(!showMenu);
  };

  const handleUpdateUser = async () => {
    try {
      console.log(updateUserName);
      await updateUser(user._id, updateUserName);
      toast.success("Updated Username");
      await getUser(user?._id).then((response) => {
        const data = response.data.data;
        console.log(data);
        localStorage.removeItem("userData");
        localStorage.setItem("userData", JSON.stringify(data));
        setUser(data);
      });
    } catch (error) {
      toast.error("Update Username Error");
    }
  };

  useEffect(() => {
    setShowMenu(false);
    setUpdateUserName(user?.userName);
  }, [user]);

  return (
    <div className="navbar w-screen bg-slate-100 shadow-md sticky top-0 z-50">
      <div className="w-[80%] mx-auto p-3 flex justify-between items-center">
        <div className="logo w-[2em] flex gap-4 cursor-pointer">
          <img
            src="https://cdn-icons-png.flaticon.com/128/14680/14680399.png"
            alt="logo"
          />
          <p className="app_name text-xl md:text-2xl text-slate-400">DO_DO</p>
        </div>
        <div className="register flex gap-4 items-center">
          {user ? (
            <>
              <div
                className={`flex items-center cursor-pointer hover:text-black  ${
                  showMenu ? "  underline" : " text-black"
                }`}
                onClick={handleCLick}
              >
                <p
                  className={`px-2 py-1 font-serif text-center text-xl md:text-2xl`}
                >
                  {user.userName}
                </p>
                <FaAngleDown />
              </div>
              {showMenu ? (
                <div className="absolute bg-slate-200 active:text-black top-16 z-10 w-[183px] border rounded-md border-slate-200">
                  <button
                    className="w-[182px] hover:bg-slate-100 border-b text-center font-serif font-semibold h-10 bg-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <Dialog>
                    <DialogTrigger>
                      <button className="w-[182px] border-b text-center hover:bg-slate-100  font-serif font-semibold h-10 bg-white">
                        Account
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-center font-serif">
                        Update Username
                      </DialogTitle>
                      <div className="flex items-center gap-4">
                        <Input
                          variant="signup"
                          value={updateUserName}
                          onChange={(e) => {
                            setUpdateUserName(e.target.value);
                          }}
                        />
                        <Close>
                          <IoSend
                            size={20}
                            className="text-purple-500"
                            onClick={handleUpdateUser}
                          />
                        </Close>
                      </div>
                    </DialogContent>
                  </Dialog>
                 
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <Link
                to={"/"}
                className="hidden sm:block px-4 py-1 text-center w-[8em] bg-purple-500 rounded-md text-white hover:bg-opacity-90"
              >
                Register
              </Link>
              <Link
                to={"/login"}
                className="px-4 hidden sm:block text-center py-1 w-[8em] bg-purple-500 rounded-md text-white hover:bg-opacity-90"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
