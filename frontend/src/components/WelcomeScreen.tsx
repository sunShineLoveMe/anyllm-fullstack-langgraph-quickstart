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
  <div className="flex flex-col items-center justify-center text-center px-2 flex-1 w-full max-w-full mx-auto gap-4 relative h-full">
    <div>
      <h1 className="text-4xl md:text-6xl font-semibold text-neutral-100 mb-3">
      CloudThink
      </h1>
      <p className="text-lg md:text-2xl text-neutral-400">
      云思 · 下一代AI深度搜索引擎
      </p>
    </div>
    <div className="w-full mt-4 flex justify-center">
      <div className="w-full max-w-xl">
        <InputForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onCancel}
          hasHistory={false}
        />
      </div>
    </div>
    <p className="hidden sm:block text-xs text-neutral-500">
      Powered by DeepSeek and LangChain LangGraph.
    </p>
    
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-neutral-500 text-center w-full flex flex-col items-center justify-center">
      <a 
        href="http://zhiyunllm.tech/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-neutral-400 transition-colors"
      >
        <span>栉云科技提供技术支持</span><br />
        <span className="text-[10px]">Technical Support by ZhiYun Tech</span>
      </a>
    </div>
  </div>
);
