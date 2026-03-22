// 1. 获取所有界面元素
const generateBtn = document.getElementById('generateBtn');
const sourceText = document.getElementById('sourceText');
const languageSelect = document.getElementById('languageSelect');
const resultsContainer = document.getElementById('resultsContainer');
const apiKeyInput = document.getElementById('apiKeyInput'); // 新增的 Key 输入框

// 2. 监听点击事件
generateBtn.addEventListener('click', async () => {
    const text = sourceText.value;
    const targetLang = languageSelect.value;
    const apiKey = apiKeyInput.value;

    // 严谨的防错机制
    if (!apiKey.trim()) {
        alert('Please enter your API Key first!');
        return;
    }
    if (!text.trim()) {
        alert('Please enter some source content!');
        return;
    }

    // 3. 开启加载动画
    generateBtn.innerText = 'Generating...';
    generateBtn.disabled = true;
    resultsContainer.innerHTML = '<div class="empty-state"><p>AI is analyzing and translating your content...</p></div>';

    // 4. 组装给 AI 的指令 (Prompt Engineering - 提示词工程)
    // 我们要求 AI 一次性生成 LinkedIn 和 Twitter 两个平台的版本
    const systemPrompt = `You are an expert social media localizer. Translate and adapt the following text into language code: ${targetLang}. 
    Provide two versions:
    1. A professional, formal version for LinkedIn.
    2. A short, engaging version with hashtags for Twitter/X.
    Format your response EXACTLY like this:
    [LinkedIn]
    (your linkedin text here)
    [Twitter]
    (your twitter text here)`;

    try {
        // 5. 真正向大模型发起网络请求 (这里使用通用的兼容 OpenAI 格式的接口)
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // 注入你的安全密匙
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // 使用性价比极高且对网络友好的模型
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // 提取 AI 返回的文本
        const aiResult = data.choices[0].message.content;

        // 简单处理文本，拆分成两个平台的卡片
        const linkedInText = aiResult.split('[Twitter]')[0].replace('[LinkedIn]', '').trim();
        const twitterText = aiResult.split('[Twitter]')[1].trim();

        // 6. 将真实的 AI 结果渲染到网页上
        resultsContainer.innerHTML = `
            <div class="result-card">
                <h3>LinkedIn (Professional)</h3>
                <p>${linkedInText}</p>
            </div>
            <div class="result-card">
                <h3>Twitter/X (Engaging)</h3>
                <p>${twitterText}</p>
            </div>
        `;

    } catch (error) {
        // 专业的错误捕获机制
        console.error('API Error:', error);
        resultsContainer.innerHTML = `<div class="empty-state"><p style="color: red;">Error: Failed to connect to AI. Please check your API Key and network.</p></div>`;
    } finally {
        // 无论成功还是失败，都恢复按钮状态
        generateBtn.innerText = 'Generate';
        generateBtn.disabled = false;
    }
});