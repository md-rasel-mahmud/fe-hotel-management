import { api } from "@/lib/store/api/api.config";

export const pokemonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
    }),
    getAllPokemons: builder.query({
      query: () => `pokemon`,
    }),
  }),
});

export const { useGetPokemonByNameQuery, useGetAllPokemonsQuery } = pokemonApi;
