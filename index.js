const pincodeInput = document.getElementById('pincodeInput');
const pincodeSearchBtn = document.getElementById('pincodeSearchBtn');
const result = document.getElementById('result');

pincodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        pincodeSearchBtn.click();
    }
});

pincodeSearchBtn.addEventListener('click', () => {
    let pincode = pincodeInput.value.trim();

    if (pincode === "") {
        result.innerHTML = "Please enter a pincode!";
        return
    }

    fetch(`http://localhost:3009/${pincode}`)
        .then(response => response.json())
        .then(postOffices => {
            if (Array.isArray(postOffices)) {
                let output = `<h2>Results for Pincode: ${pincode}</h2>`;

                postOffices.forEach(office => {
                    output += `
                        <div class="post-office">
                            <h3 class="post-office-header">Details of Post Office ${office.Name}, ${office.District}</h3>
                            <p><strong>Name:</strong> ${office.Name}</p>
                            <p><strong>Branch Type:</strong> ${office.BranchType}</p>
                            <p><strong>Delivery Status:</strong> ${office.DeliveryStatus}</p>
                            <p><strong>Circle:</strong> ${office.Circle}</p>
                            <p><strong>District:</strong> ${office.District}</p>
                            <p><strong>Division:</strong> ${office.Division}</p>
                            <p><strong>Region:</strong> ${office.Region}</p>
                            <p><strong>Pincode:</strong> ${pincode}</p>
                            <p><strong>State:</strong> ${office.State}</p>
                            <p><strong>Country:</strong> ${office.Country}</p>
                        </div>
                    `;
                })
                result.innerHTML = output;
            } else {
                result.innerHTML = "Pincode not found!";
            }
        })
        .catch(error => {
            result.innerHTML = `Error fetching data! - ${error}`;
        });
});