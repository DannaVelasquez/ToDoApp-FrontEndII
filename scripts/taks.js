// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const jwt = localStorage.getItem("jwt");
const url = "https://ctd-todo-api.herokuapp.com/v1";

if (!jwt) {
  location.replace("index.html");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */

  const formCrearTarea = document.querySelector("form.nueva-tarea");
  const nombreUsuario = document.querySelector(".user-info p");
  const contenedorTareasPendientes = document.querySelector(".tareas-pendientes");
  const contenedorTareasTerminadas = document.querySelector(".tareas-terminadas");
  const inputTarea = document.querySelector("#nuevaTarea");
  const cantidadFinalizadas = document.querySelector("#cantidad-finalizadas");
  const cantidadPendientes = document.querySelector("#cantidad-pendientes");
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  closeApp.addEventListener("click", function () {
    Swal.fire({
      title: "Cerrar Sesión",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Salir",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        location.replace("index.html");
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario(datosUsuario) {
    const config = {
      method: "GET",
      headers: {
        authorization: jwt,
      },
    };

    fetch(`${url}/users/getMe`, config)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        nombreUsuario.textContent = data.firstName;
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const config = {
      method: "GET",
      headers: {
        authorization: jwt,
      },
    };

    fetch(`${url}/tasks`, config)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        data = data.sort(function (a, b) {
          return b.description < a.description;
        });
        renderizarTareas(data);
      })
      .catch((response) => {
        console.error(response);
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Creando Tarea", inputTarea.value);

    let tarea = inputTarea.value;

    if (!validarTexto(tarea)) {
      Swal.fire({
        title: "To DO",
        text: "Por favor, complete la tarea",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const nuevaTarea = {
      description: inputTarea.value,
      completed: false,
    };
    //Prepara para envio a la API
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: jwt,
      },
      body: JSON.stringify(nuevaTarea),
    };

    fetch(`${url}/tasks`, config)
      .then((response) => response.json())
      .then((data) => {
        console.log("Tarea recien posteada");
        console.log(data);
        inputTarea.value = "";
        consultarTareas();
      })

      .catch((error) => console.log(error));
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    contenedorTareasPendientes.innerHTML = "";
    contenedorTareasTerminadas.innerHTML = "";

    let contadorF = 0;
    let contadorP = 0;

    listado.forEach((tarea) => {
      if (tarea.completed) {
        contenedorTareasTerminadas.innerHTML += `
        <li class="tarea" data-aos="fade-up">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}" type="button"><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}" type="button"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>`;
          contadorF++;
      } else {
        contenedorTareasPendientes.innerHTML += `
        <li class="tarea" data-aos="flip-up">
          <div class ="pendiente">
          <button class="change" id="${tarea.id}">
          <i class="fa-regular fa-circle"></i></button>
          </div>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="cambios-estados">
                <button class="borrar" id="${tarea.id}" type="button"><i class="fa-regular fa-trash-can"></i></button>
              </div>
          <p class="timestamp">${new Date(
            tarea.createdAt
          ).toLocaleDateString()}</p>
        </div>
      </li>`;
      contadorP++;
      }

      cantidadFinalizadas.textContent = contadorF;
      cantidadPendientes.textContent = contadorP;
    });

    

    const botonesCambiarEstado = document.querySelectorAll(".change");
    const botonesBorrar = document.querySelectorAll(".borrar");

    botonesCambiarEstado.forEach((boton) => {
      boton.addEventListener("click", function () {
        botonesCambioEstado(this);
      });
    });

    botonesBorrar.forEach((boton) => {
      boton.addEventListener("click", function () {
        botonBorrarTarea(event.target);
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(elemento) {
    console.log(elemento);
    console.log(elemento.classList.contains("incompleta")); // Obtiene true o false si existe la clase

    let tarea = {
      completed: !elemento.classList.contains("incompleta") ? true : false,
    };

    const config = {
      method: "PUT",
      headers: {
        authorization: jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarea),
    };

    fetch(`${url}/tasks/${elemento.id}`, config)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //vuelve a recargar las tareas
        consultarTareas();
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(elemento) {
    console.log(elemento);
    console.log(elemento.id);

    Swal.fire({
      title: "To DO",
      text: "¿Confirma eliminar la tarea?",
      icon: "question",

      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        Swal.fire('Tarea Eliminada!')
        const config = {
          method: "DELETE",
          headers: {
            authorization: jwt,
          },
        };
        fetch(`${url}/tasks/${elemento.id}`, config)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            //vuelve a recargar las tareas
            consultarTareas();
          });
      }
    });
  }

  obtenerNombreUsuario();
  consultarTareas();
});
