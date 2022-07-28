(function () {
   const accordionItems = document.querySelectorAll(".faq-accordion__wrappper");
 
   for (const item of accordionItems) {
     item.addEventListener("click", () => {
       clearActiveClasses();
       item.classList.add("active");
     });
   }
 
   function clearActiveClasses() {
     accordionItems.forEach((activeItem) => {
       activeItem.classList.remove("active");
     });
   }
 })();
 