import React, { useContext } from 'react';
import FavoriteContext from '../contexts/FavoriteContext';

const Pokemon = (props) => {
	const { favoritePokemons, updateFavoritePokemons } =
		useContext(FavoriteContext);
	const { pokemon } = props;
	const onHeartClick = () => {
		updateFavoritePokemons(pokemon.name);
	};
	const heart = favoritePokemons.includes(pokemon.name) ? '❤️' : '🖤';

	return (
		<div className='pokemon-card'>
			<div className='pokemon-image-container'>
				<img
					className='pokemon-image'
					alt={pokemon.name}
					src={pokemon.sprites.front_default}
				/>
			</div>
			<div className='card-body'>
				<div className='card-top'>
					<h3>{pokemon.name}</h3>
					<div>#{pokemon.id}</div>
				</div>
				<div className='card-bottom'>
					<div className='pokemon-type'>
						{pokemon.types.map((type, index) => {
							return (
								<div key={index} className='pokemon-type-text'>
									{type.type.name}
								</div>
							);
						})}
					</div>
					<button
						className='pokemon-heart-btn'
						onClick={onHeartClick}
					>
						{heart}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Pokemon;
