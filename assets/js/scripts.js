 async function getTrending() {
    const response = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=NFhAVIiT0Q6FsuIyMSDQtFVlEzih5E1o&limit=20&offset=0');
    const movies = await response.json();
    return movies;
  }
const createGifBox = (gif) => {
    let article = document.createElement("article");
    article.innerHTML =  `
    <img class="gif"  src="${gif.images.downsized.url}" alt="" srcset="">
    <footer>
        <div class="imagen-autor">
            <img src="${gif?.user?.avatar_url}" alt="logo del autor" >
        </div>
        <div class="container-autor">
            <p ><strong>${gif.user?.username}</strong></p>
            <p>${gif.source_tld}</p>
        </div>
    </footer>
    `
    return article;
}
const init = async() => {
    
    
    getTrending().then(response => {
        let mainList = document.querySelector("#lista-gif")
        response.data.forEach(gif => {
            mainList.appendChild(createGifBox(gif)) ;
        });
      });
      
   
   
   
};
  
  init();