let currentTab = 'pincode';

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPostition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPostition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    //fetch location detials using OpenStreetMap Nomination API
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            let address = data.address;
            let pincode = address.postcode || "Not Found";
            let city = address.city || address.town || address.village || "Unknown";
            let state = address.state || "Unknown";

            document.getElementById('results-container').style.display = 'block';

            document.getElementById("result-card").innerHTML = `
                <div class="result-grid">
                    <div>
                        <div class="result-details">
                            <div>
                                <p class="detail-item"><span class="detail-label">Pincode: ${pincode}</span></p>
                                <p class="detail-item"><span class="detail-label">City: ${city}</span></p>
                                <p class="detail-item"><span class="detail-label">State: ${state}</span></p>
                            </div>
                        </div>
                        <div class="map" id="map-current"></div>
                    </div>
                </div>
            `
            // show map
            setTimeout(() => {
                let mapContainer = document.getElementById("map-current");
                if (!mapContainer) return;

                // Check if a Leaflet map already exists and remove it
                if (mapContainer._leaflet_id) {
                    mapContainer.innerHTML = ""; // Clear previous map instance
                }

                let map = L.map('map-current').setView([lat, lon], 12);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`You are here!<br>Pincode: ${pincode}`)
                    .openPopup();

                map.invalidateSize(); // Ensure correct map alignment
            }, 200);
        })
        .catch(error => console.error("Error fetching location details:", error));
}

function showError(error) {
    let errorMsg = "An unknown error occurred.";
    if (error.code === error.PERMISSION_DENIED) errorMsg = "User denied the request for Geolocation.";
    else if (error.code === error.POSITION_UNAVAILABLE) errorMsg = "Location information is unavailable.";
    else if (error.code === error.TIMEOUT) errorMsg = "The request to get user location timed out.";
    
    alert(errorMsg);
}


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

    // Delay map resizing to ensure proper alignment
    setTimeout(() => {
        document.querySelectorAll('.map').forEach(mapDiv => {
            if (mapDiv._leaflet_id) {
                mapDiv.invalidateSize();
            }
        });
    }, 300);
}

function initLeafletMap(lat, lng, mapId) {
    let mapContainer = document.getElementById(mapId);
    if (!mapContainer) return;

    if (mapContainer._leaflet_id) {
        mapContainer.innerHTML = "";
    }

    setTimeout(() => {
        let map = L.map(mapId).setView([lat, lng], 12);

        L.tileLayer('https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([lat, lng]).addTo(map)
            .bindPopup("Post Office Location")
            .openPopup();

        map.invalidateSize();
    }, 200);
}

// function to get lat and lng
function getCoordinatesFromPostOffice(postOffice, mapId) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(postOffice)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let location = data[0];
                initLeafletMap(parseFloat(location.lat), parseFloat(location.lon), mapId);
            } else {
                console.error(`Location not found for ${postOffice}`);
            }
        })
        .catch(error => console.error("Error fetching location:", error));
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
                        <div class="map" id="map-${office.Name.replace(/\s+/g, '')}"></div>
                    </div>
                `;
                
            })

            output += `</div>`;

            document.getElementById('loading').style.display = 'none';
            document.getElementById('results-container').style.display = 'block';
            document.getElementById("result-card").innerHTML = output;

            postOffices.forEach(office => {
                getCoordinatesFromPostOffice(`${office.Name}, ${office.District}, ${office.State}, India`, `map-${office.Name.replace(/\s+/g, '')}`);
            });
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

document.getElementById('get-current-location-pincode-btn').addEventListener('click', () => {
    getLocation();
})