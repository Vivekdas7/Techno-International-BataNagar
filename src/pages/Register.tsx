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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, user, signIn, logout } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    year: "",
    stream: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, year: value }));
  };

  const handleStreamChange = (value: string) => {
    setFormData((prev) => ({ ...prev, stream: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.rollNumber.trim()) {
      toast.error("Please enter your roll number");
      return;
    }

    if (!formData.year) {
      toast.error("Please select your year");
      return;
    }

    if (!formData.stream) {
      toast.error("Please select your stream");
      return;
    }

    if (!formData.email) {
      toast.error("Please enter your college email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user account
      const userCredential = await signUp(formData.email, formData.password);

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.uid), {
        name: formData.name,
        rollNumber: formData.rollNumber,
        email: formData.email,
        year: formData.year,
        stream: formData.stream,
        createdAt: new Date().toISOString(),
      });

      // Store student info in localStorage for exam access
      localStorage.setItem(
        "studentInfo",
        JSON.stringify({
          name: formData.name,
          rollNumber: formData.rollNumber,
          email: formData.email,
          year: formData.year,
          stream: formData.stream,
        })
      );

      toast.success("Registration successful!");
      navigate("/exams");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <Card className="w-full max-w-md neo-card animate-fade-up">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="mr-2 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Student Registration
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Register for Exam
          </CardTitle>
          <CardDescription>
            Enter your details to access the examination platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                placeholder="Enter your roll number"
                value={formData.rollNumber}
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your College Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your college email"
                value={formData.email}
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select onValueChange={handleYearChange} value={formData.year}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Stream</Label>
              <Select
                onValueChange={handleStreamChange}
                value={formData.stream}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">CSE</SelectItem>
                  <SelectItem value="2">ECE</SelectItem>
                  <SelectItem value="3">ME</SelectItem>
                  <SelectItem value="4">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register & Start Exam"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
