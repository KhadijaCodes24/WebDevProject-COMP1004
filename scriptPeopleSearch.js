import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Create a single supabase client for interacting with your database
const supabase = // commented out for security
const message=document.getElementById('message');
const resultsContainer = document.getElementById('results');

const form = document.querySelector('#PeopleSearch') // looks for PeopleSearch form
form.addEventListener('submit', async (event) => { // waits for user to click submit
event.preventDefault() // prevents the page from refreshing

const formInputs = form.querySelectorAll('input[name="name"], input[name="license_number"]');

let submission = {} // object to store user input
formInputs.forEach(element => {
const value = element.value; // value entered by the user
const name = element.name; // name of the field
if (value) {
    submission[name]=value // storing the info
}
})

console.log(submission);
if (!submission["name"] && !submission["license_number"]) {
    message.textContent="Error";
    resultsContainer.innerHTML = '';
    return;
}

if (submission["name"] && submission["license_number"]) {
    message.textContent="Error";
    resultsContainer.innerHTML = '';
    return;
}


if (submission["name"]) {
    const { data, error } = await supabase
    .from('People')
    .select()
    .ilike('Name',`%${submission["name"]}%`)

    displayResults(data,error);
} else {
    const { data, error } = await supabase
    .from('People')
    .select()
    .ilike('LicenseNumber',`%${submission["license_number"]}%`)

    console.log(data);
    displayResults(data,error);
}

    function displayResults(data,error) {
    resultsContainer.innerHTML=''; 

    if (error) {
        resultsContainer.innerHTML=`<p class="error">Error: ${error.message}</p>`;
        message.textContent="Error";
        return;
    }

    if (!data|| data.length === 0) {
        message.textContent="No result found";
        return;
    } else {
        message.textContent="Search successful"
        resultsContainer.style.display = 'block';
        data.forEach(person => { 
        const card = document.createElement('div');
        card.classList.add('result-card');

        card.innerHTML = `
            <p>${person.Name}</p>
            <p><strong>personid:</strong> ${person.PersonID}</p>
            <p><strong>Address:</strong> ${person.Address}</p>
            <p><strong>Date of Birth:</strong> ${person.DOB}</p>
            <p><strong>License Number</strong> ${person.LicenseNumber}</p>
            <p><strong>Expiry Date</strong> ${person.ExpiryDate}</p>
        `;
        
        resultsContainer.appendChild(card);
        });
    }

}

})

