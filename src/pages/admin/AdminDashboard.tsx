import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, LogOut, Edit, Trash2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Exam } from "@/types/exam";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "exams"));
      const examsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Exam[];
      setExams(examsData);
    } catch (error) {
      toast.error("Failed to fetch exams");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("adminInfo");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await deleteDoc(doc(db, "exams", examId));
      toast.success("Exam deleted successfully");
      fetchExams();
    } catch (error) {
      toast.error("Failed to delete exam");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your examinations</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/admin/create-exam")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="neo-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>
                      {exam.stream} • Year {exam.year} • Duration:{" "}
                      {exam.duration} minutes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/edit-exam/${exam.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Questions</Label>
                    <p className="text-lg font-semibold">
                      {exam.questions.length}
                    </p>
                  </div>
                  <div>
                    <Label>Total Marks</Label>
                    <p className="text-lg font-semibold">{exam.totalMarks}</p>
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <p className="text-lg font-semibold">
                      {new Date(exam.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <p className="text-lg font-semibold">
                      {new Date(exam.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
