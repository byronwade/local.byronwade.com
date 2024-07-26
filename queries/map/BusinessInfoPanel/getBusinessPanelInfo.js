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
					company_types {
						id
						name
					}
					business_claimsCollection {
						edges {
							node {
								id
								business_id
								user_id
								status
								claim_requested_at
								claim_approved_at
								claim_rejected_at
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
					payment_types {
						business_id
						credit_cards
						bitcoin
						apple_pay
						google_pay
						cash
						paypal
					}
					mediaCollection {
						edges {
							node {
								id
								business_id
								logo
								featured_image
								gallery
								portfolio
								videos
							}
						}
					}
					menusCollection {
						edges {
							node {
								id
								business_id
								name
							}
						}
					}
					dealsCollection {
						edges {
							node {
								id
								business_id
								title
								url
								start_date
								end_date
								is_popular
								what_you_get
								important_restrictions
								additional_restrictions
							}
						}
					}
					eventsCollection {
						edges {
							node {
								id
								business_id
								name
								category
								description
								start_time
								end_time
								cost
								is_canceled
								is_free
								tickets_url
							}
						}
					}
					servicesCollection {
						edges {
							node {
								id
								business_id
								name
								description
								price
							}
						}
					}
					social_media {
						business_id
						facebook
						twitter
						instagram
						linkedin
					}
					certificationsCollection {
						edges {
							node {
								id
								business_id
								name
								issuing_organization
								issue_date
								expiry_date
							}
						}
					}
					productsCollection {
						edges {
							node {
								id
								business_id
								name
								description
								price
								category
								image_url
							}
						}
					}
					ai_content {
						business_id
						overview
						highlights
						customer_reviews_summary
					}
					postsCollection {
						edges {
							node {
								id
								business_id
								author
								title
								content
								created_at
							}
						}
					}
					blogsCollection {
						edges {
							node {
								id
								business_id
								author
								title
								content
								created_at
							}
						}
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
