import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Create a single supabase client for interacting with your database
const supabase = // Commented out for security
let submission = {} // object to store user input
let ownerSubmission = {} // object to store new owner info if needed
const message=document.getElementById('message-owner'); // message 
const messageVehicle=document.getElementById('message-vehicle');

async function ownerSelected(id) {
    // add all info in supabase
    const vehicleData = {
        VehicleID: submission["VehicleID"],
        Make: submission["Make"],
        Model: submission["Model"],
        Colour: submission["Colour"],
        OwnerID: id
    };
    
    console.log("Inserting vehicle data:", vehicleData);

    const { error } = await supabase
        .from('Vehicles')
        .insert(vehicleData);

    messageVehicle.textContent="Vehicle added successfully";

}

const form = document.querySelector('#AddVehicle')
form.addEventListener('submit', async (event) => { // waits for user to click submit
    event.preventDefault() // prevents the page from refreshing

    const formInputs = form.querySelectorAll('input[name="VehicleID"], input[name="Make"], input[name="Model"], input[name="Colour"],input[name="Name"]');

    formInputs.forEach(element => {
    const value = element.value; // value entered by the user
    const name = element.name; // name of the field
    if (value) {
        submission[name]=value // storing the info
    }
    })

    console.log(submission)

    // check for missing data

    if (submission.VehicleID===undefined || submission.Make===undefined || submission.Model===undefined || submission.Colour===undefined) {
    messageVehicle.textContent="Error";
    return;
    } else {
        messageVehicle.textContent="";
    }

    if (submission.VehicleID==='' || submission.Make==='' || submission.Model==='' || submission.Colour==='') {
    messageVehicle.textContent="Error";
    return;
    } else {
        messageVehicle.textContent="";
    }

    const { data, error } = await supabase
    .from('People')
    .select("*")
    .ilike('Name',`%${submission["Name"]}%`) 

    console.log('Error:', error);
    console.log('Data:', data);

    // if no owner is found

    if (!data || data.length === 0) {
        const resultsContainer = document.getElementById('owner-results');
        resultsContainer.innerHTML = `
            <p>No owner matched your requirement.</p>
            <button id="new-Owner">New owner</button>
        `;
        // display add owner form
        resultsContainer.classList.add('result-card');
        document.getElementById("new-Owner").addEventListener('click', function() {
        document.getElementById('newOwner').style.display = 'block';
        document.getElementById("AddVehicle").style.display = 'None';
        resultsContainer.innerHTML=''
        resultsContainer.style.display="None";
        messageVehicle.textContent='';

        const formOwner = document.querySelector('#newOwner')
        formOwner.addEventListener('submit', async (event) => { 
            event.preventDefault() // prevents the page from refreshing

            const ownerFormInputs = formOwner.querySelectorAll('input[name="Name"], input[name="address"], input[name="dob"], input[name="license"],input[name="expire"]');
            ownerFormInputs.forEach(element => {
            const value = element.value; // value entered by the user
            const name = element.name; // name of the field
            if (value.length>0) {
                ownerSubmission[name]=value // storing the info
            }
            })

            console.log(ownerSubmission);

            // Check if data has any missing information
            if (ownerSubmission.Name===undefined || ownerSubmission.address===undefined || ownerSubmission.dob===undefined || ownerSubmission.license===undefined|| ownerSubmission.expire===undefined) {
            message.textContent="Error";
            return;
            }

            if (ownerSubmission.Name===''|| ownerSubmission.address==='' || ownerSubmission.dob==='' || ownerSubmission.license==='' || ownerSubmission.expire==='') {
            message.textContent="Error";
            return;
            }

            // Check if this owner already exists in the database

            const { data } = await supabase
            .from('People')
            .select()
            .ilike('Name', `%${ownerSubmission["Name"]}%`)
            .ilike('Address', `%${ownerSubmission["address"]}%`)
            .ilike('DOB', `%${ownerSubmission["dob"]}%`)
            .ilike('LicenseNumber', `%${ownerSubmission["license"]}%`)
            .ilike('ExpiryDate', `%${ownerSubmission["expire"]}%`)

            if (data.length>0) {
                message.textContent="Error";
                return;
            }      
                
            const {data:newID} = await supabase
            .from('People')
            .select("*")
            .order('PersonID', { ascending: false })

            console.log("newid: ",newID)

            // if both checks pass add the data
            const { error } = await supabase
            .from('People')
            .insert({PersonID:newID.length+1, Name:ownerSubmission["Name"],Address:ownerSubmission["address"],DOB:ownerSubmission["dob"],LicenseNumber:ownerSubmission["license"],ExpiryDate:ownerSubmission["expire"]})
            message.textContent="Owner added successfully";

            document.getElementById('addVehicle').addEventListener('click', async (event) => {
            event.preventDefault();

            ownerSelected(newID.length + 1);

            });


        })

        });
    return;
    }

    // if owner is found then display owner

    displayResults(data,error);

    function displayResults(data,error) {
        const resultsContainer = document.getElementById('owner-results');
        resultsContainer.innerHTML=''; 

        if (error) {
            resultsContainer.innerHTML=`<p class="error">Error: ${error.message}</p>`;
        }

            data.forEach(person => { 
            const card = document.createElement('div');
            resultsContainer.style.display = 'block';
            card.classList.add('result-card');
            message.textContent="The following Owner(s) can be chosen."
            
            card.innerHTML = `
                <p><strong>Name:</strong> ${person.Name}</p>
                <p><strong>Person ID:</strong>${person.PersonID}</p>
                <p><strong>Address: </strong>${person.Address}</p>
                <p><strong>Date of Birth: </strong>${person.DOB}</p>
                <p><strong>License Number: </strong>${person.LicenseNumber}</p>
                <p><strong>Expiry Date: </strong>${person.ExpiryDate}</p>
                <button class="select-owner" data-id="${person.PersonID}" data-name="${person.Name}">Select owner</button>
                `;
            
            resultsContainer.appendChild(card);

            const selectOwnerButton = card.querySelector('.select-owner');
            selectOwnerButton.addEventListener('click', () => {
            ownerSelected(selectOwnerButton.dataset.id);
            });

        });

    }

})

document.getElementById("owner").addEventListener("input", function () {
  const nameInput = this.value.trim();
  const searchButton = document.getElementById("OwnerSearch");

  if (nameInput !== "") {
    searchButton.removeAttribute("disabled");
  } else {
    searchButton.setAttribute("disabled", "true");
  }
});

