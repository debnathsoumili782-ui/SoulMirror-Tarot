const searchInput = document.getElementById("cardSearch");
const cards = document.querySelectorAll(".library-card");
const filterButtons = document.querySelectorAll(".filter-btn");

let activeFilter = "all";

function filterCards() {

    const query = searchInput.value.toLowerCase();

    cards.forEach(card => {

        const name = card.dataset.name;
        const category = card.dataset.category;

        const matchesName = name.includes(query);
        const matchesCategory =
            activeFilter === "all" ||
            category === activeFilter;

        if (matchesName && matchesCategory) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

searchInput.addEventListener("input", filterCards);

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        activeFilter = button.dataset.filter;

        filterCards();

    });

});