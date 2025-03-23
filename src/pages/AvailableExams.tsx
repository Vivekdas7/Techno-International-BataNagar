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
import { toast } from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Exam } from "@/types/exam";

const AvailableExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        // Get student info from localStorage
        const studentInfo = JSON.parse(
          localStorage.getItem("studentInfo") || "{}"
        );
        console.log("Student Info:", studentInfo); // Debug log

        if (!studentInfo.stream || !studentInfo.year) {
          toast.error("Please complete your registration first");
          navigate("/register");
          return;
        }

        // Create query for exams matching student's stream and year
        const examsRef = collection(db, "exams");
        // First, try without filters to see all exams
        const q = query(examsRef);
        // If that works, then try with filters:
        // const q = query(
        //   examsRef,
        //   where("stream", "==", studentInfo.stream),
        //   where("year", "==", studentInfo.year)
        // );

        console.log("Query parameters:", {
          stream: studentInfo.stream,
          year: studentInfo.year,
        }); // Debug log

        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size); // Debug log

        const now = new Date();
        console.log("Current time:", now.toISOString()); // Debug log

        // Filter and map exams
        const availableExams = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            console.log("Raw exam data:", data); // Debug log

            // Convert date strings to Date objects
            const startTime = new Date(data.startTime);
            const endTime = new Date(data.endTime);

            const exam = {
              id: doc.id,
              ...data,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            };

            console.log("Processed exam:", exam); // Debug log
            return exam;
          })
          .filter((exam) => {
            const startTime = new Date(exam.startTime);
            const endTime = new Date(exam.endTime);
            const isAvailable = now >= startTime && now <= endTime;
            console.log("Exam availability check:", {
              examId: exam.id,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              isAvailable,
            }); // Debug log
            return isAvailable;
          }) as Exam[];

        console.log("Final available exams:", availableExams); // Debug log
        setExams(availableExams);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("Failed to load available exams");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md neo-card">
          <CardHeader>
            <CardTitle>No Available Exams</CardTitle>
            <CardDescription>
              There are currently no exams available for your stream and year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please check back later or contact your administrator if you
              believe this is an error.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Available Exams</h1>
          <p className="text-muted-foreground">Select an exam to begin</p>
        </div>

        <div className="grid gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="neo-card">
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>
                  {exam.stream} • Year {exam.year} • Duration: {exam.duration}{" "}
                  minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Questions
                    </p>
                    <p className="text-lg font-semibold">
                      {exam.questions.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Marks</p>
                    <p className="text-lg font-semibold">{exam.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="text-lg font-semibold">
                      {new Date(exam.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Time</p>
                    <p className="text-lg font-semibold">
                      {new Date(exam.endTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <Button
                  onClick={() => navigate(`/exam/${exam.id}`)}
                  className="w-full"
                >
                  Start Exam
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableExams;
