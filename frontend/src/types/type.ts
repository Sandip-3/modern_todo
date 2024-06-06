export interface UserLogin {
  email: string;
  password: string;
}

export interface UserInfo {
  userName: string;
  _id: string;
  emial: string;
}

export interface TabItemProps {
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  numbers: number;
  onClick: () => void;
}

interface Comment {
  _id? : string
  content: string;
  userId?: string;
  userName?: string;
  createdAt?: string;
};

export interface TaskInfo {
  _id?: string;
  title: string;
  status: string;
  priority: string;
  asigner?: string;
  tags?: [];
  description?: string;
  dueDate: Date;
  asignee?: [];
  comments?: Comment[];
  asigneeId?: string;
  deleted?: boolean;
}

export interface TaskProps {
  title: string;
  asigner?: string | null;
  description: string;
  dueDate: Date;
  status?: "asigned" | "in pending" | "completed" | undefined;
  priority?: "low" | "medium" | "high" | undefined;
}

export interface ActivityProps {
  userName: string;
  action: string;
  task: string;
  asignee: string[];
  createdAt: Date;
}
