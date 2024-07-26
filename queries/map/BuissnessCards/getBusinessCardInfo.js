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
					alias
					url
					phone
					display_phone
					email
					website
					rating
					review_count
					price
					transactions
					is_claimed
					is_closed
					company_type_id
					created_at
					updated_at
					deleted_at
					service_areasCollection {
						edges {
							node {
								id
								business_id
								radius
							}
						}
					}
					categoriesCollection {
						edges {
							node {
								id
								business_id
								alias
								title
							}
						}
					}
					hoursCollection {
						edges {
							node {
								id
								business_id
								day
								start
								end
								is_overnight
							}
						}
					}
					special_hoursCollection {
						edges {
							node {
								id
								business_id
								date
								is_closed
							}
						}
					}
					attributes {
						business_id
						good_for_kids
						good_for_groups
						outdoor_seating
						takeout
						delivery
						wifi
						parking
						alcohol
						bike_parking
						business_accepts_credit_cards
						business_accepts_bitcoin
						byob
						byob_corkage
						cater
						coat_check
						dogs_allowed
						drivethru
						gender_neutral_restrooms
						happy_hour
						has_tv
						music
						open_24_hours
						reservations
						romantic
						smoking
						wheelchair_accessible
						business_accepts_apple_pay
						business_accepts_google_pay
					}
					mediaCollection {
						edges {
							node {
								id
								business_id
								logo
							}
						}
					}
					ai_content {
						business_id
						overview
						highlights
						customer_reviews_summary
					}
					reviewsCollection {
						edges {
							node {
								id
								business_id
								url
								text
								rating
								time_created
								user
							}
						}
					}
					restaurants {
						business_id
						cuisine_type
						average_cost_for_two
						reservations
					}
					construction_companies {
						business_id
						license_number
						bonding_information
						insurance_information
					}
				}
			}
		}
	}
`;
