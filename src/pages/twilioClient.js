fetch("http://localhost:5000/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        to: "+1234567890", 
        message: "High AQI ALert!! Please stay safe"
    })
})
.then(response => response.json())
.then(data => console.log("SMS Sent:", data))
.catch(error => console.error("Error:", error));
