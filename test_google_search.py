import os
import requests
import json

# 设置环境变量或直接在这里填写
API_KEY = os.environ.get("GOOGLE_SEARCH_API_KEY", "")  # 你的 API key
CX = os.environ.get("GOOGLE_SEARCH_CX", "")           # 你的搜索引擎 ID

if not API_KEY or not CX:
    print("请设置 GOOGLE_SEARCH_API_KEY 和 GOOGLE_SEARCH_CX 环境变量")
    exit(1)

def test_google_search(query="python programming", debug=True):
    """测试 Google 自定义搜索 API"""
    endpoint = "https://customsearch.googleapis.com/customsearch/v1"
    
    # 基本参数
    params = {
        "key": API_KEY,
        "cx": CX,
        "q": query
    }
    
    # 可选参数
    additional_params = {
        "num": 5,          # 结果数量 (1-10)
        "safe": "active",  # 安全搜索
        "gl": "cn",        # 地理位置（可选）
        "hl": "zh-CN",     # 语言（可选）
    }
    
    # 合并参数
    params.update(additional_params)
    
    if debug:
        print(f"查询: {query}")
        print(f"API Key: {API_KEY[:5]}...")
        print(f"CX: {CX[:5]}...")
        print(f"完整参数: {params}")
    
    # 发送请求
    try:
        response = requests.get(endpoint, params=params, timeout=30)
        
        # 打印完整响应，包括状态码和响应内容
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # 打印搜索信息
            if "searchInformation" in data:
                info = data["searchInformation"]
                print(f"搜索信息: 总结果数 {info.get('totalResults', 'N/A')}, 搜索时间 {info.get('searchTime', 'N/A')}s")
            
            # 打印结果
            if "items" in data:
                items = data["items"]
                print(f"找到 {len(items)} 条结果:")
                for i, item in enumerate(items[:3], 1):  # 只打印前3条
                    print(f"  {i}. {item.get('title', 'No Title')} - {item.get('link', 'No Link')}")
                
                if len(items) > 3:
                    print(f"  ... 等共 {len(items)} 条结果")
            else:
                print("未找到搜索结果")
                print("API 响应中的键:", list(data.keys()))
        else:
            print(f"错误: {response.text}")
            
            # 尝试解析错误信息
            try:
                error_data = response.json()
                if "error" in error_data:
                    error = error_data["error"]
                    print(f"错误详情: {error.get('message', 'Unknown')}")
                    if "errors" in error:
                        for err in error["errors"]:
                            print(f"  - {err.get('reason', 'Unknown')}: {err.get('message', 'No details')}")
            except:
                print("无法解析错误信息")
    
    except Exception as e:
        print(f"请求异常: {str(e)}")

if __name__ == "__main__":
    # 尝试几个不同的查询
    test_google_search("Python programming")
    print("\n" + "="*50 + "\n")
    test_google_search("人工智能最新发展") 