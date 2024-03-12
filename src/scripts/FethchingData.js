import axios from "axios";

//runs the URL from fetchDataFromApi() and uses single pokemons' data
async function fetchFullPokemonData(data, itemsPerPage) {
    try{
        var tempPokemons = []
        var pages = [];
        for (let index = 0; index < data.length; index++) {
            var name = data[index].name;
            const responseNew = await axios.get(data[index].url); 
            tempPokemons.push(
            {
              sprite: responseNew.data.sprites.front_default,
              pokemonName: name,
              pokemonAbilities : [responseNew.data.abilities], 
              height: responseNew.data.height,
              weight: responseNew.data.weight
            }  
          );                       
        }    
        for (let i = 0; i < tempPokemons.length; i += itemsPerPage) {
          // Slice the tempPokemons array from the current index i up to i + itemsPerPage
          // and push this sub-array into the pages array.
          pages.push(tempPokemons.slice(i, i + itemsPerPage));
        }
        return [pages, true];
    }
    catch(error){
        console.error("Problems reaching API endpoint." + error);   
    }
}

//function that fetches JSON with name and pokemon URL
async function fetchDataFromApi(apiUrl) {
    try {
      return await axios.get(apiUrl); 
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }

  };

export {fetchFullPokemonData , fetchDataFromApi};