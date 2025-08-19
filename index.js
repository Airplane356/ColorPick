async function getColour() {
    /**
     * @description: Launches EyeDropper API and returns picked colour as a hex string. 
     * @param: None
     * @returns; {Promise<string>} A hex colour code (eg. #000000)
     */
    
    const result = await new EyeDropper().open();
    return result.sRGBHex; 
}

const MRU = []

// check for click on colour picker 
document.getElementById("pick").addEventListener("click", async() => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const [{ result: hex }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getColour
    });

    // check if new hex already exists
    for (let i=0; i < MRU.length; i++) {
        if (MRU[i] == hex) { 
            MRU.splice(i, 1);
            break;
        }
    }

    // limit at 5 hex 
    if (MRU.length > 4) {    
        MRU.pop();
        MRU.unshift(hex);
    } else { 
        MRU.unshift(hex);
    }
    
    updateColors();
    
});

function updateColors() {
    const placeholder = document.getElementById("placeholder");
    if (placeholder) { 
        placeholder.remove();
    }

    const recent = document.getElementById("recent-list");

    while (recent.firstChild) { 
        recent.removeChild(recent.firstChild);
    }

    for (let i=0; i < MRU.length; i++) { 
        const item = document.createElement("div");
        const swatch = document.createElement("div"); 
        const newHex = document.createElement("div");
        const copy = document.createElement("button");

        swatch.style.cssText = "width: 55px; height: 55px; border-radius: 8px; margin: auto; background-color: #464d56; border: solid 1px gray;"
        swatch.style.backgroundColor = MRU[i]
        
        newHex.textContent = MRU[i];
        newHex.style.cssText = "text-align: center; margin: auto; color: white";

        copy.style.cssText = "width: fit-content; margin: 10px auto; background-color: #67adfe; border-radius: 8px;"
        copy.className = "copy-button"
        copy.dataset.hex = MRU[i];
        copy.textContent = "📋 Copy"

        item.appendChild(swatch);
        item.appendChild(newHex);
        item.appendChild(copy);

        recent.append(item);
        item.style.cssText = "padding: 8px 12px; border-radius: 8px; background-color: #464d56; display: grid; grid-template-columns: 1fr 1fr 1fr;"
    }
}

document.getElementById("recent-list").addEventListener("click", async (e) => {
    const btn = e.target.closest("button.copy-button");
    if (!btn) return;

    const hex = btn.dataset.hex;
    await navigator.clipboard.writeText(hex);

    const old = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(() => (btn.textContent = old), 900);
})