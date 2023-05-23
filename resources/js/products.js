/*
window.addEventListener("load", function(){

    console.log("LOADED WINDOWS (MESSAGE FROM window.addEventListener");

    this.document.getElementById("price-input").onchange = function(){
        console.log(this.value);
        document.getElementById('infoRange').innerHTML = `${this.value}`;
    }


    this.document.getElementById("sortAlphabetical").onclick = function(){
        console.log("SORT ALPHABETICAL CLICKED");
    }
})
*/

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM CONTENT LOADED (MESSAGE FROM document.addEventListener)");


    document.getElementById("price-input").onchange = function () {
        console.log(this.value);
        document.getElementById('infoRange').innerHTML = `${this.value}`;
    }

    document.getElementById("sortAlphabeticalButton").onclick = function () {
        console.log("Sort Alphabetical Button Clicked!");

        let products = document.getElementsByClassName("product");
        let vProducts = Array.from(products);

        vProducts.sort(function (a, b) {

            let price_a = parseFloat(a.getElementsByClassName("price-info")[0].innerHTML);
            let price_b = parseFloat(b.getElementsByClassName("price-info")[0].innerHTML);

            console.log(price_a, " ", price_b);


            if (price_a === price_b) {
                let name_a = a.getElementsByClassName("price-info")[0].innerHTML;
                let name_b = b.getElementsByClassName("price-info")[0].innerHTML;

                return name_a.localeCompare(name_b);
            }

            return price_a - price_b;

        })


        for (let product of vProducts) {/*
            console.log("Product:\n", product);*/
            product.parentNode.appendChild(product);
        }
    }


    document.getElementById("sortUnalphabeticalButton").onclick = function () {
        console.log("Sort UNAlphabetical Button Clicked!");

        let products = document.getElementsByClassName("product");
        let vProducts = Array.from(products);

        vProducts.sort(function (a, b) {

            let price_a = parseFloat(a.getElementsByClassName("price-info")[0].innerHTML);
            let price_b = parseFloat(b.getElementsByClassName("price-info")[0].innerHTML);

            console.log(price_a, " ", price_b);


            if (price_a === price_b) {
                let name_a = a.getElementsByClassName("price-info")[0].innerHTML;
                let name_b = b.getElementsByClassName("price-info")[0].innerHTML;

                return name_a.localeCompare(name_b);
            }

            return price_b - price_a;

        })


        for (let product of vProducts) {/*
            console.log("Product:\n", product);*/
            product.parentNode.appendChild(product);
        }
    }

    document.getElementById("filter").onclick = function () {

        console.log("FILTER BUTTON CLICKED!");

        let validationCondition = true;
        let inpName = document.getElementById("name-input").value.toLowerCase().trim();
        let inpPrice = document.getElementById("price-input").value;
        let inpCategory = document.getElementById("usage-category").value;

        let colorCategory = [];


        console.log("validation condition : ", validationCondition);
        console.log("inp name : ", inpName);
        console.log("inp price : ", inpPrice);
        console.log("inpCategory : ", inpCategory);

        //get the parent elements and all its child checkboxes


        const colorSelect = document.getElementById("inp-color-type");
        const checkboxes = colorSelect.querySelectorAll(`input[type="checkbox"]`);

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                colorCategory.push(checkbox.value);
            }
        })


        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('click', function () {

                // Clear the colorCategory array and add the values of the checked checkboxes to it
                colorCategory = [];
                checkboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        colorCategory.push(checkbox.value);
                    }
                });

            });
        });


        validationCondition = validationCondition && inpName.match(new RegExp('^(?:[^0-9].*)?$'));


        if (!validationCondition) {
            alert("THE INPUTS ARE WRONG");
        }


        let products = document.getElementsByClassName("product");

        console.log("YOU HAVE THE FOLLOWING PRODUCTS:\n", products);

        for(let product of products){
            let cond1 = false;
            let cond2 = false;
            let cond3 = false;
            let cond4 = false;

            product.style.display = "none";
            let name = product.getElementsByClassName("val-name")[0].innerHTML.toLowerCase().trim();
            let price = product.getElementsByClassName("price-info")[0].innerHTML;
            let color = product.getElementsByClassName("color-info")[0].innerHTML;

            if(name.includes(inpName)){
                cond1 = true;
            }
            let category = product.getElementsByClassName("category-quality")[0].innerHTML.toLowerCase().trim();
            if(inpCategory === "all" || (category === inpCategory)){
                cond2 = true;
            }

            let productPrice = parseInt(product.getElementsByClassName("price-info")[0].innerHTML);
            if(inpPrice <= productPrice){
                 cond3 = true;
            }

            for(let element of colorCategory){
                if(element === color){
                    cond4 = true;
                }
            }


            if(colorCategory.length === 0)
                cond4 = true;

            if(cond1 && cond2 && cond3 && cond4)
                product.style.display = "block";



        }



    }


    document.getElementById("reset").onclick = function() {
        let products = document.getElementsByClassName("product");

        for(let product of products){
            let cond1 = false;
            let cond2 = false;
            let cond3 = false;
            let cond4 = false;

            product.style.display = "block";
        }

        //reset the filters in page

        document.getElementById("name-input").value = "";
        document.getElementById("price-input").value = 0;
        document.getElementById("infoRange").innerHTML = 0;
        document.getElementById("usage-category").value = "all";

        const checkboxes = document.querySelectorAll('#inp-color-type input[type="checkbox"]');

// Loop through all the checkboxes and set their checked property to false
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });



    }


    document.getElementById("date").onclick = function() {
        let date = document.getElementById("date").value;
        console.log("DATEEEEEEEEEEEEEEEEEEE\n", date);
    }


})
