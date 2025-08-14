async function getColour() {
    /**
     * @description: Launches EyeDropper API and returns picked colour as a hex string. 
     * @param: None
     * @returns; {Promise<string>} A hex colour code (eg. #000000)
     */
    
    const result = await new EyeDropper().open();
    return result.sRGBHex; 
}


// check for click on colour picker 
document.getElementById("pick").addEventListener("click", async() => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const [{ result: hex }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getColour
    });

    document.getElementById('hex').textContent = hex;

    document.getElementById('swatch').style.backgroundColor = hex;
});

// checl for click on copy button
document.getElementById("copy-button").addEventListener("click", () => {
    const copyButton = document.getElementById("copy-button");
    
    const originalBg = copyButton.style.backgroundColor;
    const originalColor = copyButton.style.color;
    
    navigator.clipboard.writeText(document.getElementById('hex').textContent);
    copyButton.style.backgroundColor = "green";
    copyButton.style.color = "white";

    document.querySelector("#copy-button .copy-state").hidden = true;
    document.querySelector("#copy-button .check-state").hidden = false;

    setTimeout(() => {
        copyButton.querySelector(".copy-state").hidden = false;
        copyButton.querySelector(".check-state").hidden = true;
        copyButton.style.backgroundColor = originalBg;
        copyButton.style.color = originalColor;
    }, 1200);
})