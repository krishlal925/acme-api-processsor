
//global variables
let companies_url = 'https://acme-users-api-rev.herokuapp.com/api/companies';
let products_url = 'https://acme-users-api-rev.herokuapp.com/api/products';
let offerings_url = 'https://acme-users-api-rev.herokuapp.com/api/offerings';
let companies_data, products_data, offerings_data;
let current_query_selection;
let submitButton = document.querySelector('#submit');
let groupedCompaniesByLetter;

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


async function loadData(){
  await Promise.all([axios.get(companies_url), axios.get(products_url), axios.get(offerings_url)])
  .then(function(responses){
    [companies_data, products_data, offerings_data]= responses.map(response => response.data);
    console.log(products_data);
  })

  groupedCompaniesByLetter= groupCompaniesByLetter(companies_data);
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
  else if(current_query_selection === "groupCompaniesByLetter"){
    let inputs = document.querySelector('#company-list-first-letter');
    inputs.classList.remove('d-none');
    submitButton.classList.remove('d-none');
  }
}

//runs selected query
function functionCaller(event){
  event.preventDefault();
  console.dir(event.target.form);

  //Price Range query
  if(current_query_selection === 'Price Range'){

    let minVal = event.target.form[1].value;
    let maxVal = event.target.form[2].value;
    console.log(`min:${minVal}, max:${maxVal}`);
    const productsInPriceRange =  findProductsInPriceRange(products_data, {min:minVal, max: maxVal});
    console.log(productsInPriceRange);

    //create output
    let resultDiv = document.querySelector('#display-results');
    productsHTML = productsInPriceRange.map(function(product){
      return `
        <a href="#" class="list-group-item list-group-item-action">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${product.name}</h5>
            <small>$${product.suggestedPrice}</small>
          </div>
          <p class="mb-1">${product.description}</p>
        </a>
      `
    }).join(' ')

    //print the output
    resultDiv.innerHTML = productsHTML;
  }
}



loadData();

let searchQuery = document.querySelector(`#inlineFormCustomSelectPref`);
searchQuery.addEventListener('change', showInputs)

submitButton.addEventListener('click', functionCaller)










