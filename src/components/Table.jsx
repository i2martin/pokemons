import React, { useEffect } from "react";
import Pagination from 'react-bootstrap/Pagination';
import {fetchAbilitesAndSprites, fetchDataFromApi} from "../scripts/FethchingData";
import { Tooltip as ReactTooltip } from "react-tooltip";

const apiUrl = 'https://pokeapi.co/api/v2/pokemon'

function DisplayTable(pokemonData)
{
    return (
        <table key={1}>
            <thead>
                <tr>
                    <th>IMAGE</th>
                    <th>NAME</th>
                    <th>ABILITIES</th>
                </tr>
            </thead>
            <tbody key={1}>
                {pokemonData.map((singlePokemon, id = 0) =>
                    {   
                        let abilities = [], ability = "";    
                        abilities = singlePokemon.pokemonAbilities[0].map(abilityObj => {
                            const abilityName = abilityObj.ability.name;
                            return abilityName.charAt(0).toUpperCase() + abilityName.slice(1);
                        }).join(', ');
                        return(
                            <tr key={id}>
                                <td key={id+1}>
                                    <img data-tooltip-id="my-tooltip-1" src={singlePokemon.sprite} alt={singlePokemon.pokemonName} />
                                    <ReactTooltip
                                        id="my-tooltip-1"
                                        place="top"
                                        content="Dummy info"
                                    />
                                </td>
                                <td key={id+2}>{singlePokemon.pokemonName.charAt(0).toUpperCase() + singlePokemon.pokemonName.slice(1,singlePokemon.pokemonName.length)}</td>
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
    //indicates data's ready to be displayed (full pokemon info)
    var [allDataFetched, setAllDataFetched] = React.useState(false);
    useEffect(() => {
          fetchDataFromApi(apiUrl).then((response) =>
          {
            setPokemons(response.data);
            setNamesFetched(true); // Set to true once data is fetched
          }
          );
        }, []);

      useEffect(() => {
        if (namesFetched)
        {
            fetchAbilitesAndSprites(pokemons.results).then((results) =>
                {
                    setPokemonData(results[0]);
                    setAllDataFetched(results[1]);
                }
            );
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