// 1. 获取网页上的核心元素 (Connect UI elements to JS)
const generateBtn = document.getElementById('generateBtn');
const sourceText = document.getElementById('sourceText');
const languageSelect = document.getElementById('languageSelect');
const resultsContainer = document.getElementById('resultsContainer');

// 2. 监听按钮的点击事件 (Listen for the click)
generateBtn.addEventListener('click', () => {
    // 获取用户输入的文字和选择的语言
    const text = sourceText.value;
    const targetLang = languageSelect.value;

    // 体验优化：如果用户什么都没填就点按钮，给个优雅的提示
    if (!text.trim()) {
        alert('Please enter some source content first!');
        return;
    }

    // 3. 触发“加载中”状态 (Loading State - 极佳的用户体验)
    // 让按钮变灰并显示 Generating...，防止用户重复点击
    generateBtn.innerText = 'Generating...';
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.7';
    // 右侧显示等待提示
    resultsContainer.innerHTML = '<div class="empty-state"><p>AI is analyzing and localizing your content...</p></div>';

    // 4. 模拟 AI 处理数据的过程 (Simulate API Call)
    // 这里我们先用 setTimeout 设置 1.5 秒的延迟，假装 AI 正在思考
    // 下一阶段我们会把这里替换成真实的 AI 接口调用
    setTimeout(() => {
        
        // 准备模拟的输出数据 (针对不同社交平台的调性)
        const platform1 = "LinkedIn (Professional Tone)";
        const platform2 = "Twitter/X (Casual & Trendy)";
        
        // 5. 动态生成美观的 HTML 卡片 (Dynamic UI Render)
        // 注意看，这里生成的 class="result-card" 就是我们在 CSS 里写过悬浮特效的卡片
        resultsContainer.innerHTML = `
            <div class="result-card">
                <h3>${platform1}</h3>
                <p>[Mock API] This is the professional adaptation of your content in selected language (${targetLang}). It focuses on industry impact and networking.</p>
            </div>
            <div class="result-card">
                <h3>${platform2}</h3>
                <p>[Mock API] Catchy and localized adaptation (${targetLang})! ✨ Ready for engagement and trending hashtags. #Media #Global</p>
            </div>
        `;

        // 6. 恢复按钮的初始状态 (Reset Button)
        generateBtn.innerText = 'Generate';
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';

    }, 1500); // 1500毫秒 = 1.5秒
});