# AnyLLM · LangGraph 搜索研究助手
**Query → Search → Reflect → Answer**

把一个问题拆成搜索查询，收集片段，再通过反思节点决定是否继续检索，最后生成回答。前端展示查询、检索、反思和回答的过程，而不只是一个聊天输入框。

本项目基于 [Google Gemini Fullstack LangGraph Quickstart](https://github.com/google-gemini/gemini-fullstack-langgraph-quickstart) 改造，将核心调用切换为 OpenAI 兼容接口，当前默认使用 deepseek-chat。适合学习 LangGraph 编排和研究型 Agent 的前后端连接。

[快速开始](#快速开始) · [搜索模式](#搜索模式) · [架构](#架构) · [当前边界](#当前边界)

## 能做什么

- 根据问题生成多个搜索查询，并行进入检索节点。
- 通过反思节点识别信息缺口，按努力程度控制检索轮次。
- 在 React 页面中流式显示执行进度、来源和最终回答。
- 使用真实 Google 搜索，或通过模拟结果演示工作流。

**默认启用模拟搜索。** 模拟结果用于验证界面和编排，不是已经查证的事实来源；模型调用仍然需要可用的 LLM 服务。

## 快速开始

准备 **Python 3.11+、Node.js 22 和 npm**。建议使用独立 Python 环境；当前依赖没有完整锁定。

### 1. 获取代码并安装后端

~~~bash
git clone https://github.com/sunShineLoveMe/anyllm-fullstack-langgraph-quickstart.git
cd anyllm-fullstack-langgraph-quickstart

python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -e "./backend[dev]" "langgraph-cli[inmem]"
cp backend/.env.example backend/.env
~~~

编辑 backend/.env：

~~~dotenv
OPENAI_API_BASE=https://api.deepseek.com
OPENAI_API_KEY=replace_with_your_model_api_key
USE_MOCK_SEARCH=true
~~~

变量名是 **OPENAI_API_BASE**，不是 OPENAI_API_BASE_URL。API Key 必须显式配置；本地无鉴权服务也需要填一个非空占位值。

当前核心节点仍使用 deepseek-chat 标识。接入其他兼容服务时，它必须提供该标识，或先统一修改代码中的模型配置；只替换 URL 不能自动支持任意模型。

### 2. 启动 LangGraph 后端

在已激活虚拟环境的终端中：

~~~bash
cd backend
langgraph dev
~~~

默认开发 API 为 **http://localhost:2024**。图名称是 agent，入口由 [backend/langgraph.json](backend/langgraph.json) 配置。

### 3. 启动前端

另开终端，从项目根目录执行：

~~~bash
cd frontend
npm ci
npm run dev
~~~

打开 **http://localhost:5173/app/**。开发模式下，前端 SDK 直接连接 localhost:2024；首次体验请在运行后端的同一台电脑打开浏览器。

### 4. 验证第一轮流程

输入一个范围清晰的问题，先选择 Low，观察：

~~~text
生成查询 → 检索结果 → 信息缺口反思 → 最终回答
~~~

默认模拟搜索不要求 Google 凭据，但仍会调用 LLM。看到回答后，再按下一节接入真实搜索，并人工核对来源。

## 搜索模式

| 变量 | 作用 |
| --- | --- |
| USE_MOCK_SEARCH=true | 默认模式，返回代码内置的演示搜索结果 |
| USE_MOCK_SEARCH=false | 尝试调用 Google Custom Search |
| GOOGLE_SEARCH_API_KEY | Google 搜索服务凭据 |
| GOOGLE_SEARCH_CX | 自定义搜索引擎 ID |

切换真实模式后重启后端。缺少搜索凭据或搜索调用异常时，当前代码会回退到模拟结果；不能把“流程成功”当成“已完成真实网络检索”。

前端三档努力程度：

| 档位 | 初始查询数 | 最大研究循环数 |
| --- | ---: | ---: |
| Low | 1 | 1 |
| Medium | 3 | 3 |
| High | 5 | 10 |

更多循环会增加模型请求量，效果取决于问题、模型与真实搜索质量。

## 架构

~~~mermaid
flowchart LR
    A["React / 流式时间线"] <--> B["LangGraph 开发 API"]
    B --> C["生成查询"]
    C --> D["真实或模拟搜索"]
    D --> E["反思信息缺口"]
    E -->|"继续"| D
    E -->|"足够"| F["生成回答"]
    C & E & F <--> G["OpenAI 兼容模型服务"]
~~~

| 路径 | 内容 |
| --- | --- |
| frontend/src/App.tsx | 流式连接、查询提交与事件时间线 |
| backend/src/agent/graph.py | 查询、搜索、反思和回答节点 |
| backend/src/agent/configuration.py | 运行配置与默认模型 |
| backend/src/agent/state.py | 图状态与消息累积 |
| backend/langgraph.json | agent 图与自定义 HTTP 应用 |

## 开发验证与当前边界

~~~bash
cd frontend
npm run build
npm run lint
~~~

- 默认依赖组合与模型响应格式需要在目标环境验证；仓库没有可据以声明整条研究链路通过的完整自动化测试套件。
- 前端模型选择与后端模型配置尚未统一。通过 API 直接调用时，应像前端一样提供 reasoning_model；反思节点的配置兜底仍需整理。
- 生产构建中的 API 地址仍固定为 localhost:8123，需要部署前调整；它与开发模式的 2024 端口不同。
- 现有 Dockerfile 引用了仓库未包含的 backend/setup.py，启动脚本也引用了未提供的 anyagent.server。因此 **当前推荐上面的双终端开发路径，不把旧 Docker 文档当作可直接运行的部署方案**。

历史 [Docker 说明](docker-quickstart.md)与[部署说明](deploy-guide.md)保留为参考；若与这里列出的代码现状冲突，以源码和当前启动路径为准。

## 来源与许可

基于 Google Gemini 的开源全栈示例改造，保留上游归属。仓库根目录包含 [Apache-2.0 LICENSE](LICENSE)，backend 目录另有 [MIT LICENSE](backend/LICENSE)；复用时按相关文件和组件的许可要求处理。
