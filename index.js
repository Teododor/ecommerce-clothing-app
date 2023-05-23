const express = require("express");
const {query} = require("express");
const fs = require("fs");
const ejs = require("ejs");
const sass = require("sass");
const Client = require("pg");
const sharp = require("sharp");
const formidable = require("formidable");

const AccessBD = require("./ownModules/accessbd");


const app = express();
app.set("view engine", "ejs");
app.engine('html', ejs.renderFile);

app.use("/resources", express.static(__dirname + "/resources"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));


obGlobal = {
    images: null
}

const dbInstance = AccessBD.getInstance({init: "local"});
const client = dbInstance.getClient();


function createImages() {
    let folderContent = fs.readFileSync(__dirname + "/resources/json/gallery.json");
    let object = JSON.parse(folderContent.toString());

    let medium_dimension = 750;
    let small_dimension = 330;

    obGlobal.images = object.images;


    obGlobal.images.forEach(function (elem) {
        [folderName, extension] = elem.image_location.split(".");
        console.log("------------------------", folderName, extension);
        if (!fs.existsSync((object.gallery_location + "/medium/"))) {
            fs.mkdirSync(object.gallery_location + "/medium/");
        }

        if (!fs.existsSync((object.gallery_location + "/small/"))) {
            fs.mkdirSync(object.gallery_location + "/small/");
        }

        elem.small_image_location = object.gallery_location + "/small/" + folderName + ".webp";
        elem.medium_image_location = object.gallery_location + "/medium/" + folderName + ".webp";
        elem.image_location = object.gallery_location + "/" + elem.image_location;

        sharp(__dirname + "/" + elem.image_location).resize(medium_dimension)
            .toFile(__dirname + "/" + elem.medium_image_location)
            .then(() => console.log("Medium image processed"))
            .catch((err) => console.error(err));

        sharp(__dirname + "/" + elem.image_location).resize(small_dimension)
            .toFile(__dirname + "/" + elem.small_image_location)
            .then(() => console.log("Small image processed"))
            .catch((err) => console.error(err));

    })
}

createImages();

function createErrors() {
    let initialFolderContent = fs.readFileSync(__dirname + "/resources/json/errors.json").toString("utf8");
    let folderContent = fs.readFileSync(__dirname + "/resources/json/errors.json").toString("utf8");


    obGlobal.errors = JSON.parse(folderContent);
}

createErrors();

function renderError(res, identifier, title, text, image) {

}


app.get("/products", function (req, res, next) {

    dbInstance.select({
        table: "unnest(enum_range(null::product_usage))",
        selectedObjects: ["*"]
    }, function (err, result_product_usage) {
        if (err) {
            console.log(err);
        }
        console.log("--------PRODUCT_USAGE--------\n", result_product_usage);


        dbInstance.select({
            table: "unnest(enum_range(null::product_color))",
            selectedObjects: ["*"]
        }, function (err, result_product_color) {
            if (err) {
                console.log(err);
            }
            console.log("--------PRODUCT_COLOR------\n", result_product_color);
            /*        res.render("pages/products", {products : result.rows});*/
            dbInstance.select({
                table: "products",
                selectedObjects: ["*"]
            }, function (err, result_products) {
                if (err) {
                    console.log(err);
                }
                console.log("-----------RESULT-------------\n", result_products);
                res.render("pages/products", {
                    products: result_products.rows,
                    colors: result_product_color.rows,
                    usage: result_product_usage.rows
                });
            })
        })
    })
})


app.get("/register", function(req, res){
    res.render("pages/register",{});
})


console.log("------------------------------OB GLOBAL-------------------------------\n")
console.log(obGlobal);

app.get(["/index", "/"], function (req, res) {
    res.render("pages/index", {images: obGlobal.images});
});

app.get("/*.ejs", function (req, res) {
    renderError(res, 403);
})


app.listen(8080, function (req, res) {
    console.log("THE SERVER HAS STARTED ON PORT 8080");
})
