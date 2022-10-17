const jwt = localStorage.getItem("jwt");

if (jwt) {
  location.replace("mis-tareas.html");
}

window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const inputNombre = document.querySelector("#inputNombre");
  const inputApellido = document.querySelector("#inputApellido");
  const inputEmail = document.querySelector("#inputEmail");
  const inputPassword = document.querySelector("#inputPassword");
  const inputPasswordRepetida = document.querySelector(
    "#inputPasswordRepetida"
  );
  const form = document.querySelector("form");
  const url = "https://ctd-todo-api.herokuapp.com/v1";

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let email = normalizarEmail(inputEmail.value);
    let firstName = normalizarTexto(inputNombre.value);
    let lastName = normalizarTexto(inputApellido.value);
    if (!validarEmail(email)) {
      alert("Email Incorrecto");
    }

    if (
      !compararContrasenias(inputPassword.value, inputPasswordRepetida.value)
    ) {
      alert("Las contraseñas no coinciden");
    }

    let password = inputPassword.value;

    const datosNuevoUsuario = {
      firstName,
      lastName,
      email,
      password,
    };

    console.table(datosNuevoUsuario);
    realizarRegister(datosNuevoUsuario);
    form.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(datosNuevoUsuario) {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosNuevoUsuario),
    };

    fetch(`${url}/users`, config)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
          location.replace("index.html");
        }
      })
      .catch((response) => {
        console.error(response);
      });
  }
});
