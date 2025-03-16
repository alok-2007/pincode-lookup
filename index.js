let currentTab = 'pincode';

function changeTab(element, tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // add active class to clicked tab
    element.classList.add('active');
    currentTab = tabName;

    // Change placeholder based on tab
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    
    if (tabName === 'pincode') {
        searchInput.placeholder = 'Enter 6-digit pincode';
        searchInput.maxLength = 6;
    } else if (tabName === 'area') {
        searchInput.placeholder = 'Enter area/locality name';
        searchInput.maxLength = 50;
    } else {
        searchInput.placeholder = 'Enter district name';
        searchInput.maxLength = 50;
    }
}

function searchPincode() {
    const searchValue = document.getElementById('search-input').value.trim();

    if (!searchValue) {
        alert('Please enter a search term');
        return;
    }

    if (currentTab === 'pincode' && !/^\d{6}$/.test(searchValue)) {
        alert('Please enter a valid 6-digit pincode');
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('no-results').style.display = 'none';

    fetch(`https://pincode-lookup-alok-kumars-projects-0395fbc4.vercel.app/${searchValue}`)
        .then(response => response.json())
        .then(postOffices => {
            let output = `<h3 class="result-title">Result for Pincode: ${searchValue}</h3><div class="result-grid">`;
            postOffices.forEach(office => {
                output += `
                    <div>
                        <h4>${office.Name}, ${office.District}</h4>
                        <div class="result-details">
                            <div>
                                <p class="detail-item"><span class="detail-label">Pincode: ${searchValue}</span></p>
                                <p class="detail-item"><span class="detail-label">Post Office: ${office.Name}</span></p>
                                <p class="detail-item"><span class="detail-label">District: ${office.District}</span></p>
                            </div>
                            <div>
                                <p class="detail-item"><span class="detail-label">State: ${office.State}</span></p>
                                <p class="detail-item"><span class="detail-label">Division: ${office.Division}</span></p>
                                <p class="detail-item"><span class="detail-label">Region: ${office.Region}</span></p>
                            </div>
                        </div>
                        <div class="map-container">
                            <p>Map view would be displayed here(coming soon😊)!</p>
                        <div>
                    </div>
                `;
                output += `</div>`;
            })
            document.getElementById('loading').style.display = 'none';
            document.getElementById('results-container').style.display = 'block';
            document.getElementById("result-card").innerHTML = output;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('no-results').style.display = 'block';
            document.getElementById("no-results").innerText = "Failed to fetch data. Please try again.";
            alert("Internet issue 😒 Let's give an another shot!");
        });

}

document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPincode();    
    }
})

document.getElementById('search-button').addEventListener('click', () => {
    searchPincode();
})
