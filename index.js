async function getColour() {
    /**
     * @description: Launches EyeDropper API and returns picked colour as a hex string. 
     * @param: None
     * @returns; {Promise<string>} A hex colour code (eg. #000000)
     */
    
    const result = await new EyeDropper().open();
    return result.sRGBHex; 
}


document.getElementById("pick").addEventListener("click", async() => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const [{ result: hex }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getColour
    });

    document.getElementById('result').textContent = hex;
});