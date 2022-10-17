// Evaluamos si ya hay un jwt
const jwt = localStorage.getItem("jwt");
const url = "https://ctd-todo-api.herokuapp.com/v1";

if (jwt) {
  location.replace("mis-tareas.html");
}

window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.querySelector("form");
  const inputEmail = document.querySelector("#inputEmail");
  const inputPassword = document.querySelector("#inputPassword");

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let email = inputEmail.value;
    let password = inputPassword.value;

    //Validaciones
    if (!validarTexto(email)) {
      Swal.fire({
        title: "To DO",
        text: "Por favor ingrese un email",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (!validarEmail(email)) {
      Swal.fire({
        title: "To DO",
        text: "Formato de email inválido",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (!validarTexto(password)) {
      Swal.fire({
        title: "To DO",
        text: "Por favor ingrese la contraseña",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    console.log("Preparando Datos");

    const datosUsuario = {
      email: email,
      password: password,
    };

    console.log(datosUsuario);
    realizarLogin(datosUsuario);
  });

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 2: Realizar el login [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarLogin(datosUsuario) {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosUsuario),
    };
    //Envia la informacion a la API
    fetch(`${url}/users/login`, config)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //valida el token
        if (data.jwt) {
          //guarda el token
          localStorage.setItem("jwt", data.jwt);
          location.replace("mis-tareas.html");
        } else {
          Swal.fire({
            title: "To DO",
            text: "Usuario o Contraseña Inválidos",
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
        }
      })
      .catch((response) => {
        console.error(response);
      });
  }
});
