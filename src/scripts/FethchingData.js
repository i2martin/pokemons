import axios from "axios";

//runs the URL from fetchDataFromApi() and uses single pokemons' data
async function fetchAbilitesAndSprites(data) {
    try{
        var tempPokemons = []
        for (let index = 0; index < data.length; index++) {
            var name = data[index].name;
            const responseNew = await axios.get(data[index].url); 
            console.log(responseNew.data);
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
        return [tempPokemons, true];
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

export {fetchAbilitesAndSprites, fetchDataFromApi};