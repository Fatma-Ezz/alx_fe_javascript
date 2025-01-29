document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
        { text: "Act as if what you do makes a difference. It does.", category: "Life" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<p>No quotes available.</p>";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerHTML = `<p>"${quotes[randomIndex].text}" - <strong>(${quotes[randomIndex].category})</strong></p>`;
    }

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value;
        const newQuoteCategory = document.getElementById("newQuoteCategory").value;
        
        if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
            alert("Please enter both quote text and category.");
            return;
        }
        
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("Quote added successfully!");
    }
    
    newQuoteBtn.addEventListener("click", showRandomQuote);
    showRandomQuote(); // Display a quote initially
});
