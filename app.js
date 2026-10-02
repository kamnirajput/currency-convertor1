const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// ADD CURRENCIES TO DROPDOWN
for (let select of dropdowns) {

    for (let currCode in countryList) {

        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }

        if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


// UPDATE EXCHANGE RATE
const updateExchangeRate = async () => {

    console.log("Button clicked!");

    let amount = document.querySelector(".amount input");

    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    console.log("Amount:", amtVal);
    console.log("From:", fromCurr.value);
    console.log("To:", toCurr.value);


    const URL =
        `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

    console.log("API URL:", URL);


    try {

        let response = await fetch(URL);

        console.log("Response:", response);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        let data = await response.json();

        console.log("API Data:", data);


        let rate =
            data[fromCurr.value.toLowerCase()]
                [toCurr.value.toLowerCase()];


        console.log("Rate:", rate);


        let finalAmount = amtVal * rate;


        msg.innerText =
            `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    }

    catch (error) {

        console.log("ERROR:", error);

        msg.innerText = "Unable to get exchange rate.";

    }
};


// UPDATE FLAG
const updateFlag = (element) => {

    let currCode = element.value;

    let countryCode = countryList[currCode];

    let newSrc =
        `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img =
        element.parentElement.querySelector("img");

    img.src = newSrc;
};


// BUTTON
btn.addEventListener("click", (evt) => {

    evt.preventDefault();

    updateExchangeRate();

});


// PAGE LOAD
window.addEventListener("load", () => {

    updateExchangeRate();

    updateFlag(fromCurr);
    updateFlag(toCurr);

});