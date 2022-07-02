(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

var marca = document.querySelector("#Marca");
var submarca = document.querySelector("#Submarca");
var modelo = document.querySelector("#Modelo");
var descripcion = document.querySelector("#Descripcion");
window.onload = function () {
  ComboNull("Selecciona una Marca", marca);
  ComboNull("Selecciona una Submarca", submarca);
  ComboNull("Selecciona un Modelo", modelo);
  ComboNull("Selecciona una Descripción", descripcion);
  //CboMarca
  GenerarComboBoxBD({
    filtro: "1",
    catalagoAPI: "Marca",
    IdData: "iIdMarca",
    catalagoData: "sMarca",
    control: marca,
    nombre: "Selecciona una Marca",
  });

  marca.onchange = function () {
    ComboNull("Selecciona un Modelo", modelo);
    ComboNull("Selecciona una Descripción", descripcion);
    if (marca.value !== "") {
      //CboSubmarca
      GenerarComboBoxBD({
        filtro: marca.value,
        catalagoAPI: "Submarca",
        IdData: "iIdSubMarca",
        catalagoData: "sSubMarca",
        control: submarca,
        nombre: "Selecciona una Submarca",
      });
    }
  };
  submarca.onchange = function () {
    ComboNull("Selecciona un Modelo", modelo);
    ComboNull("Selecciona una Descripción", descripcion);
    if (submarca.value !== "") {
      //CboModelo
      GenerarComboBoxBD({
        filtro: submarca.value,
        catalagoAPI: "Modelo",
        IdData: "iIdModelo",
        catalagoData: "sModelo",
        control: modelo,
        nombre: "Selecciona un Modelo",
      });
    }
  };
  modelo.onchange = function () {
    ComboNull("Selecciona una Descripción", descripcion);
    if (modelo.value !== "") {
      //CboDescripcion
      GenerarComboBoxBD({
        filtro: modelo.value,
        catalagoAPI: "DescripcionModelo",
        IdData: "iIdDescripcion",
        catalagoData: "sDescripcion",
        control: descripcion,
        nombre: "Selecciona una Descripción",
      });
    }
  };
};

function GenerarComboBoxBD(obj) {
  document.getElementById("cargaCbo").style.display = "block";
  fetch("https://apitestcotizamatico.azurewebsites.net/api/catalogos", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      Filtro: obj.filtro,
      IdAplication: 2,
      NombreCatalogo: obj.catalagoAPI,
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        document.getElementById("cargaCbo").style.display = "none";
        return res.json();
      }
    })
    .then((res) => {
      if (res !== null || res !== undefined) {
        const catalagos = JSON.parse(res.CatalogoJsonString);
        let contenido = "";
        contenido += `<option value="">${obj.nombre}</option>`;
        for (let i = 0; i < catalagos.length; i++) {
          contenido += `<option value="${catalagos[i][obj.IdData]}">`;
          contenido += catalagos[i][obj.catalagoData];
          contenido += "</option>";
        }
        obj.control.innerHTML = contenido;
      }
    });
}

function ComboNull(nombre, control) {
  let contenido = "";
  contenido += `<option value="">${nombre}</option>`;
  control.innerHTML = contenido;
}

var CP = document.querySelector("#CP");

CP.onkeypress = function (e) {
  if ((e.keyCode < 48 && e.keyCode > 14 && e.keyCode < 12) || e.keyCode > 57) {
    e.preventDefault();
  } else if (e.keyCode == 13) {
    e.preventDefault();
    ObtenerDomicilio(CP.value);
  }
};

CP.oncopy = function (e) {
  e.preventDefault();
};
CP.onpaste = function (e) {
  e.preventDefault();
};

function ObtenerDomicilio(filtro) {
  fetch("https://apitestcotizamatico.azurewebsites.net/api/catalogos", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      Filtro: filtro,
      IdAplication: 2,
      NombreCatalogo: "Sepomex",
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res !== null || res !== undefined) {
        const data = JSON.parse(res.CatalogoJsonString);
        const municipio = data[0].Municipio;
        const ubicacion = data[0].Ubicacion;
        document.querySelector("#Estado").value = municipio["Estado"].sEstado;
        document.querySelector("#Municipio").value = municipio.sMunicipio;
        document.querySelector("#Colonia").value = ubicacion[0].sUbicacion;
      }
    });
}

var ctrlDomicilio = document.getElementsByClassName("ctrlDomicilio");

for (let i = 0; i < ctrlDomicilio.length; i++) {
  ctrlDomicilio[i].onkeypress = function (e) {
    e.preventDefault();
  };
  ctrlDomicilio[i].onkeydown = function (e) {
    //Tecla de retroceso y supr.
    if (e.keyCode === 8 || e.keyCode === 46) {
      e.preventDefault();
    }
  };
  ctrlDomicilio[i].onpaste = function (e) {
    e.preventDefault();
  };
  ctrlDomicilio[i].oncopy = function (e) {
    e.preventDefault();
  };
}

var controles = document.getElementsByClassName("ctrl");
var form = document.getElementById("frm");

form.onsubmit = function (e) {
  e.preventDefault();

  var campoVacio = 0;

  //Obtiene información de controles --------------------------------------
  for (var i = 0; i < controles.length; i++) {
    if (controles[i].value === "") {
      campoVacio++; //validación de campos
    }
  }

  if (campoVacio === 0 && form.checkValidity()) {
    Mensaje("Todos los datos han sido validados", "success");
  } else {
    Mensaje("Hay campos vacíos, revisar datos", "warning");
  }
};

document.querySelector("#btnCancelar").onclick = function () {
  document.getElementById("frm").classList.remove("was-validated");

  for (let i = 0; i < controles.length; i++) {
    controles[i].value = "";
  }
};

function Mensaje(titulo, icon) {
  Swal.fire({
    title: titulo,
    confirmButtonText: "Aceptar",
    icon: icon,
  });
}
