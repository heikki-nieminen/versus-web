export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        console.log("Text copied to clipboard")
    } catch (err) {
        console.log("ERROR:", err.message)
    }
}