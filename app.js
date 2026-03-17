import express from "express";
import { engine } from "express-handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------- HANDLEBARS SETUP ---------------
app.engine("hbs", engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts",
    partialsDir: "views/partials"
}));

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ------------ LOAD PRODUCTS.JSON -------------
let products = [];
try {
    products = JSON.parse(
        fs.readFileSync(path.join(__dirname, "public/data/products.json"))
    );
    console.log("Loaded products.json");
} catch (err) {
    console.log("ERROR loading products.json:", err);
}

// ---------- GROUPING FUNCTION ------------
function groupIntoSlides(list, perSlide = 2) {
    const slides = [];
    for (let i = 0; i < list.length; i += perSlide) {
        slides.push(list.slice(i, i + perSlide));
    }
    return slides;
}

// -------------- TESTIMONIALS ----------------
const testimonials = [
    {
        name: "John Doe",
        verified: true,
        stars: ["-fill", "-fill", "-fill", "-fill", "-half"],
        text: "This coffee is amazing! I start every day with a cup of Ctrl Alt Delight.",
        date: "3 days ago"
    },
    {
        name: "Jane Smith",
        verified: true,
        stars: ["-fill", "-fill", "-fill", "-fill", "-fill"],
        text: "Dark Mode Roast is my go-to for late-night coding.",
        date: "5 days ago"
    },
    {
        name: "Alter",
        verified: true,
        stars: ["-fill", "-fill", "-fill", "-fill", "-fill"],
        text: "Dark Mode Roast is my go-to for late-night coding.",
        date: "5 days ago"
    }
];

// ---------------- FILTER PRODUCTS BY CATEGORY ----------------
// Best Sellers
const bestSellers = products.filter(p => p.categories.includes("Best Seller"));
const bestSellerSlides2 = groupIntoSlides(bestSellers, 2);
const bestSellerSlides3 = groupIntoSlides(bestSellers, 3);
const bestSellerSlides4 = groupIntoSlides(bestSellers, 4);

// New Arrivals
const newArrivals = products.filter(p => p.categories.includes("New"));
const newArrivalSlides2 = groupIntoSlides(newArrivals, 2);
const newArrivalSlides3 = groupIntoSlides(newArrivals, 3);
const newArrivalSlides4 = groupIntoSlides(newArrivals, 4);

// Seasonal
const seasonal = products.filter(p => p.categories.includes("Seasonal / Limited Edition"));
const seasonalSlides2 = groupIntoSlides(seasonal, 2);
const seasonalSlides3 = groupIntoSlides(seasonal, 3);
const seasonalSlides4 = groupIntoSlides(seasonal, 4);

// --------- ROUTES ---------
app.get("/", (req, res) => {
    res.render("index", {
        isHome: true,

        title: "Coffee Overflow | Coffee for Developers",
        metaDescription: "Coffee Overflow is a developer-focused coffee brand and café built around community, collaboration and great coffee.",
        metaKeywords: "coffee for developers, coding cafe, coffee overflow, programmer coffee, developer community",

        bestSellerSlides2,
        bestSellerSlides3,
        bestSellerSlides4,

        newArrivalSlides2,
        newArrivalSlides3,
        newArrivalSlides4,

        seasonalSlides2,
        seasonalSlides3,
        seasonalSlides4,

        testimonials
    });
});

app.get("/shop", (req, res) => {
    res.render("shop", {
        isShop: true,
        products,

        title: "Shop Coffee | Coffee Overflow",
        metaDescription: "Browse developer-inspired coffee blends, seasonal specials and accessories at Coffee Overflow.",
        metaKeywords: "coffee shop, buy coffee online, developer coffee, coffee blends, coffee overflow shop"
    });
});

app.get("/product/:id", (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.redirect("/shop");

    res.render("product", {
        product,

        title: `${product.name} | Coffee Overflow`,
        metaDescription: `Discover ${product.name}, a ${product.roast.toLowerCase()} roast with ${product.taste.toLowerCase()} notes, crafted for developers.`,
        metaKeywords: `${product.name}, ${product.roast} coffee, developer coffee, coffee overflow`
    });
});

app.get("/membership", (req, res) => {
    res.render("membership", {
        isMembership: true,

        title: "Membership | Coffee Overflow",
        metaDescription: "Join the Coffee Overflow membership to unlock exclusive perks, discounts and community benefits.",
        metaKeywords: "coffee overflow, membership, coffee subscription, developer cafe membership"
    });
});

app.get("/membership-checkout", (req, res) => {
    res.render("membership-checkout", {
        isMembershipCheckout: true,

        title: "Membership Checkout | Coffee Overflow",
        metaDescription: "Complete your Coffee Overflow membership signup and join our developer-focused coffee community.",
        metaKeywords: "membership checkout, coffee overflow, subscription"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        isAbout: true,
        testimonials,

        title: "About Us | Coffee Overflow",
        metaDescription: "Learn about Coffee Overflow, a developer-focused coffee brand and café built around community and collaboration.",
        metaKeywords: "about, coffee overflow, developer cafe, coding cafe, coffee community"
    });
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        isContact: true,

        title: "Contact | Coffee Overflow",
        metaDescription: "Get in touch with Coffee Overflow. Find our café, send a message or reach out to our team.",
        metaKeywords: "contact, coffee overflow, coffee, cafe, leitrim coffee shop"
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        isLogin: true,

        title: "Login | Coffee Overflow",
        metaDescription: "Log in to your Coffee Overflow account to manage orders, membership and profile details.",
        metaKeywords: "coffee overflow, login, user login, account"
    });
});

app.get("/register", (req, res) => {
    res.render("register", {
        isRegister: true,

        title: "Register | Coffee Overflow",
        metaDescription: "Create a Coffee Overflow account to shop, join the community and manage your profile.",
        metaKeywords: "register, coffee overflow, create account, community signup"
    });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        isProfile: true,

        title: "My Profile | Coffee Overflow",
        metaDescription: "Manage your Coffee Overflow profile, delivery details and saved payment information.",
        metaKeywords: "user profile, coffee overflow, account settings, profile"
    });
});

app.get("/cart", (req, res) => {
    res.render("cart", {
        isCart: true,

        title: "Your Cart | Coffee Overflow",
        metaDescription: "Review your Coffee Overflow cart, update quantities and proceed to checkout.",
        metaKeywords: "shopping cart, coffee overflow, cart, checkout"
    });
});

app.get("/checkout", (req, res) => {
    res.render("checkout", {
        isCheckout: true,

        title: "Checkout | Coffee Overflow",
        metaDescription: "Complete your Coffee Overflow purchase securely with our checkout process.",
        metaKeywords: "coffee overflow, checkout, payment"
    });
});



// ------------ SERVER -----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`CoffeeOverflow running on port ${PORT}`);
});
