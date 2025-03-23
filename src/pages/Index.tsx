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
import { ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-4xl w-full mx-auto">
        <div className="space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Educational Assessment Platform
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            ExamHub
          </h1>
          <p
            className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            A modern examination platform designed for seamless testing
            experiences
          </p>
        </div>

        <div
          className="grid md:grid-cols-2 gap-8 mb-12 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Card className="neo-card">
            <CardHeader>
              <CardTitle>Student Portal</CardTitle>
              <CardDescription>Access your examinations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Login or register to take your exams and view results.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate("/login")}
                className="w-full group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Student Login
                <ChevronRight
                  className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                    isHovering ? "translate-x-1" : ""
                  }`}
                />
              </Button>
            </CardFooter>
          </Card>

          <Card className="neo-card">
            <CardHeader>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>Manage examinations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and manage exams, view results, and track student
                performance.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/login")}
                className="w-full"
              >
                Admin Login
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div
          className="text-center animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-sm text-muted-foreground">
            ExamHub — Designed for simplicity and effectiveness
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
