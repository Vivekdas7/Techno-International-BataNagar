import { useEffect, useState } from "react";
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
import { ExamResult } from "@/types/exam";
import { useAuth } from "@/hooks/useAuth";

const Results = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      // Log authentication state
      console.log("Auth state:", { user, authLoading });

      if (authLoading) {
        console.log("Auth is still loading...");
        return;
      }

      if (!user) {
        console.log("No user found, redirecting to login");
        toast.error("Please login to view results");
        navigate("/login");
        return;
      }

      try {
        // Get student info from localStorage
        const studentInfoStr = localStorage.getItem("studentInfo");
        if (!studentInfoStr) {
          console.error("No student info found in localStorage");
          toast.error("Student information not found. Please register first.");
          navigate("/register");
          return;
        }

        const studentInfo = JSON.parse(studentInfoStr);
        console.log("Fetching results for student:", studentInfo);

        // Query results for this student
        const resultsRef = collection(db, "examResults");
        const q = query(
          resultsRef,
          where("studentRoll", "==", studentInfo.rollNumber)
        );

        const querySnapshot = await getDocs(q);
        const resultsData: ExamResult[] = [];

        querySnapshot.forEach((doc) => {
          resultsData.push({ id: doc.id, ...doc.data() } as ExamResult);
        });

        console.log("Fetched results:", resultsData);
        setResults(resultsData);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="neo-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">No Results Found</h2>
                <p className="text-muted-foreground">
                  You haven't taken any exams yet. Start by taking an exam!
                </p>
                <Button onClick={() => navigate("/exams")}>
                  View Available Exams
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Exam Results</h1>
        <div className="space-y-6">
          {results.map((result) => (
            <Card key={result.id} className="neo-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Exam Result</CardTitle>
                    <CardDescription>
                      Submitted on:{" "}
                      {new Date(result.submittedAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {result.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Score: {result.score}/{result.totalQuestions}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Student Name
                      </p>
                      <p className="font-medium">{result.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Roll Number
                      </p>
                      <p className="font-medium">{result.studentRoll}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stream</p>
                      <p className="font-medium">{result.studentStream}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium">{result.studentYear}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Time Taken
                    </p>
                    <p className="font-medium">
                      {Math.floor(result.timeTaken / 60)} minutes{" "}
                      {result.timeTaken % 60} seconds
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Submission Type
                    </p>
                    <p className="font-medium">
                      {result.isAutoSubmitted
                        ? "Auto-submitted"
                        : "Manually submitted"}
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

export default Results;
