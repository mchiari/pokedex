import React, { useEffect, useState } from 'react';
import { getPokemonData, getPokemons, searchPokemon } from './api';
import './App.css';
import Navbar from './components/Navbar';
import Pokedex from './components/Pokedex';
import SearchBar from './components/SearchBar';
import { FavoriteProvider } from './contexts/FavoriteContext';

const favoritesKey = 'f';
function App() {
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const [pokemons, setPokemons] = useState([]);
	const [favorites, setFavorites] = useState([]);

	const itensPerPage = 25;
	const fetchPokemons = async () => {
		try {
			setLoading(true);
			setNotFound(false);
			const data = await getPokemons(itensPerPage, itensPerPage * page);
			const promises = data.results.map(async (pokemon) => {
				return await getPokemonData(pokemon.url);
			});

			const results = await Promise.all(promises);
			setPokemons(results);
			setLoading(false);
			setTotalPages(Math.ceil(data.count / itensPerPage));
		} catch (error) {
			console.log('fetchPokemons Error:', error);
		}
	};

	const loadFavoritePokemons = () => {
		const pokemons =
			JSON.parse(window.localStorage.getItem(favoritesKey)) || [];
		setFavorites(pokemons);
	};

	useEffect(() => {
		fetchPokemons();
	}, [page]);

	useEffect(() => {
		loadFavoritePokemons();
	}, []);

	const updateFavoritePokemons = (name) => {
		const updatedFavorites = [...favorites];
		const favoriteIndex = favorites.indexOf(name);
		if (favoriteIndex >= 0) {
			updatedFavorites.splice(favoriteIndex, 1);
		} else {
			updatedFavorites.push(name);
		}
		window.localStorage.setItem(
			favoritesKey,
			JSON.stringify(updatedFavorites)
		);

		setFavorites(updatedFavorites);
	};

	const onSearchHandler = async (pokemon) => {
		if (!pokemon) {
			return fetchPokemons();
		}
		setLoading(true);
		setNotFound(false);
		const result = await searchPokemon(pokemon);
		if (!result) {
			setNotFound(true);
			setPage(0);
			setTotalPages(1);
		} else {
			setPokemons([result]);
		}
		setLoading(false);
	};

	return (
		<FavoriteProvider
			value={{
				favoritePokemons: favorites,
				updateFavoritePokemons: updateFavoritePokemons,
			}}
		>
			<div>
				<Navbar />
				<SearchBar onSearch={onSearchHandler} />
				{notFound ? (
					<div className='not-found-text'>Meteu essa?</div>
				) : (
					<Pokedex
						page={page}
						totalPages={totalPages}
						pokemons={pokemons}
						loading={loading}
						setPage={setPage}
					/>
				)}
			</div>
		</FavoriteProvider>
	);
}

export default App;
