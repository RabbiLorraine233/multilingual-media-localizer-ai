// medialocalizer.me - 核心逻辑文件

// 1. 获取界面元素
const generateBtn = document.getElementById('generateBtn');
const sourceText = document.getElementById('sourceText');
const languageSelect = document.getElementById('languageSelect');
const resultsContainer = document.getElementById('resultsContainer');
const apiKeyInput = document.getElementById('apiKeyInput'); // 安全 Key 输入框

// 2. 监听按钮的点击事件
generateBtn.addEventListener('click', async () => {
    // 获取用户当前的输入值
    const text = sourceText.value;
    const targetLang = languageSelect.value;
    const apiKey = apiKeyInput.value;

    // --- 安全与完整性检查 ---
    if (!apiKey.trim()) {
        alert('Please enter your API Key first for security.');
        return;
    }
    if (!text.trim()) {
        alert('Please enter some source content to localize.');
        return;
    }

    // --- 3. 开启“加载中”状态 (极佳的用户体验) ---
    generateBtn.innerText = 'Generating...';
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.7';
    // 右侧结果区显示等待提示，并清理之前的卡片
    resultsContainer.innerHTML = '<div class="empty-state"><p>AI is analyzing and crafting your localized content...</p></div>';

    // ============================================================
    // --- 4. 组装新媒体指令 (Prompt Engineering - 核心修改区) ---
    // 我们的指令现在要求 AI 生成“直接翻译”和“电商文案”
    // ============================================================
    const systemPrompt = `You are an expert culturalizer and content writer. Translate and adapt the provided text into the language with the following code: ${targetLang}.
    Provide two distinct versions:
    1. A faithful, professional, and natural Direct Translation of the original text.
    2. A high-converting, persuasive E-commerce Copy optimized for platforms like Shopify, Amazon, or Shopee to drive sales in the local market.
    Format your response EXACTLY like this with the specific bracketed tags for parsing:
    [DirectTranslation]
    (your direct translation text here)
    [EcommerceCopy]
    (your e-commerce copy text here)`;

    try {
        // --- 5. 向 AI 发起真实的网络请求 ---
        // 我们这里使用的是兼容 OpenAI 格式的 DeepSeek 接口，性价比高且网络友好
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // 注入你的专属安全密匙
            },
            body: JSON.stringify({
                model: 'deepseek-chat', 
                messages: [
                    { role: 'system', content: systemPrompt }, // 赋予 AI 角色和任务
                    { role: 'user', content: text }          // 用户输入的原文
                ],
                temperature: 0.7 // 控制生成的随机性，0.7 代表兼具稳定与创意
            })
        });

        const data = await response.json();
        
        // 专业的错误捕获：防止 API Key 错误或额度不足时网页直接崩溃
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResult = data.choices[0].message.content;

        // --- 数据处理：将 AI 返回的一大段文字按特定标签拆分开 ---
        // 我们使用了更严谨的拆分和替换逻辑，防止 AI 没按格式输出导致崩溃
        const parts = aiResult.split('[EcommerceCopy]');
        const directTranslationText = parts[0].replace('[DirectTranslation]', '').trim();
        const ecommerceCopyText = parts[1] ? parts[1].trim() : '(AI failed to generate this part, please try again.)';

        // ============================================================
        // --- 6. 将新的结果名称渲染到网页上 (UI 修改区) ---
        // 这里我们将 <h3> 标签内的文字换成了你想要的英文
        // ============================================================
        resultsContainer.innerHTML = `
            <div class="result-card">
                <h3>Direct Translation</h3> <p>${directTranslationText}</p>
            </div>
            <div class="result-card">
                <h3>E-commerce Copy</h3> <p>${ecommerceCopyText}</p>
            </div>
        `;

    } catch (error) {
        // 专业的错误捕获机制，将错误信息友好的展示给用户
        console.error('API Error:', error);
        resultsContainer.innerHTML = `<div class="empty-state"><p style="color: red;">Error: Failed to connect to AI. Please check your API Key and network connection.</p></div>`;
    } finally {
        // --- 7. 无论成功还是失败，都恢复按钮的初始状态 ---
        generateBtn.innerText = 'Generate';
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
    }
});