import React, { useEffect } from "react";
import {fetchFullPokemonData, fetchDataFromApi} from "../scripts/FethchingData";
import { Tooltip as ReactTooltip } from "react-tooltip";
import LoadingSpinner from "./LoadingSpinner";

const apiUrl = 'https://pokeapi.co/api/v2/pokemon'
const itemsPerPage = 6;

function DisplayTable(pokemonData, {direction, onSort})
{
    return (
        <table key={1}>
            <thead>
                <tr>
                    <th className="sort-button" onClick={() => {onSort()}}>{"IMAGE" + direction}</th>
                    <th>NAME</th>
                    <th>ABILITIES</th>
                </tr>
            </thead>
            <tbody key={1}>
                {pokemonData.map((singlePokemon, id = 0) =>
                    {   
                        let abilities = [];   
                        abilities = singlePokemon.pokemonAbilities[0].map(abilityObj => {
                            return abilityObj.ability.name.charAt(0).toUpperCase() + abilityObj.ability.name.slice(1);
                        }).join(', ');
                        let tooltipdata = "Height:" + singlePokemon.height + " Weight:" + singlePokemon.weight;
                        return(
                            <tr key={id}>
                                <td key={id+1}>
                                    <img data-tooltip-id={id+1} src={singlePokemon.sprite} alt={singlePokemon.pokemonName} />
                                    <ReactTooltip
                                        id={id+1}
                                        place="bottom"
                                        content= {tooltipdata}
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
    //full pokemon info to be stored and managed here
    var [sortedAscPokemonData, setSortedAscPokemonData] = React.useState(null);
    //full pokemon info to be stored and managed here
    var [sortedDescPokemonData, setSortedDescPokemonData] = React.useState(null);
    //by default there's no pokemon data to display
    var [namesFetched, setNamesFetched] = React.useState(false);
    //indicates data's ready to be displayed (full pokemon info)
    var [allDataFetched, setAllDataFetched] = React.useState(false);
    //manages current page --> default is null / later set to 0
    var [currentPage, setCurrentPage] = React.useState(null);
    //state that manages if sorting was requested --> by height
    var [sortedPage, setSortedPage] = React.useState("unsorted"); 
    //state that manages sort direction
    var [sortDirection, setSortDirection] = React.useState("");
    

    function sortData() {
        //setSortedPage(!sortedPage); // Toggle sorted state
        if (sortedPage === "unsorted" || sortedPage === "ascending") { 
            setSortedPage("descending")
            setPokemonData(sortedAscPokemonData);
            setSortDirection(" ↓")
        } else {
            //reverse sort
            setSortedPage("ascending");
            setPokemonData(sortedDescPokemonData);
            setSortDirection(" ↑")
        }
    }
    
    function previousPage()
    {
        if (currentPage !== 0)
        {
            setCurrentPage(currentPage - 1);
        }
    }

    function nextPage()
    {
        if (currentPage < pokemonData.length - 1)
        {
            setCurrentPage(currentPage + 1);
        }
    }
    useEffect(() => {
          fetchDataFromApi(apiUrl).then((response) =>
          {
            setPokemons(response.data);
            setNamesFetched(true); // Set to true once data is fetched
          }
          );
        }, []);

    useEffect(() => {
        if (namesFetched === true && pokemons.results !== null)
        {
            fetchFullPokemonData(pokemons.results, itemsPerPage).then((results) =>
                {                    
                    setPokemonData(results[0]);
                    setCurrentPage(0);
                    setAllDataFetched(results[1]);
                    setSortedAscPokemonData(results[2]);
                    setSortedDescPokemonData(results[3]);
                }
            );
        }  
      }, [namesFetched, pokemons]);
    return ( 
        <div>
             {namesFetched && allDataFetched ?          
             <>              
                {DisplayTable(pokemonData[currentPage], {direction: sortDirection, onSort: sortData})}
                <div className="custom-buttons">
                    <button onClick={previousPage}>Previous</button>
                    <button onClick={nextPage}>Next</button>
                </div>
            </>
             : 
                <LoadingSpinner />
            }
        </div>
    ) 
}
export default Table;