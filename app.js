
//global variables
let companies_url = 'https://acme-users-api-rev.herokuapp.com/api/companies';
let products_url = 'https://acme-users-api-rev.herokuapp.com/api/products';
let offerings_url = 'https://acme-users-api-rev.herokuapp.com/api/offerings';
let companies_data, products_data, offerings_data;
let current_query_selection;
let submitButton = document.querySelector('#submit');
let groupedCompaniesByLetter;
let groupedCompaniesByState;



//function #1
function findProductsInPriceRange(products, user_input){
  let filteredProducts = products.filter(function(product){
    return (product.suggestedPrice > user_input.min && product.suggestedPrice < user_input.max)
  });

  return filteredProducts;
}


//function #2
function groupCompaniesByLetter(companies, firstLetter){
  let companiesObj = {};

  companies.forEach(function(company){
    let key = company.name[0];

    //add company to the specific key if the key already exists
    if (companiesObj[key]){
      companiesObj[key].push(company)
    }
    //create the key value pair if it doesn't exist yet
    else{
      companiesObj[key] =[];
      companiesObj[key].push(company);
    }
  });

  //create dropdown menu based on keys
  let keys = Object.keys(companiesObj);
  keys.sort();
  let dropDownLettersListHTML = keys.map(function(key){
    return `
    <option value="${key}">${key}</option>
    `
  }).join(' ');

  let dropDownLettersList = document.querySelector('#companyListFirstLetter');
  console.log(dropDownLettersList);
  dropDownLettersList.innerHTML = dropDownLettersListHTML;

  return companiesObj;
}


//function #3
function groupCompaniesByState(companies){
  let companiesObj= {};
  companies.forEach(function(company){
    let key = company.state;

    //add company to the specific key if the key already exists
    if (companiesObj[key]){
      companiesObj[key].push(company)
    }
    //create the key value pair if it doesn't exist yet
    else{
      companiesObj[key] =[];
      companiesObj[key].push(company);
    }
  });

  //create dropdown menu based on keys
  let keys = Object.keys(companiesObj);
  keys.sort();
  let dropDownLettersListHTML = keys.map(function(key){
    return `
    <option value="${key}">${key}</option>
    `
  }).join(' ');

  let dropDownList = document.querySelector('#companyListByState');
  console.log(dropDownList);
  dropDownList.innerHTML = dropDownLettersListHTML;

  return companiesObj;
}


async function loadData(){
  await Promise.all([axios.get(companies_url), axios.get(products_url), axios.get(offerings_url)])
  .then(function(responses){
    [companies_data, products_data, offerings_data]= responses.map(response => response.data);
    console.log(products_data);
  })

  //groupedCompaniesByState= groupCompaniesByState(companies_data);
  //console.log(groupedCompaniesByState);
}


function showInputs({target}){
  current_query_selection = target.value;

  //hide all the input forms and the submit button upon a new selection
  let input_divs = document.querySelectorAll('.input_divs');
  input_divs.forEach(function(input_div){
    input_div.classList.add('d-none');
  });

  //if the Price Range selection is chosen, show the min/max input fields and submit button
  if (current_query_selection === "Price Range"){
    let inputs = document.querySelector('#price-range-input');
    inputs.classList.remove('d-none');
    submitButton.classList.remove('d-none');
  }
  //if group by first letter is chosen, show corresponding inputs
  else if(current_query_selection === "groupCompaniesByLetter"){
    groupedCompaniesByLetter= groupCompaniesByLetter(companies_data);

    let inputs = document.querySelector('#company-list-first-letter');
    inputs.classList.remove('d-none');
    submitButton.classList.remove('d-none');
  }
  //if group by state is chosen, show corresponding inputs
  else if(current_query_selection === "groupCompaniesByState"){
    groupedCompaniesByState= groupCompaniesByState(companies_data);

    let inputs = document.querySelector('#company-list-state');
    inputs.classList.remove('d-none');
    submitButton.classList.remove('d-none');
  }
}

//runs selected query
function submitInput(event){
  event.preventDefault();
  console.dir(event.target.form);
  let resultDiv = document.querySelector('#display-results');

  //Price Range query
  if(current_query_selection === 'Price Range'){

    let minVal = event.target.form[1].value;
    let maxVal = event.target.form[2].value;
    const productsInPriceRange =  findProductsInPriceRange(products_data, {min:minVal, max: maxVal});

    //create output
    let productsHTML = productsInPriceRange.map(function(product){
      return `
        <a href="#" class="list-group-item list-group-item-action">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${product.name}</h5>
            <small>$${product.suggestedPrice}</small>
          </div>
          <p class="mb-1">${product.description}</p>
        </a>
      `
    }).join(' ');

    //print the output
    resultDiv.innerHTML = productsHTML;
  }
  //groupCompaniesByLetter query
  else if (current_query_selection === 'groupCompaniesByLetter'){
    let selectedKey = event.target.form[3].value;
    console.log(selectedKey);
    console.dir(groupedCompaniesByLetter[selectedKey]);

    //create output
    let companiesHTML = groupedCompaniesByLetter[selectedKey].map(function(company){
      return `
        <a href="#" class="list-group-item list-group-item-action">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${company.name}</h5>
            <small>${company.phone}</small>
          </div>
          <p class="mb-1">${company.catchPhrase}</p>
        </a>
      `
    }).join(' ');

    //print output
    resultDiv.innerHTML = companiesHTML;
  }
  //groupCompanies by State query
  else if (current_query_selection === 'groupCompaniesByState'){
    let selectedKey = event.target.form[4].value;
    console.log(selectedKey);
    console.dir(groupedCompaniesByState[selectedKey]);

    //create output
    let companiesHTML = groupedCompaniesByState[selectedKey].map(function(company){
      return `
        <a href="#" class="list-group-item list-group-item-action">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${company.name}</h5>
            <small>${company.phone}</small>
          </div>
          <p class="mb-1">${company.catchPhrase}</p>
        </a>
      `
    }).join(' ');

    //print output
    resultDiv.innerHTML = companiesHTML;
  }
}

loadData();

let searchQuery = document.querySelector(`#inlineFormCustomSelectPref`);
searchQuery.addEventListener('change', showInputs)

submitButton.addEventListener('click', submitInput)










