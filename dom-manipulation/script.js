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
        quoteContainer.innerHTML = filteredQuotes.map(q => `<p>"${q.text}" - ${q.author} (${q.category})</p>`).join('');
    }

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<p>No quotes available.</p>";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerHTML = `<p>"${quotes[randomIndex].text}" - <strong>(${quotes[randomIndex].category})</strong></p>`;
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(quotes[randomIndex]));
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
            <button id="exportBtn">Export Quotes</button>
            <input type="file" id="importFile" accept=".json" />
        `;
        document.body.appendChild(formContainer);

        document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
        document.getElementById("exportBtn").addEventListener("click", exportQuotes);
        document.getElementById("importFile").addEventListener("change", importFromJsonFile);
    }

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value;
        const newQuoteCategory = document.getElementById("newQuoteCategory").value;
        
        if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
            alert("Please enter both quote text and category.");
            return;
        }
        
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("Quote added successfully!");
        populateCategories();
    }

    function exportQuotes() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    localStorage.setItem("quotes", JSON.stringify(quotes));
                    alert("Quotes imported successfully!");
                    populateCategories();
                } else {
                    alert("Invalid file format. Please upload a valid JSON file.");
                }
            } catch (error) {
                alert("Error reading file. Please ensure it is a valid JSON file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }
    
    newQuoteBtn.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();
    
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        quoteDisplay.innerHTML = `<p>"${lastViewedQuote.text}" - <strong>(${lastViewedQuote.category})</strong></p>`;
    }
});
