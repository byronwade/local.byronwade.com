"use client";
import React from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

const Hit = ({ hit }) => (
	<div>
		<h3>{hit.name}</h3>
		<p>{hit.description}</p>
	</div>
);

const Agolia = () => (
	<InstantSearch searchClient={searchClient} indexName="businesses">
		<SearchBox />
		<Hits hitComponent={Hit} />
	</InstantSearch>
);

export default Agolia;
