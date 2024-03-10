import React, { useEffect } from "react";
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios'

const apiUrl = 'https://pokeapi.co/api/v2/pokemon'

function DisplayTable(pokemonData)
{
    return (
        <table key={1}>
            <thead>
                <th>IMAGE</th>
                <th>NAME</th>
                <th>ABILITIES</th>
            </thead>
            <tbody key={1}>
                {pokemonData.map((singlePokemon, id = 0) =>
                    {   
                        let abilities = [], ability = "";    
                        for (let i = 0; i < singlePokemon.pokemonAbilities[0].length; i++) {
                            //retrieve ability name
                            ability = singlePokemon.pokemonAbilities[0][i].ability.name;
                            //make first character uppercase
                            ability = ability.charAt(0).toUpperCase() + ability.slice(1,ability.length);
                            //add ability to list
                            abilities.push(ability); 
                        }   
                        //convert list of abilities to string
                        abilities = abilities.join(', ');
                        return(
                            <tr key={id}>
                                <td key={id+1}><img src={singlePokemon.sprite} alt={singlePokemon.name} /></td>
                                <td key={id+2}>{singlePokemon.pokemonName}</td>
                                <td key={id+3}>{abilities}</td>            
                            </tr>);
                    })
                }
            </tbody>
        </table>
    );
 
}


function Table(){
    // data to be filled with pokemon info --> by default null
    var [pokemons, setPokemons] = React.useState(null);
    //full pokemon info to be stored and managed here
    var [pokemonData, setPokemonData] = React.useState(null);
    //by default there's no pokemon data to display
    var [namesFetched, setNamesFetched] = React.useState(false);
    var [allDataFetched, setAllDataFetched] = React.useState(false);
    useEffect(() => {
        
        const fetchDataFromApi = async () => {
            try {
              const response = await axios.get(apiUrl); //this part fetches pokemon names and URLs to their info
              
              //run each pokemon url to get their abilities and images          
              
              setPokemons(response.data); //set data to 
              setNamesFetched(true); // Set to true once data is fetched
            } catch (error) {
              console.error("Error fetching data from API:", error);
            }
          };
          fetchDataFromApi();
        }, []);
      useEffect(() => {
        if (namesFetched)
        {
            const fetchAbilitesAndSprites = async () => {
                try{
                    var tempPokemons = []
                    for (let index = 0; index < pokemons.results.length; index++) {
                        var name = pokemons.results[index].name;
                        const responseNew = await axios.get(pokemons.results[index].url); 
                        var object = {
                            sprite: responseNew.data.sprites.front_default,
                            pokemonName: name,
                            pokemonAbilities : [responseNew.data.abilities]              
                        }  
                        tempPokemons.push(object);                       
                    }
                    setPokemonData(tempPokemons);
                    setAllDataFetched(true);
                }
                catch(error){
                    console.log("tu");   
                }
            }
            fetchAbilitesAndSprites();
        }
        
      }, [namesFetched]);
      return ( 
        <div>
             {namesFetched && allDataFetched ? 
             DisplayTable(pokemonData)       
             : 
             <p>
                No data to display at the moment.
            </p>
            }
        </div>
      ) 
}

export default Table;




