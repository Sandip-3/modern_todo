import { getActivity } from "@/apis/activity.api";
import { useUser } from "@/context/userContext";
import { ActivityProps } from "@/types/type";
import { useEffect, useState } from "react";

const Activity = () => {
  const { user } = useUser();
  const [activity, setActivity] = useState<ActivityProps[]>([]);
  useEffect(() => {
    try {
      getActivity(user._id).then((response) => {
        const data = response.data.data;
        setActivity(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [setActivity]);
  console.log(activity);
  return (
    <>
      <div className="text-center text-xl overflow-y-auto font-serif mb-4">Recent Activities</div>
      {activity.length === 0 ? (
        <p className="text-center text-md font-serif">No recent activity</p>
      ) : (
        activity.map((activit) => (
          <div className="activity_container border border-slate-200 p-4 rounded-md overflow-y-auto">
            <div className="flex  items-center gap-2 mb-2 justify-between">
              <div className="flex flex-col text-sm gap-1">
                <p>Avtions:</p>
                <p className="text-xs uppercase">{activit.action} </p>
              </div>
              <div className="flex flex-col items-center text-sm gap-1 ">
                <p>Performer:</p>
                <p className="text-xs">{activit.userName}</p>
              </div>
            </div>
            <div className="flex mt-8 items-center justify-between">
              <div className="flex flex-col text-sm gap-1">
                <p>Task Name:</p>
                <p className="text-xs">{activit.task}</p>
              </div>
              <div className="flex flex-col gap-1 ">
                <p className="text-sm items-center">Updated Date:</p>
                <p className="text-xs  text-orange-500">
                  {new Date(activit.createdAt).toLocaleString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Activity;
