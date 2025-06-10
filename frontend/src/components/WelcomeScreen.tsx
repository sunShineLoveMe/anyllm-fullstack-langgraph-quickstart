import { InputForm } from "./InputForm";

interface WelcomeScreenProps {
  handleSubmit: (
    submittedInputValue: string,
    effort: string,
    model: string
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  handleSubmit,
  onCancel,
  isLoading,
}) => (
  <div className="flex flex-col items-center justify-center text-center px-4 flex-1 w-full max-w-3xl mx-auto gap-4 relative h-full">
    <div>
      <h1 className="text-5xl md:text-6xl font-semibold text-neutral-100 mb-3">
        Welcome.
      </h1>
      <p className="text-xl md:text-2xl text-neutral-400">
        How can I help you today?
      </p>
    </div>
    <div className="w-full mt-4">
      <InputForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={onCancel}
        hasHistory={false}
      />
    </div>
    <p className="text-xs text-neutral-500">
      Powered by DeepSeek and LangChain LangGraph.
    </p>
    
    <div className="absolute bottom-4 right-4 text-xs text-neutral-500 text-right">
      <a 
        href="http://zhiyunllm.tech/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-neutral-400 transition-colors"
      >
        栉云科技提供技术支持<br />
        <span className="text-[10px]">Technical Support by ZhiYun Tech</span>
      </a>
    </div>
  </div>
);
