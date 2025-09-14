import { useEffect, useState} from "react";
import axios from 'axios';
import './PokemonList.css';     //316 react.js
import Pokemon from "../Pokemon/Pokemon";


function PokemonList(){
    const[pokemonList, setPokemonList]=useState([]);
    const[isLoading, setIsLoading] = useState(true);

    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';

    async function fetchPokemonsApi(){
        const response = await axios.get(POKEDEX_URL); //this downloads list of 20 pokemons
        const pokemonResults = response.data.results; //we get the array of pokemons from result
        console.log(response.data)

        //iterating over the array of pokemons, and using their url, to create an array of promises
        //that will download those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon)=>axios.get(pokemon.url));

        const pokemonData = await axios.all(pokemonResultPromise);
        console.log(pokemonData);

        const res = pokemonData.map((pokeData)=>{
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name, 
                image: pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default, // ✅ fallback
                types: pokemon.types
            }
        });
        console.log(res);
        setPokemonList(res);
        setIsLoading(false);
    }

    useEffect(()=>{
        fetchPokemonsApi();
    },[]);

    return(
        <div className="pokemon-list-wrapper">
            <h4>Pokemon List</h4>
            {isLoading 
              ? 'loading..' 
              : pokemonList.map((p)=> 
                  <Pokemon 
                    key={p.id} 
                    name={p.name} 
                    image={p.image} 
                    types={p.types}   //  pass types too if needed
                  />
                )
            }
        </div>
    )
}
export default PokemonList;
