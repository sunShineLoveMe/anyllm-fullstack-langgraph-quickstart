# AnyLLM Fullstack LangGraph Quickstart

<div align="center">
  <p>
    <strong>基于LangGraph的本地大模型智能搜索助手</strong><br>
    <small>由<a href="http://zhiyunllm.tech/" target="_blank">上海栉云科技有限公司</a>提供技术支持</small>
  </p>
</div>

## 📖 项目简介

本项目基于[google-gemini/gemini-fullstack-langgraph-quickstart](https://github.com/google-gemini/gemini-fullstack-langgraph-quickstart)开发，是一个完整的智能搜索助手，使用LangGraph构建高级推理流程，可以执行网络搜索和智能回答用户查询。

### 核心功能

- 🔍 **智能搜索**：使用Google Search API或模拟搜索结果进行网络信息检索
- 🧠 **本地模型支持**：集成DeepSeek Chat模型，使用OpenAI兼容接口
- 📈 **可调节搜索深度**：根据用户需求支持低、中、高三种搜索努力程度
- 💻 **完整前后端**：包含React前端和Python后端

### 主要改进

1. **模型替换**：使用DeepSeek Chat模型，并将Gemini的API接口转换为OpenAI格式接口
2. **搜索实现**：使用Google Search API进行搜索，并提供无API时的模拟搜索功能
3. **开发便利性**：移除Docker相关配置，便于本地开发调试
4. **前端优化**：更新UI以反映DeepSeek模型

## 🌟 应用场景

本项目适用于多种场景，为用户提供智能化的信息获取和问答体验：

### 教育与研究

- **学术研究辅助**：快速检索和汇总相关学术资料
- **学习辅导**：回答学生问题，提供详细解释和相关资源
- **知识探索**：深入了解特定领域知识，获取最新研究进展

### 商业应用

- **市场分析**：搜集和分析产品、竞争对手、市场趋势信息
- **客户支持**：为用户提供智能化的产品问答和技术支持
- **内容创作**：辅助内容创作者进行信息收集和内容整理

### 个人助理

- **日常问答**：回答用户日常生活中的各类问题
- **信息聚合**：汇总多渠道信息，提供全面视角
- **决策辅助**：为用户决策提供相关信息和建议

### 企业内部应用

- **知识库查询**：与企业内部知识库集成，提供精准问答
- **数据分析**：基于公开数据进行简单分析和解读
- **培训工具**：作为员工培训和学习的辅助工具

## 🚀 安装与使用

### 系统要求

- Python 3.11+
- Node.js

### 本地开发环境

#### 步骤 1：克隆仓库

```bash
git clone https://github.com/yourusername/anyllm-fullstack-langgraph-quickstart.git
cd anyllm-fullstack-langgraph-quickstart
```

#### 步骤 2：后端配置

1. 配置环境变量
   ```bash
   cd backend
   cp .env.example .env
   ```

2. 在`.env`文件中设置以下参数：
   - `OPENAI_API_BASE_URL`：DeepSeek API的URL
   - `OPENAI_API_KEY`：API密钥（本地服务可随意设置）
   - `GOOGLE_API_KEY`（可选）：Google搜索API密钥
   - `GOOGLE_CSE_ID`（可选）：Google自定义搜索引擎ID
   - `LANGSMITH_API_KEY`（可选）：LangSmith API密钥

3. 安装后端依赖
   ```bash
   pip install .
   ```

#### 步骤 3：前端配置

1. 安装前端依赖
   ```bash
   cd ../frontend
   npm install
   ```

2. 构建前端（可选）
   ```bash
   npm run build
   ```

#### 步骤 4：启动应用

1. 返回项目根目录并启动应用
   ```bash
   cd ..
   make dev
   ```

2. 在浏览器中访问：`http://localhost:5173/app/`

### Docker部署

本项目支持Docker部署，方便在生产环境或云服务上运行。

#### 快速部署

1. 配置环境变量
   ```bash
   cp .env.docker .env
   # 编辑.env文件设置API配置
   ```

2. 构建和启动Docker容器
   ```bash
   docker-compose up -d --build
   ```

3. 访问应用：`http://localhost:5173/app/`

更多关于Docker和阿里云部署的详细信息，请参考以下文档：
- [Docker快速部署指南](docker-quickstart.md)
- [阿里云详细部署指南](deploy-guide.md)

## 🔧 配置说明

### Google Search API（可选）

如果需要真实的搜索功能，您需要配置Google Search API：

1. 获取API密钥：[Google API Key](https://developers.google.com/custom-search/v1/introduction?hl=zh-cn#identify_your_application_to_google_with_api_key)
2. 获取CSE ID：[Custom Search Engine ID](https://stackoverflow.com/questions/6562125/getting-a-cx-id-for-custom-search-google-api-python)

### LangSmith（可选）

LangSmith可用于跟踪和监控LangGraph的执行：

1. 访问[LangSmith官网](https://smith.langchain.com/)获取API密钥
2. 在`.env`文件中设置`LANGSMITH_API_KEY`

## 📊 使用说明

1. 在首页输入您的查询问题
2. 选择搜索努力程度（低/中/高）
   - 低：最多1次搜索查询，1个搜索循环
   - 中：最多3次搜索查询，3个搜索循环
   - 高：最多5次搜索查询，10个搜索循环
3. 系统会执行以下步骤：
   - 生成搜索查询
   - 执行网络搜索（或使用模拟数据）
   - 反思是否需要更多信息
   - 生成最终答案

## 📝 开发说明

### 项目结构

```
.
├── backend/            # Python后端
│   ├── src/            # 源代码
│   ├── .env.example    # 环境变量示例
│   └── pyproject.toml  # 项目依赖
├── frontend/           # React前端
│   ├── src/            # 源代码
│   └── package.json    # 前端依赖
├── Dockerfile          # Docker构建文件
├── docker-compose.yml  # Docker Compose配置
└── Makefile            # 开发命令
```

### 本地开发

- 后端修改：编辑`backend/src/agent/`下的文件
- 前端修改：编辑`frontend/src/`下的文件
- 启动开发服务器：使用`make dev`命令

## 👥 技术支持

本项目由[上海栉云科技有限公司](http://zhiyunllm.tech/)提供技术支持。如有技术问题或合作需求，请访问官方网站获取更多信息。

上海栉云科技专注于人工智能应用开发，提供包括智能客服、数据分析、智能助手和定制开发等多种解决方案，助力企业数字化转型。

## 📄 许可证

本项目采用MIT许可证。详情请查看LICENSE文件。


