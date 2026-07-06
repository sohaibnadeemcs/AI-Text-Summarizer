// ── Groq API Key ─────────────────────────────────────────────────────────────
const API_KEY = "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";

// ── Groq API URL ─────────────────────────────────────────────────────────────
const API_URL = "https://api.groq.com/openai/v1/chat/completions";


// ── Character Counter ────────────────────────────────────────────────────────
document.getElementById("inputText").addEventListener("input", function () {
  const count = this.value.length;
  document.getElementById("charCount").textContent = count;
});


// ── Main Summarize Function ──────────────────────────────────────────────────
async function summarize() {

  const inputText = document.getElementById("inputText").value.trim();

  if (!inputText) {
    showError("Please paste some text first before summarizing.");
    return;
  }

  if (inputText.length < 50) {
    showError("Text is too short. Please paste at least a few sentences.");
    return;
  }

  document.getElementById("outputCard").style.display = "block";
  document.getElementById("loading").style.display = "block";
  document.getElementById("result").innerHTML = "";
  document.getElementById("errorBox").style.display = "none";

  const btn = document.getElementById("summarizeBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Summarizing...";

  try {
    const prompt = `
You are a professional text summarizer. Read the following text carefully and provide:

1. A 2-3 sentence overview of the main idea
2. Key points as bullet points (maximum 6 bullets)
3. One sentence conclusion

Format your response in clean HTML using:
- <p> tags for paragraphs
- <ul> and <li> tags for bullet points
- <strong> tags for any important words

Text to summarize:
"${inputText}"
    `;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "API call failed");
    }

    const data    = await response.json();
    const summary = data.choices[0].message.content;

    document.getElementById("loading").style.display = "none";
    document.getElementById("result").innerHTML = summary;

  } catch (error) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("outputCard").style.display = "none";
    showError("Something went wrong: " + error.message);
  }

  btn.disabled = false;
  btn.textContent = "✨ Summarize";
}


// ── Copy Result ──────────────────────────────────────────────────────────────
function copyResult() {
  const resultText = document.getElementById("result").innerText;
  navigator.clipboard.writeText(resultText).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "✅ Copied!";
    setTimeout(() => { btn.textContent = "📋 Copy Summary"; }, 2000);
  });
}


// ── Show Error ───────────────────────────────────────────────────────────────
function showError(message) {
  const errorBox = document.getElementById("errorBox");
  errorBox.textContent = "❌ " + message;
  errorBox.style.display = "block";
  setTimeout(() => { errorBox.style.display = "none"; }, 6000);
}
