/* 1 Cargar Trending
 1. Entrar a la API Gihphy trending (JSON)
 2. Iterar sobre cada objeto del vecotr retornado
 3. Crear etiqueta HTML (on base en la plantila diseñada) con cada elemento retornado
*/
const obtenerTrending = async (ajuste = 0, limite = 9) => {
    let respuesta = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=NFhAVIiT0Q6FsuIyMSDQtFVlEzih5E1o&limit=${limite}&offset=${ajuste}`)
    let trending = await respuesta.json();
    return trending.data;
}

const crearCajaGif = (gif) => {
    //1. donde lo voy a poner?
    let main = document.querySelector("#lista-gif"); //Esta en el dom
    //2. crear la plantilla de la caja
    let article = document.createElement("article"); //Este no esta en el dom todavia
    //3. rellenar la información con el objeto.

    //Curar elementos

    article.innerHTML =
        `<img class="gif"  src="${gif.images?.downsized?.url}" alt="" srcset="">
        <footer>
            <div class="imagen-autor">
                <img src="${gif.user?.avatar_url || "https://placehold.jp/150x150.png"}" alt="logo del autor" >
            </div>
            <div class="container-autor">
                <p ><strong>${gif.user?.username || "De autor"}</strong></p>
                <p>${gif.source_tld}</p>
            </div>
        </footer>`;
    //4. agregar el nodo html a el padre.
    main.appendChild(article);
}

/* 2. Buscar imagen 
1. agregar un eventlistener que escuche cuando el usuario presione enter
2. crear una funcion, que llame al API search, con los parametros: q
3. borrar resultado antigo y agregar el nuevo
*/



//Creación del event listener del search

//1. Obtener el input cada vez que suceda el evento search
const buscar = async (offset = 0, borrar = true) => {
    //Actualizar estado a busqueda:
    localStorage.setItem("estado", "buscando");

    let barraBusqueda = document.getElementsByName("busqueda");
    let q = barraBusqueda[0].value;
   
    //2. Llamar a la api search, con el la busqueda
    let resultadoBusqueda = await searchApi(q, offset);


    //3. borrar resultado anterior
    if(borrar){
        // guardar las tres ultimas busquedad
        guardarBusqueda(q);
        document.querySelector("#lista-gif").innerHTML = "";
    }
    if (resultadoBusqueda.length > 0) {
        //3. Colocar los resultados en el main
        resultadoBusqueda.map(trendGif => {
            //Paso 4: contruir un ndo html basado en la plantilla diseñada
            crearCajaGif(trendGif);
        });
    } else {
        document.querySelector("#lista-gif").innerHTML = "No se encontrarón resultados.";
    }
}
const guardarBusqueda = q => {
    /* 
    1. abrir almacenamiento local
    2. si el tamño es mayor que 3. borrar el mas viejo
    3. agregar nueva busqueda.
    */

    let localStorage = window.localStorage;
    let data = localStorage.getItem("historial");
    let historial = data ? JSON.parse(data) : []
    let ul = document.querySelector("#busquedas-recientes");
    if (historial.length < 3) {
        historial.push(q);
    } else {
        historial.shift();
        historial.push(q);
        ul.removeChild(ul.firstElementChild);
    }
    localStorage.setItem("historial", JSON.stringify(historial));
    let li = document.createElement("li");
    li.innerHTML = q;
    ul.appendChild(li);

}

const getHistorial = () => {
    let localStorage = window.localStorage;
    let data = localStorage.getItem("historial");
    let historial = data ? JSON.parse(data) : []
    let ul = document.querySelector("#busquedas-recientes");
    historial.map(busqueda => {
        let li = document.createElement("li");
        li.innerHTML = busqueda;
        ul.appendChild(li);
    })
}

const searchApi = async (q, offset) => {
    let respuesta = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=NFhAVIiT0Q6FsuIyMSDQtFVlEzih5E1o&limit=10&offset=${offset}&q=%22${q}%22`)
    let busqueda = await respuesta.json();
    return busqueda.data;
}

const scrollOrTouch = async (event) => {
    let element = event.target;
    let scrollOffset = 0;
    if (element.scrollingElement.scrollHeight - element.scrollingElement.scrollTop === element.scrollingElement.clientHeight) {
            let localStorage = window.localStorage;
            let estado = localStorage.getItem("estado");
            if(estado === "trending"){
                let trending = await obtenerTrending(scrollOffset, 10);
                scrollOffset +=10;
                //Paso 2: iterar por cada elemento del vector trending 
                trending.map(trendGif => {
                    //Paso 3: contruir un ndo html basado en la plantilla diseñada
                    crearCajaGif(trendGif);
                });
            }else{
                //Caso busqueda
                buscar(scrollOffset, false);
                scrollOffset+=10;
            }
        }
    }


const inicio = async () => {
    //Avisar al sistema que estamos viendo tranding
    let localStorage = window.localStorage;
    localStorage.setItem("estado", "trending");

    //Paso 1: Obtener los primero  trending
    let trending = await obtenerTrending(0, 10);
    //Paso 2: iterar por cada elemento del vector trending 
    trending.map(trendGif => {
        //Paso 3: contruir un ndo html basado en la plantilla diseñada
        crearCajaGif(trendGif);
    });

    //Evento de la barra de busqueda
    const barraBusqueda = document.querySelector("#busqueda");
    barraBusqueda.addEventListener("search", buscar);

    //Cargue de localstorage o historial ultimas 3 busquedas
    getHistorial();

    //Evento Scroll
    let scrollOffset = 0;
    window.addEventListener('scroll', scrollOrTouch);
    window.addEventListener('touchmove',scrollOrTouch);
}


inicio();








//Pasar variables por parametros a url:
// api_key, offset y limit
/*const obtenerTrendingPromesa = function(){
    let promesa = fetch("https://api.giphy.com/v1/gifs/trending?api_key=NFhAVIiT0Q6FsuIyMSDQtFVlEzih5E1o&offset=0&limit=20")

    promesa.then(respuesta => {
       
       let jsonObj = respuesta.json()
       jsonObj.then(resolve => {
        console.log(resolve);
       })
    }, 
        error => console.log(error)
    )
}*/


