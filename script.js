`use strict`;

const gridRates = document.getElementById('grid-rates');
const timeStamp = document.getElementById('timestamp');
const search = document.getElementById('search');
const radioButtons = document.querySelectorAll('input[name="target"]');
const selectCurrency = document.getElementById('select-currency');

let searchFor = '';
let targetCurrency = 'USD';

const accessKey = `27c0d66910358dea61d80f53450e98cf`;
const live = `http://api.coinlayer.com/api/live?access_key=${accessKey}`;

// tests with regex
function onlyLettersAndNumbers(str) {
  return /^[A-Za-z0-9]*$/.test(str);
}

// declare function
// takes url as parameter
// gets data associated with url
// takes targetCurrency as parameter
async function getData(url = '', targetCurrency = 'USD') {
  console.log('The currency that would be displaying if I had access to it: ' + targetCurrency + ' This would be used to request a different target currency.');
  // fetch returns a promise
  const response = await fetch(url, {
    "targetCurrency": "USD"
  });
  // response.json() returns a promise that parses itself into json
  return response.json();
}

// this function displays data
function viewRates (data) {
  // console.log(data.rates);

  // display timestamp
  timeStamp.innerText = `${data.timestamp}`;

  //reset display if event handler is fired and function is called again
  gridRates.innerHTML = `<span class="currency"><strong>CRYPTO</strong></span><span class="rate"><strong>${targetCurrency}</strong></span>`;

  // if no search letter, display all
  if (searchFor === '') {
    for (rate in data.rates) {
      gridRates.insertAdjacentHTML('beforeend', `<span class="currency">${rate}</span><span class="rate">${data.rates[rate]}</span>`);
    }
  } else if (searchFor != '') {
    for (rate in data.rates) {
      // else display only those with matching 1st letter
      if (rate.charAt(0) === searchFor.charAt(0)) {
        gridRates.insertAdjacentHTML('beforeend', `<span class="currency">${rate}</span><span class="rate">${data.rates[rate]}</span>`);
      }
    }
  }
}

//live is the requested url
getData(live)
  // the data parameter of the .then arrow is the promise returned by response.json(), which is returned by getData()
  // I think?
  .then( (data) => {
    console.log(data);
    viewRates(data);
    // I could return something here and it would be fed into the next .then arrow parameter
  })

  search.addEventListener('keyup', (e) => {
    console.log(e);
    // searches
    if (onlyLettersAndNumbers(e.key) && searchFor.length === 0) {
      searchFor += e.key.toUpperCase();
    } else if (e.key === 'Backspace') {
      searchFor = '';
    }
    console.log(searchFor);

    // resets data
    // there is probably a more efficient way of doing this, requiring fewer api calls
    // maybe by only making one api call every hour when the data is updated, and saving it into an object that can then be referenced for the next hour, til the data changes and is updated
    getData(live, targetCurrency)
      .then( (data) => {
        viewRates(data);
      })
  })

  // this does nothing because i only have the free plan, which doesnt give access to target currencies other than USD
  // it console logs the target currency
  selectCurrency.addEventListener('click', (e) => {
    // checks if radio buttons are checked
    for (let radioButton of radioButtons) {
      if (radioButton.checked) {
        targetCurrency = radioButton.value;
      }
    }
    // resets data
    getData(live, targetCurrency)
      .then( (data) => {
        console.log(data);
        viewRates(data);
      })
  })


