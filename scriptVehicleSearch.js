import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Create a single supabase client for interacting with your database
const supabase = createClient('https://qaonyijzkauyijfrskop.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhb255aWp6a2F1eWlqZnJza29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTE4OTMsImV4cCI6MjA1OTc2Nzg5M30.gaiY_X5czj1c-eOafS5mrAoEOWzwaY2kNs_x5kOrlW0')
const form = document.querySelector('#VehicleSearch') 
const resultsContainer = document.getElementById('results');
const message=document.getElementById('message');

form.addEventListener('submit', async (event) => { // waits for user to click submit
    event.preventDefault() // prevents the page from refreshing

    const formInputs = form.querySelectorAll('input[name="Vehicle_id"]');

    let submission = {} // object to store user input
    formInputs.forEach(element => {
    const value = element.value; // value entered by the user
    const name = element.name; // name of the field
    if (value) {
        submission[name]=value // storing the info
    }
    })

    if (!submission["Vehicle_id"]) {
        message.textContent="Error";
        resultsContainer.innerHTML = '';
        return;
    }

    const { data, error } = await supabase
    .from('Vehicles')
    .select(`*, People(*)`)
    .ilike('VehicleID',`%${submission["Vehicle_id"]}%`) 

    console.log(data)
    resultsContainer.innerHTML=''; 
    displayResults(data,error);

    function displayResults(data, error) {

        if (!data || data.length === 0) {
            message.textContent = "No result found.";
            resultsContainer.innerHTML = '';
            return;
        }

        data.forEach(vehicle => { 
            message.textContent="Search successful"
            const card = document.createElement('div');
            resultsContainer.style.display = 'block';
            card.classList.add('result-card');
            
            card.innerHTML = `
                <p><strong>Vehicle ID: </strong>${vehicle.VehicleID || "N/A"}</p>
                <p><strong>Make: </strong>${vehicle.Make || "N/A"}</p>
                <p><strong>Model: </strong>${vehicle.Model || "N/A"}</p>
                <p><strong>Colour: </strong>${vehicle.Colour || "N/A"}</p>
                <p><strong>Owner Name: </strong>${vehicle.People?.Name || "N/A"}</p>
                <p><strong>Owner License Number: </strong>${vehicle.People?.LicenseNumber || "N/A"}</p>
            `;
            
            resultsContainer.appendChild(card);
        });
    }



})