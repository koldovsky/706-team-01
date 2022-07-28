// FAQ
(function () {
   const accordionItems = document.querySelectorAll(".faq-accordion__wrapper");
 
   for (const item of accordionItems) {
     item.addEventListener("click", () => {
       if (item.classList.contains("active")) {
         clearActiveClasses();
       } else {
         clearActiveClasses();
         item.classList.add("active");
       }
     });
   }
 
   function clearActiveClasses() {
     accordionItems.forEach((activeItem) => {
       activeItem.classList.remove("active");
     });
   }
 })();