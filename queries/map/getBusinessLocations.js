// queries/getBusinesses.js
import { gql } from "@apollo/client";

export const GET_BUSINESSES = gql`
	query GetBusinesses($first: Int!) {
		businessesCollection(first: $first) {
			edges {
				node {
					nodeId
					id
					name
					locations {
						business_id
						address1
						address2
						address3
						city
						zip_code
						country
						state
						cross_streets
						neighborhood
						display_address
						latitude
						longitude
					}
					service_areasCollection {
						edges {
							node {
								id
								business_id
								radius
							}
						}
					}
				}
			}
		}
	}
`;
