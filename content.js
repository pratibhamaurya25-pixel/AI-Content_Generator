const output = document.getElementById("output");

const sanitizeInput = (input) => {
  return input
    .split("")
    .filter((char) => char !== "`")
    .join("")
    .replace(/\$\{/g, "")
    .trim();
};

const showLoading = () => {
  output.style.display = "block";

  output.innerHTML = `
    <div class="loader"></div>
    <p>Thinking...</p>
  `;
};

const showError = (message) => {
  output.style.display = "block";

 
  output.innerHTML = `<p> ${message}</p>`;
};

const callGemini = async (prompt) => {

  showLoading();

  const headerData = {
    "Content-type": "application/json",
  };

  const partData = {
    text: prompt,
  };

  try {

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",

        headers: {
          ...headerData,
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [{ ...partData }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();

  
    const {
      candidates: [
        {
          content: {
            parts: [{ text }],
          },
        },
      ],
    } = data;

    return text;

  } catch (err) {

    showError(err.message);

    return null;
  }
};

const askAI = async () => {

  let input =
    document.getElementById("inputText").value;

  input = sanitizeInput(input);

  if (!input) {
    showError("Please enter a valid question");
    return;
  }

  const cleanedInput = input
    .split(" ")
    .map((word) => word.trim())
    .join(" ");

 
  const prompt =
    `Answer this question simply: ${cleanedInput}`;

  const result = await callGemini(prompt);

  if (result) {

    
    output.innerHTML = `<p>${result}</p>`;
  }
};

const summarize = async () => {

  let input =
    document.getElementById("inputText").value;

  input = sanitizeInput(input);

  if (!input) {
    showError("Please enter some text");
    return;
  }

  const cleanedInput = input
    .split(" ")
    .filter((word) => word !== "")
    .join(" ");

  const prompt =
    `Summarize this text in 3-4 lines: ${cleanedInput}`;

  const result = await callGemini(prompt);

  if (result) {
    output.innerHTML = `<p>${result}</p>`;
  }
};

const getIdeas = async () => {

  let input =
    document.getElementById("inputText").value;

  input = sanitizeInput(input);

  if (!input) {
    showError("Please enter a topic");
    return;
  }

  const prompt =
    `Give 5 creative ideas about: ${input}`;

  const result = await callGemini(prompt);

  if (result) {

    const formattedIdeas = result
      .split("\n")
      .filter((idea) => idea.trim() !== "")
      .map((idea, index) =>
        `<p>${index + 1}. ${idea}</p>`
      )
      .join("");

    output.innerHTML = `${formattedIdeas}`;
  }
};

const define = async () => {

  let input =
    document.getElementById("inputText").value;

  input = sanitizeInput(input);

  if (!input) {
    showError("Please enter a term");
    return;
  }

  const cleanedInput = input
    .split(" ")
    .map((word) =>
      word.charAt(0).toUpperCase() +
      word.slice(1)
    )
    .join(" ");

  const prompt =
    `Define this term in simple words: ${cleanedInput}`;

  const result = await callGemini(prompt);

  if (result) {
    output.innerHTML = `<p>${result}</p>`;
  }
};