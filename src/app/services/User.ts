interface User {
  user_id: string;
  email: string;
  firstname: string;
  middlename: string | null;
  lastname: string;
  phone_number: string | null;
  sex: string;
  avatar: string | null;
  role: string;
}
export interface Student extends User {
  student_id: string;
  course: string;
  block: string;
  year: string;
}
export interface Instructor extends User {
  instructor_id: string;
  department: string;
  position: string;
}
export interface Admin extends User {
  admin_id: string;
  department: string;
  position: string;
}
