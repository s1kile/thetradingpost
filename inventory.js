const sheetLink = "https://docs.google.com/spreadsheets/d/1yZTUAi0RI9jyfHA_8PxdJhCGAix7roLe-0you8YGP2A/export?format=csv&t=" + new Date().getTime();

let itemList = []; 
let category = "Others"; 

async function fetchInventory() {
    try {
        const response = await fetch(sheetLink);
        const rawText = await response.text();
        
        const lines = rawText.split("\n").map(row => row.trim()).filter(row => row.length > 0);
        itemList = []; 
        
        for (let i = 1; i < lines.length; i++) {
            const columns = lines[i].split(","); 
            if (columns.length < 5) continue;   

            let finalImg = columns[4].trim(); 
            
            if (finalImg.includes("fandom.com/wiki/")) {
                const pageName = finalImg.split("/wiki/")[1];
                finalImg = `https://flee-the-facility.fandom.com/wiki/Special:FilePath/${pageName}.png`;
            }

            const hammer = {
                name: columns[0].trim(),
                event: columns[1].trim(),
                price: columns[2].trim(),
                stock: parseInt(columns[3].trim()) || 0,
                imgUrl: finalImg
            };
            
            itemList.push(hammer);
        }

        renderGrid();
        setupSearch();

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("itemGrid").innerHTML = "<p style='color: #ff4d4d; grid-column: 1/-1; text-align: center;'>Failed to load inventory assets. Please try again later.</p>";
    }
}

function renderGrid() {
    const grid = document.getElementById("itemGrid");
    const typedText = document.getElementById("searchBar").value.toLowerCase();
    
    grid.innerHTML = ""; 

    const matches = itemList.filter(item => {
        let isCorrectCategory = false;
        
        if (category === "Valentines") {
            isCorrectCategory = item.event.startsWith("Valentine");
        } else if (category === "St.Patricks") {
            isCorrectCategory = item.event.startsWith("St. Patrick");
        } else {
            isCorrectCategory = item.event.toLowerCase() === category.toLowerCase();
        }

        const isNameMatched = item.name.toLowerCase().includes(typedText);
        
        return isCorrectCategory && isNameMatched;
    });

    if (matches.length === 0) {
        grid.innerHTML = "<p style='grid-column: 1/-1; color: #aaa; text-align: center; margin-top: 20px;'>No items found matching your criteria.</p>";
        return;
    }

    matches.forEach(item => {
        const isOos = item.stock <= 0; 
        
        const cardHtml = `
            <div class="item-card">
                <img class="item-image" src="${item.imgUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='https://flee-the-facility.fandom.com/wiki/Special:FilePath/VIP_Ban_Hammer_Hammer.png';">
                <div>
                    <h3 class="item-title">${item.name}</h3>
                    <div class="item-tag">${item.event}</div>
                </div>
                <div>
                    <div class="item-meta">
                        <span class="price-lbl">${item.price}</span>
                        <span class="${isOos ? 'oos-text' : 'stock-lbl'}">
                            ${isOos ? 'OOS' : `Stock: ${item.stock}`}
                        </span>
                    </div>
                    ${isOos 
                        ? `<span class="disabled-btn" disabled style="cursor: default; background-color: red; color: white; text-shadow: 1px 1px 0px var(--dark-text);">Out of Stock</span>` 
                        : `<span class="availabe-btn" style="cursor: default; background-color: var(--green); color: white; text-shadow: 1px 1px 0px var(--dark-text);">Available</span>`
                    }
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml; 
    });
}

function filterEvent(event, chosenCategory) {
    category = chosenCategory; 

    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    
    event.currentTarget.classList.add("active");

    renderGrid(); 
}

function setupSearch() {
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("input", () => {
        renderGrid(); 
    });
}

fetchInventory();