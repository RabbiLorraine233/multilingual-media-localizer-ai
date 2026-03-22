const generateBtn = document.getElementById('generateBtn');
const sourceText = document.getElementById('sourceText');
const languageSelect = document.getElementById('languageSelect');
const resultsContainer = document.getElementById('resultsContainer');
const apiKeyInput = document.getElementById('apiKeyInput'); 

generateBtn.addEventListener('click', async () => {
    const text = sourceText.value;
    const targetLang = languageSelect.value;
    const apiKey = apiKeyInput.value;

    if (!apiKey.trim()) {
        alert('Please enter your API Key first!');
        return;
    }
    if (!text.trim()) {
        alert('Please enter some source content!');
        return;
    }

    generateBtn.innerText = 'Generating...';
    generateBtn.disabled = true;
    resultsContainer.innerHTML = '<div class="empty-state"><p>AI is analyzing and translating your content...</p></div>';

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
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` 
            },
            body: JSON.stringify({
                model: 'deepseek-chat', 
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // 增加错误处理，防止 API Key 错误时崩溃
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResult = data.choices[0].message.content;

        const linkedInText = aiResult.split('[Twitter]')[0].replace('[LinkedIn]', '').trim();
        const twitterText = aiResult.split('[Twitter]')[1].trim();

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
        console.error('API Error:', error);
        resultsContainer.innerHTML = `<div class="empty-state"><p style="color: red;">Error: Failed to connect to AI. Please check your API Key and network.</p></div>`;
    } finally {
        generateBtn.innerText = 'Generate';
        generateBtn.disabled = false;
    }
});