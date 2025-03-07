import fetch from "node-fetch";

const api = (app) => {
    app.get("/:pincode", async (req, res) => {
        const { pincode } = req.params;
    
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (Array.isArray(data) && data.length > 0 && data[0].Status === "Success" && data[0].PostOffice) {
                res.json(data[0].PostOffice);
            } else {
                res.status(404).json({ error: "Pincode not found!"});
            }
    
        } catch (error) {
            res.status(500).json({error: "Server error", details: error.message });
        }
    });
    
}

export default api;