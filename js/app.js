const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Crear Promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
  console.log(objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
  }

  consultarAPI();
}

function mostrarAlerta(msg) {
  const existeError = document.querySelector(".error");

  if (!existeError) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");

    // Mostrar mensaje
    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  fetch(URL)
    .then((resultado) => resultado.json())
    .then((cotizacion) =>
      mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])
    );
}

function mostrarCotizacion(cotizacion) {
  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es <span>${PRICE}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `El precio más alto del día fue <span>${HIGHDAY}</span> 🚀`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `El precio más bajo del día fue <span>${LOWDAY}</span> 👇`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `Variación últimas 24hrs <span>${CHANGEPCT24HOUR}</span> % 💱`;

  const ultimaActualizacion = document.createElement("p");
  ultimaActualizacion.innerHTML = `Última actualización <span>${LASTUPDATE} 🕘</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}
