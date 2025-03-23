
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Option {
  id: string;
  text: string;
}

interface QuestionProps {
  id: number;
  text: string;
  options: Option[];
  onAnswer: (questionId: number, answerId: string) => void;
  selectedAnswer?: string;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  totalQuestions: number;
}

const QuestionCard = ({
  id,
  text,
  options,
  onAnswer,
  selectedAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  totalQuestions,
}: QuestionProps) => {
  const [selected, setSelected] = useState<string | undefined>(selectedAnswer);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setSelected(selectedAnswer);
  }, [selectedAnswer]);

  const handleOptionChange = (value: string) => {
    setSelected(value);
    onAnswer(id, value);
  };

  const handleNavigation = (direction: "next" | "prev") => {
    setIsAnimating(true);
    setTimeout(() => {
      if (direction === "next") {
        onNext();
      } else {
        onPrevious();
      }
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card className={`neo-card w-full max-w-2xl transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            Question {id} of {totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">
            Select one answer
          </div>
        </div>
        <CardTitle className="text-xl font-medium leading-tight">{text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selected} onValueChange={handleOptionChange} className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-secondary/50">
              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
              <Label htmlFor={option.id} className="cursor-pointer flex-1 text-base font-normal leading-relaxed">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        <Button
          variant="outline"
          onClick={() => handleNavigation("prev")}
          disabled={isFirst}
          className="space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        <Button
          onClick={() => handleNavigation("next")}
          disabled={isLast}
          className="space-x-2"
        >
          <span>{isLast ? "Finish" : "Next"}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
