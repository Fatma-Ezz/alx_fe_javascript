document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "Inspiration" },
        { text: "Act as if what you do makes a difference. It does.", author: "William James", category: "Life" }
    ];

    const categoryFilter = document.getElementById("categoryFilter");
    const quoteContainer = document.getElementById("quoteContainer");
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts");
            const data = await response.json();
            const serverQuotes = data.slice(0, 5).map(post => ({ text: post.title, category: "General" }));
            quotes = [...quotes, ...serverQuotes];
            localStorage.setItem("quotes", JSON.stringify(quotes));
            populateCategories();
            alert("Quotes synced with server!");  // Updated the alert text here
        } catch (error) {
            console.error("Error fetching quotes from server:", error);
        }
    }

    function syncQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        alert("Quotes synced successfully!");
    }

    function populateCategories() {
        const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        const savedCategory = localStorage.getItem("selectedCategory") || "All Categories";
        categoryFilter.value = savedCategory;
        filterQuotes();
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);
        const filteredQuotes = selectedCategory === "All Categories" ? quotes : quotes.filter(q => q.category === selectedCategory);
        quoteContainer.textContent = "";
        filteredQuotes.forEach(q => {
            const quoteElement = document.createElement("p");
            quoteElement.textContent = `"${q.text}" - ${q.author || "Unknown"} (${q.category})`;
            quoteContainer.appendChild(quoteElement);
        });
    }

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = `"${quotes[randomIndex].text}" - (${quotes[randomIndex].category})`;
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(quotes[randomIndex]));
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
            <button id="exportBtn">Export Quotes</button>
            <button id="syncBtn">Sync with Server</button>
            <button id="syncLocalBtn">Sync Locally</button>
            <input type="file" id="importFile" accept=".json" />
        `;
        document.body.appendChild(formContainer);

        document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
        document.getElementById("exportBtn").addEventListener("click", exportQuotes);
        document.getElementById("importFile").addEventListener("change", importFromJsonFile);
        document.getElementById("syncBtn").addEventListener("click", fetchQuotesFromServer);
        document.getElementById("syncLocalBtn").addEventListener("click", syncQuotes);
    }

    async function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value;
        const newQuoteCategory = document.getElementById("newQuoteCategory").value;
        
        if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
            alert("Please enter both quote text and category.");
            return;
        }
        
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        
        try {
            await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQuote)
            });
            alert("Quote added and synced with server!");
        } catch (error) {
            console.error("Error syncing with server:", error);
        }
        
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        populateCategories();
    }

    newQuoteBtn.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();
    
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        quoteDisplay.textContent = `"${lastViewedQuote.text}" - (${lastViewedQuote.category})`;
    }

    setInterval(fetchQuotesFromServer, 30000);
});
