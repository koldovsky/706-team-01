(function () {
	const iconBurger = document.querySelector(".main-nav__burger");
	const navigationsBody = document.querySelector(".main-nav");
	iconBurger.addEventListener("click", function (e) {
		document.body.classList.toggle("lock");
		iconBurger.classList.toggle("active");
		navigationsBody.classList.toggle("active");
	});

	const navLinks = document.querySelectorAll(".main-nav__link");
	navLinks.forEach((navLink) => {
		navLink.addEventListener("click", (_) => {
			if (iconBurger.classList.contains("active")) {
				document.body.classList.remove("lock");
				iconBurger.classList.remove("active");
				navigationsBody.classList.remove("active");
			}
		}
		);
	});
})();