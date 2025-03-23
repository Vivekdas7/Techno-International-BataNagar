import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Question } from "@/types/exam";

const CreateExam = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    totalMarks: 100,
    stream: "",
    year: 1,
    startTime: "",
    endTime: "",
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      marks: 1,
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (
    questionId: number,
    field: keyof Question,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (questionId: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const validateForm = () => {
    if (!formData.title) {
      toast.error("Please enter exam title");
      return false;
    }
    if (!formData.stream) {
      toast.error("Please enter stream");
      return false;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error("Please set exam start and end times");
      return false;
    }
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error("End time must be after start time");
      return false;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return false;
    }
    for (const q of questions) {
      if (!q.question) {
        toast.error("Please enter all questions");
        return false;
      }
      if (q.options.some((opt) => !opt)) {
        toast.error("Please fill all options for each question");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const examData = {
        ...formData,
        questions,
        createdAt: new Date().toISOString(),
        createdBy: JSON.parse(localStorage.getItem("adminInfo") || "{}").uid,
      };

      await addDoc(collection(db, "exams"), examData);
      toast.success("Exam created successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Failed to create exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Exam</h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new examination
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="neo-card">
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter exam title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter exam description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream">Stream</Label>
                <Input
                  id="stream"
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  placeholder="Enter stream (e.g., CSE, ECE)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Enter year"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  name="totalMarks"
                  type="number"
                  min="1"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  placeholder="Enter total marks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="neo-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Questions</CardTitle>
                <Button type="button" variant="outline" onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">Question {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Input
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          question.id,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="Enter question"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              question.id,
                              optIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${optIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant={
                            question.correctAnswer === optIndex
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleQuestionChange(
                              question.id,
                              "correctAnswer",
                              optIndex
                            )
                          }
                        >
                          Correct
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Marks</Label>
                    <Input
                      type="number"
                      min="1"
                      value={question.marks}
                      onChange={(e) =>
                        handleQuestionChange(
                          question.id,
                          "marks",
                          parseInt(e.target.value)
                        )
                      }
                      placeholder="Enter marks"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Exam"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
