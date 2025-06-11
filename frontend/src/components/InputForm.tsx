import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Brain, Send, StopCircle, Cpu } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (inputValue: string, effort: string, model: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
}) => {
  const [internalInputValue, setInternalInputValue] = useState("");
  const [effort, setEffort] = useState("medium");
  const [model, setModel] = useState("deepseek-chat");

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim()) return;
    onSubmit(internalInputValue, effort, model);
    setInternalInputValue("");
  };

  const handleInternalKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const isSubmitDisabled = !internalInputValue.trim() || isLoading;

  return (
    <form
      onSubmit={handleInternalSubmit}
      className={`flex flex-col gap-2 p-2 w-full`}
    >
      <div
        className={`flex flex-row items-center justify-between text-white rounded-3xl ${
          hasHistory ? "rounded-br-sm" : ""
        } break-words min-h-7 bg-neutral-700 px-2 sm:px-3 pt-1 sm:pt-2 w-full`}
      >
        <Textarea
          value={internalInputValue}
          onChange={(e) => setInternalInputValue(e.target.value)}
          onKeyDown={handleInternalKeyDown}
          placeholder="输入您的问题..."
          style={{ fontSize: '13px' }}
          className={`w-full text-neutral-100 placeholder-neutral-500 resize-none border-0 focus:outline-none focus:ring-0 outline-none focus-visible:ring-0 shadow-none 
                        text-sm md:text-base min-h-[40px] sm:min-h-[56px] max-h-[200px]`}
          rows={1}
        />
        <div className="-mt-2 sm:-mt-3">
          {isLoading ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1 sm:p-2 cursor-pointer rounded-full transition-all duration-200"
              onClick={onCancel}
            >
              <StopCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className={`${
                isSubmitDisabled
                  ? "text-neutral-500"
                  : "text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
              } p-1 sm:p-2 cursor-pointer rounded-full transition-all duration-200 text-sm sm:text-base`}
              disabled={isSubmitDisabled}
            >
              Search
              <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex flex-row justify-center gap-2">
          <div className="flex flex-row gap-1 bg-neutral-700 border-neutral-600 text-neutral-300 focus:ring-neutral-500 rounded-xl pl-2">
            <div className="flex flex-row items-center text-xs sm:text-sm">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Effort
            </div>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-[80px] sm:w-[120px] md:w-[150px] bg-transparent border-none cursor-pointer text-xs sm:text-sm">
                <SelectValue placeholder="Effort" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer">
                <SelectItem
                  value="low"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="high"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-1 bg-neutral-700 border-neutral-600 text-neutral-300 focus:ring-neutral-500 rounded-xl pl-2">
            <div className="flex flex-row items-center text-xs sm:text-sm ml-1 sm:ml-2">
              <Cpu className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Model
            </div>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[100px] sm:w-[150px] md:w-[180px] bg-transparent border-none cursor-pointer text-xs sm:text-sm">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer">
                <SelectItem
                  value="deepseek-chat"
                  className="hover:bg-neutral-600 focus:bg-neutral-600 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-purple-400" /> deepseek-chat
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasHistory && (
          <div className="flex justify-center mt-2 w-full">
            <Button
              className="bg-neutral-700 border-neutral-600 text-neutral-300 cursor-pointer rounded-xl pl-2 text-xs sm:text-sm"
              variant="default"
              onClick={() => window.location.reload()}
            >
              <SquarePen size={14} className="mr-1 sm:mr-2" />
              New Search
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};
