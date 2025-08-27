/* === Core App State & Constants === */
const BACKEND_PROXY_URL = '/api/server'; 

const LARGE_SCREEN_BREAKPOINT = 768;
const isLargeScreen = () => window.innerWidth >= LARGE_SCREEN_BREAKPOINT;

let currentSession = {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    exchanges: []
};
let abortController = null;

/* === Navigation & Sidebar Functionality === */
const navbarToggle = document.getElementById("navbarToggle");
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");

function updateMainLayout() {
    if (isLargeScreen()) {
        main.classList.toggle("sidebar-hidden", !sidebar.classList.contains("active"));
    } else {
        main.classList.remove("sidebar-hidden");
    }
}

updateMainLayout();

navbarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    updateMainLayout();
});

document.addEventListener("click", (event) => {
    const clickedOutsideSidebar = !sidebar.contains(event.target);
    const clickedOutsideToggle = !navbarToggle.contains(event.target);
    if (!isLargeScreen() && clickedOutsideSidebar && clickedOutsideToggle) {
        sidebar.classList.remove("active");
        updateMainLayout();
    }
});

/* === Chat History Management === */
const historyContainer = document.getElementById("historyContainer");
const middleSection = document.querySelector(".middle-section");
const bottomSection = document.querySelector(".bottom-section");
const clearBtns = document.querySelectorAll(".clear-all-history-btn");
const newChatBtn = document.querySelector(".new-chat-btn");
const historyTitle = document.getElementById("historyTitle");
const searchResultsTitle = document.getElementById("searchResultsTitle");


function updateHistoryUI() {
    const chatSessions = JSON.parse(localStorage.getItem("chatSessions")) || [];
    const count = chatSessions.length;
    
    if (count === 0) {
        historyTitle.textContent = "No Chats";
        clearBtns.forEach(btn => btn.style.display = "none");
    } else if (count === 1) {
        historyTitle.textContent = "Recent Chat";
        clearBtns.forEach(btn => btn.style.display = "none");
    } else {
        historyTitle.textContent = "Recent Chats";
        clearBtns.forEach(btn => btn.style.display = "inline-block");
    }
}

clearBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        localStorage.removeItem("chatSessions");
        historyContainer.innerHTML = "";
        currentSession = {
            id: crypto.randomUUID(),
            startedAt: new Date().toISOString(),
            exchanges: []
        };
        chatOutput.innerHTML = "";
        updateHistoryUI();
        loadHistory();

        if (searchInput.value.length > 0) {
            searchInput.value = "";
            searchInput.dispatchEvent(new Event("input"));
        }
        
    });
});

newChatBtn.addEventListener("click", () => {
    if (currentSession.exchanges.length > 0) {
        saveSession(currentSession);
    }
    currentSession = {
        id: crypto.randomUUID(),
        startedAt: new Date().toISOString(),
        exchanges: []
    };
    chatOutput.innerHTML = "";
    loadHistory();
});

/* Sessions */
function saveSession(session) {
    const history = JSON.parse(localStorage.getItem("chatSessions")) || [];
    const updated = history.filter(s => s.id !== session.id);
    updated.unshift(session);
    localStorage.setItem("chatSessions", JSON.stringify(updated));
}

function deleteSession(sessionId) {
    let history = JSON.parse(localStorage.getItem("chatSessions")) || [];
    history = history.filter(s => s.id !== sessionId);
    localStorage.setItem("chatSessions", JSON.stringify(history));

    if (searchInput.value.length > 0) {
        searchInput.dispatchEvent(new Event("input"));
    } else {
        loadHistory();
    }
    
    if (currentSession.id === sessionId) {
        currentSession = {
            id: crypto.randomUUID(),
            startedAt: new Date().toISOString(),
            exchanges: []
        };
        chatOutput.innerHTML = "";
    }
    
}

function loadHistory() {
    historyContainer.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem("chatSessions")) || [];
    saved.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    saved.forEach(session => renderSessionItem(session, historyContainer));
    updateHistoryUI();

    const welcomeMessage = chatOutput.querySelector(".welcome-message")
    if (currentSession.exchanges.length === 0 && !welcomeMessage) {
        renderWelcomeMessage();
    }

    const activeItem = document.querySelector(`[data-session-id="${currentSession.id}"]`);
    if (activeItem) {
        activeItem.classList.add("active");
    }
}

/* === Time === */
function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

function getRelativeDate(timestamp) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateToCheck = new Date(timestamp);
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    if (isSameDay(dateToCheck, today)) {
        return `Today, ${dateToCheck.toLocaleTimeString(undefined, timeOptions)}`;
    }
    
    if (isSameDay(dateToCheck, yesterday)) {
        return `Yesterday, ${dateToCheck.toLocaleTimeString(undefined, timeOptions)}`;
    }
    
    return dateToCheck.toLocaleDateString(); 
}

/* === Chat Rendering Functions === */
function renderSessionItem(session, container) {
    const lastExchange = session.exchanges[session.exchanges.length - 1];
    const lastExchangeDate = lastExchange ? getRelativeDate(lastExchange.timestamp) : getRelativeDate(session.startedAt);

    const div = document.createElement("div");
    div.className = "history-item";
    div.dataset.sessionId = session.id;

    if (session.id === currentSession.id) {
        div.classList.add("active");
    }

    const title = session.title || session.exchanges[0]?.prompt.slice(0, 30) || "New Chat";

    div.innerHTML = `
        <div class="history-content">
            <p><strong>${title}</strong></p>
            <div class="stamp">
                <span>${lastExchangeDate}</span>
                <button class="delete-chat-btn"><i class="bx bx-trash"></i></button>
            </div>
        </div>
    `;

    div.querySelector(".delete-chat-btn").addEventListener("click", (e) => {
        e.stopPropagation(); 
        deleteSession(session.id);
        loadHistory();
    });

    div.querySelector(".history-content").addEventListener("click", () => {

        document.querySelectorAll(".history-item").forEach(item => {
            item.classList.remove("active");
        });

        div.classList.add("active");

        currentSession = session;
        chatOutput.innerHTML = "";
        [...session.exchanges].forEach(renderChatExchange);
    });

    container.appendChild(div);
}

function renderChatExchange(chat) {
    const exchangeBlock = document.createElement("div");
    exchangeBlock.className = "chat-exchange";

    exchangeBlock.innerHTML = `
        <div class="chat-prompt">
            <p>You: <strong>${chat.prompt}</strong></p>
        </div>
        <div class="chat-response">
            <p>${chat.response}</p>
        </div>
    `;
    
    chatOutput.prepend(exchangeBlock);
    
}

function renderWelcomeMessage() {
    const welcomeMessage = document.createElement("div");
    welcomeMessage.className = "chat-exchange welcome-message";
    welcomeMessage.innerHTML = `
        <div class="chat-response">
            <p id="text">Aura Assistant is ready. Ask anything, build anything, explore everything.</p>
        </div>
    `;
    chatOutput.appendChild(welcomeMessage);
}

/* === Chat Generation and Filtering === */
const filterToggleBtn = document.getElementById("filterToggle");
const promptFilters = document.getElementById("promptFilters");
const promptForm = document.querySelector(".prompt-form");
const chatOutput = document.getElementById("chatOutput");
const generateBtn = promptForm.querySelector(".generate-btn");
const promptInput = promptForm.querySelector('textarea[name="prompt"]');

const filterOptions = {
    topic: ["Technology", "Health", "Finance", "Education", "Entertainment", "Travel", "Food", "Sports", "Science", "Lifestyle"],
    tone: ["Formal", "Informal", "Persuasive", "Informative", "Humorous", "Empathetic", "Assertive", "Neutral"],
    focus: ["Broad overview", "Summary", "Detailed explanation", "Step-by-step guide", "Technical deep dive", "Beginner-friendly", "Expert-level"]
};

/* Filters */
document.querySelectorAll(".filter-select").forEach(select => {
    const key = select.dataset.filter;
    filterOptions[key].forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
});

document.querySelectorAll(".filter-select").forEach(select => {
    const resetOption = document.createElement("option");
    resetOption.value = "__reset__";
    resetOption.textContent = "Reset Filter";
    resetOption.className = "reset-option";
    select.appendChild(resetOption);
    const updateStyle = () => {
        const selectedValue = select.value;
        const selectedOption = select.options[select.selectedIndex];
        const isPlaceholder = selectedOption.disabled && selectedOption.hidden;
        const isReset = selectedValue === "__reset__";
        if (isReset) {
            select.selectedIndex = 0;
            select.dispatchEvent(new Event("change"));
        }
        select.classList.toggle("placeholder-active", isPlaceholder || isReset);
    };
    select.addEventListener("change", updateStyle);
    updateStyle();
});

filterToggleBtn.addEventListener("click", () => {
    promptFilters.classList.toggle("show");
    if (promptFilters.classList.contains("show")) {
        chatOutput.classList.add("height")
    }
    else {
        chatOutput.classList.remove("height")
    }
});

/* Dynamic Placeholder */
function updatePlaceholder() {
    if (window.innerWidth <= 390) {
        promptInput.placeholder = "Enter your prompt";
    } else {
        promptInput.placeholder = "Generate a code snippet";
    }
}
window.addEventListener("load", updatePlaceholder);
window.addEventListener("resize", updatePlaceholder);


// Utility: Markdown to Safe HTML
function renderMarkdownToHTML(markdownText) {
    if (typeof marked === "undefined" || typeof DOMPurify === "undefined") {
        console.warn("Markdown libraries not loaded. Rendering plain text.");
        return markdownText;
    }
    return DOMPurify.sanitize(marked.parse(markdownText));
}

/* Generation */
generateBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (abortController) {
        abortController.abort();
        return;
    }

    const promptText = promptInput.value.trim();
    if (!promptText) return;

    const welcomeMessage = chatOutput.querySelector(".welcome-message");
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    abortController = new AbortController();
    generateBtn.textContent = "Terminate";
    generateBtn.classList.add("stop-btn");
    promptInput.disabled = true;

    const timestamp = new Date().toISOString();
    const chatBlock = document.createElement("div");
    chatBlock.className = "chat-exchange loading";
    chatBlock.innerHTML = `
        <div class="chat-prompt">
            <p>You: <strong>${promptText}</strong></p>
        </div>
        <div class="chat-response">
            <div class="response-content">Thinking...</div>
        </div>
    `;
    chatOutput.prepend(chatBlock);

    const outputElement = chatBlock.querySelector(".response-content");
    let geminiReply = "Error fetching response.";

    try {
        const filters = getSelectedFilters();
        const fullPrompt = createFullPrompt(promptText, filters);

        const response = await fetch(BACKEND_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: fullPrompt }),
            signal: abortController.signal
        });


        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        const rawMarkdown = (data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.").trim();
        geminiReply = renderMarkdownToHTML(rawMarkdown);

    } catch (err) {
        if (err.name === "AbortError") {
            geminiReply = "Generation stopped.";
        } else {
            console.error("Fetch failed:", err);
        }
    } finally {
        outputElement.innerHTML = geminiReply;
        chatBlock.classList.remove("loading");

        const newExchange = { prompt: promptText, response: geminiReply, timestamp };
        currentSession.exchanges.push(newExchange);
        saveSession(currentSession);

        if (currentSession.exchanges.length === 1) {
            const title = await generateTitle(currentSession.exchanges);
            currentSession.title = title;
            saveSession(currentSession);
        }

        loadHistory();

        abortController = null;
        generateBtn.textContent = "Generate";
        generateBtn.classList.remove("stop-btn");
        promptInput.disabled = false;
        promptInput.value = "";
    }
});


promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); 
        generateBtn.click();
    }
});

async function generateTitle(exchanges) {
    const conversationText = exchanges.map(e => `User: ${e.prompt}\nGemini: ${e.response}`).join('\n\n');
    const titlePrompt = `Based on the following conversation, create a concise, one-line title (max 5 words). Do not include any extra text or punctuation. Just the title.\n\n${conversationText}`;
    
    try {
        const response = await fetch(BACKEND_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: titlePrompt })
        });


        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text.trim().replace(/\*\*/g, '') || "Untitled Chat";
    } catch (err) {
        console.error("Failed to generate title:", err);
        return "Untitled Chat";
    }
}

function createFullPrompt(promptText, filters) {
    const parts = [promptText];
    const filterLines = [];
    if (filters.topic) filterLines.push(`Topic: ${filters.topic}`);
    if (filters.tone) filterLines.push(`Tone: ${filters.tone}`);
    if (filters.focus) filterLines.push(`Focus: ${filters.focus}`);
    if (filterLines.length > 0) {
        parts.push(`Additional instructions: ${filterLines.join(", ")}`);
    }
    return parts.join("\n\n");
}

function getSelectedFilters() {
    const selected = {};
    document.querySelectorAll(".filter-select").forEach(select => {
        const value = select.value.trim();
        if (value && value !== "__reset__") {
            selected[select.dataset.filter] = value;
        }
    });
    return selected;
}

/* === Search Functionality === */
const searchInput = document.getElementById("searchInput");
const resultsList = document.getElementById("resultsList");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const history = JSON.parse(localStorage.getItem("chatSessions")) || [];
    resultsList.innerHTML = "";
    
    if (query.length > 0) {
        middleSection.style.display = "block";
        bottomSection.style.display = "none";
        
        const filteredSessions = history.filter(session => {
            return session.title?.toLowerCase().includes(query) || 
                   session.exchanges.some(ex => ex.prompt.toLowerCase().includes(query));
        });

        if (filteredSessions.length > 1) {
            searchResultsTitle.textContent = "Chats Found"; 
            clearBtns.forEach(btn => btn.style.display = "inline-block");
            
            filteredSessions.forEach(session => {
                renderSessionItem(session, resultsList);
            });
        } else if (filteredSessions.length === 1) {
            searchResultsTitle.textContent = "Chat Found"; 
            clearBtns.forEach(btn => btn.style.display = "none");
            
            filteredSessions.forEach(session => {
                renderSessionItem(session, resultsList);
            });
        } else {
            searchResultsTitle.textContent = "No Chats Found"; 
            clearBtns.forEach(btn => btn.style.display = "none");
        }
    } else {
        middleSection.style.display = "none";
        bottomSection.style.display = "block";
    }
});

/* === Initial App Setup === */
loadHistory();