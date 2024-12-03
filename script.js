/* Chequeamos si estamos en la página de contacto */

if (document.getElementById("contact-page")) {
  console.log("Página de contacto detectada.");

  const form = document.getElementById("contact-form");
  if (form) {
    console.log("Formulario encontrado.");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Evento submit detectado.");

      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;

      if (name && email) {
        console.log("Formulario completado con éxito.");
        this.submit();
      } else {
        console.log("Faltan campos por llenar, por favor complétalos.");
      }
    });
  } else {
    console.log("Formulario no encontrado.");
  }
} else {
  console.log("No estás en la página de contacto.");
}
