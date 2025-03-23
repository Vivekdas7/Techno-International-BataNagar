import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Exam, ExamResult } from "@/types/exam";
import { useAuth } from "@/hooks/useAuth";

const Exam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const [tabChangeCount, setTabChangeCount] = useState(0);

  // Check authentication state
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to take the exam");
      navigate("/login");
      return;
    }
  }, [user, authLoading, navigate]);

  // Tab change warning effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && exam) {
        setTabChangeCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            toast.error(
              "You have switched tabs 3 times. Your exam will be auto-submitted."
            );
            if (exam && user) {
              handleSubmit(true);
            }
            return 3;
          } else {
            toast.warning(
              `Warning ${newCount}/3: Switching tabs during the exam is not allowed.`
            );
            return newCount;
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [exam, user]);

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) {
        toast.error("Invalid exam ID");
        navigate("/exams");
        return;
      }

      try {
        const examRef = doc(db, "exams", examId);
        const examDoc = await getDoc(examRef);

        if (!examDoc.exists()) {
          toast.error("Exam not found");
          navigate("/exams");
          return;
        }

        const examData = examDoc.data() as Exam;
        const now = new Date();
        const startTime = new Date(examData.startTime);
        const endTime = new Date(examData.endTime);

        // Check if exam is currently active
        if (now < startTime) {
          toast.error("Exam has not started yet");
          navigate("/exams");
          return;
        }

        if (now > endTime) {
          toast.error("Exam has ended");
          navigate("/exams");
          return;
        }

        setExam(examData);
        setTimeLeft(examData.duration * 60); // Convert minutes to seconds
      } catch (error) {
        console.error("Error fetching exam:", error);
        toast.error("Failed to load exam");
        navigate("/exams");
      }
    };

    if (!authLoading && user) {
      fetchExam();
    }
  }, [examId, navigate, authLoading, user]);

  // Timer effect for auto-submission
  useEffect(() => {
    if (!timeLeft || isAutoSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // true indicates auto-submission
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAutoSubmitted]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (isAutoSubmit: boolean = false) => {
    console.log("Submit attempt:", {
      hasExam: !!exam,
      hasUser: !!user,
      isAutoSubmit,
      examId: exam?.id,
      userId: user?.uid,
    });

    if (!exam || !user) {
      console.error("Missing exam or user data", {
        exam: !!exam,
        user: !!user,
        examId: exam?.id,
        userId: user?.uid,
      });
      toast.error("Cannot submit exam: Missing required data");
      return;
    }

    if (isSubmitting || isAutoSubmitted) return;

    setIsSubmitting(true);
    try {
      // Get student info from localStorage
      const studentInfoStr = localStorage.getItem("studentInfo");
      if (!studentInfoStr) {
        console.error("No student info found in localStorage");
        toast.error("Cannot submit exam: Student information not found");
        return;
      }

      const studentInfo = JSON.parse(studentInfoStr);
      console.log("Student info:", studentInfo);

      // Calculate score
      let correctAnswers = 0;
      exam.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      // Create the result object with valid data types
      const result = {
        examId: examId || "",
        studentId: user.uid || "",
        studentName: studentInfo.name || "Unknown",
        studentRoll: studentInfo.rollNumber || "Unknown",
        studentStream: studentInfo.stream || "Unknown",
        studentYear: studentInfo.year || "Unknown",
        answers: answers || {},
        score: correctAnswers || 0,
        totalQuestions: exam.questions.length || 0,
        totalMarks: exam.totalMarks || 0,
        timeTaken: exam.duration * 60 - timeLeft || 0,
        submittedAt: new Date().toISOString(),
        percentage: (correctAnswers / exam.questions.length) * 100 || 0,
        isAutoSubmitted: isAutoSubmit || false,
      };

      // Log the data being submitted
      console.log("Submitting exam result:", {
        examId: result.examId,
        studentId: result.studentId,
        studentRoll: result.studentRoll,
        ...result,
      });

      // Save result to Firebase
      const examResultsRef = collection(db, "examResults");
      const docRef = await addDoc(examResultsRef, result);
      console.log("Exam result saved with ID:", docRef.id);

      setIsAutoSubmitted(isAutoSubmit);
      if (!isAutoSubmit) {
        toast.success("Exam submitted successfully!");
      } else {
        toast.info("Exam auto-submitted due to tab switching");
      }
      navigate("/results");
    } catch (error: any) {
      console.error("Detailed error submitting exam:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      let errorMessage = "Failed to submit exam. Please try again.";
      if (error.code === "permission-denied") {
        errorMessage = "You don't have permission to submit this exam.";
      } else if (error.code === "unavailable") {
        errorMessage =
          "Service is temporarily unavailable. Please try again later.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading state while exam is being fetched
  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              Time Left: {minutesLeft}:{secondsLeft.toString().padStart(2, "0")}
            </p>
            <p className="text-sm text-muted-foreground">
              {exam.duration} minutes total
            </p>
          </div>
        </div>

        <Card className="neo-card">
          <CardContent className="pt-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {currentQuestion.question}
              </h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      answers[currentQuestionIndex] === index
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start text-left"
                    onClick={() =>
                      handleAnswerSelect(currentQuestionIndex, index)
                    }
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              {currentQuestionIndex === exam.questions.length - 1 ? (
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Exam;
