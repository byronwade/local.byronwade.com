-- Insert sample data into users_schema.users
INSERT INTO users_schema.users (id, username, email, created_at, updated_at)
VALUES
('949b3483-a64d-4402-8ae3-d7d3711eac91', 'Byron Wade', 'bcw1995@gmail.com', NOW(), NOW()),
('162465ae-d728-4d0b-8f19-07fad5c16416', 'Not Byron Wade', 'bw@wadesinc.io', NOW(), NOW());

-- Insert sample data into users_schema.roles
INSERT INTO users_schema.roles (id, name)
VALUES
(uuid_generate_v4(), 'admin'),
(uuid_generate_v4(), 'user');

-- Insert sample data into users_schema.permissions
INSERT INTO users_schema.permissions (id, role_id, permission)
VALUES
(uuid_generate_v4(), (SELECT id FROM users_schema.roles WHERE name = 'admin'), 'manage_users'),
(uuid_generate_v4(), (SELECT id FROM users_schema.roles WHERE name = 'user'), 'view_content');

-- Insert sample data into users_schema.user_roles
INSERT INTO users_schema.user_roles (user_id, role_id)
VALUES
('949b3483-a64d-4402-8ae3-d7d3711eac91', (SELECT id FROM users_schema.roles WHERE name = 'admin')),
('162465ae-d728-4d0b-8f19-07fad5c16416', (SELECT id FROM users_schema.roles WHERE name = 'user'));

-- Insert sample data into business_schema.company_types
INSERT INTO business_schema.company_types (id, name)
VALUES
(uuid_generate_v4(), 'Restaurant'),
(uuid_generate_v4(), 'Construction');

-- Insert sample data into business_schema.businesses
INSERT INTO business_schema.businesses (id, name, alias, url, latitude, longitude, phone, display_phone, email, website, rating, review_count, price, transactions, is_claimed, is_closed, company_type_id, created_at, updated_at)
VALUES
(uuid_generate_v4(), 'Business 1', 'business-1', 'https://example.com/business-1', 37.7749, -122.4194, '123-456-7890', '(123) 456-7890', 'contact@business1.com', 'https://business1.com', 4.5, 100, '$$', ARRAY['pickup', 'delivery'], FALSE, FALSE, (SELECT id FROM business_schema.company_types WHERE name = 'Restaurant'), NOW(), NOW()),
(uuid_generate_v4(), 'Business 2', 'business-2', 'https://example.com/business-2', 37.7749, -122.4194, '987-654-3210', '(987) 654-3210', 'contact@business2.com', 'https://business2.com', 4.0, 50, '$', ARRAY['pickup'], TRUE, FALSE, (SELECT id FROM business_schema.company_types WHERE name = 'Construction'), NOW(), NOW());

-- Insert sample data into business_schema.categories
INSERT INTO business_schema.categories (id, business_id, alias, title)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'category-1', 'Category 1'),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'category-2', 'Category 2');

-- Insert sample data into business_schema.locations
INSERT INTO business_schema.locations (business_id, address1, address2, address3, city, zip_code, country, state, cross_streets, neighborhood, display_address)
VALUES
((SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), '123 Main St', 'Suite 1', '', 'San Francisco', '94103', 'USA', 'CA', 'Main & 1st', 'Downtown', ARRAY['123 Main St, San Francisco, CA 94103']),
((SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), '456 Elm St', '', '', 'San Francisco', '94103', 'USA', 'CA', 'Elm & 2nd', 'Uptown', ARRAY['456 Elm St, San Francisco, CA 94103']);

-- Insert sample data into business_schema.hours
INSERT INTO business_schema.hours (id, business_id, day, start, "end", is_overnight)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Monday', '09:00', '17:00', FALSE),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Tuesday', '09:00', '17:00', FALSE);

-- Insert sample data into business_schema.special_hours
INSERT INTO business_schema.special_hours (id, business_id, date, is_closed)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), '2024-12-25', TRUE);

-- Insert sample data into business_schema.attributes
INSERT INTO business_schema.attributes (
    business_id, good_for_kids, good_for_groups, outdoor_seating, takeout, delivery, wifi, parking, alcohol, bike_parking, 
    business_accepts_credit_cards, business_accepts_bitcoin, byob, byob_corkage, cater, coat_check, dogs_allowed, drivethru, 
    gender_neutral_restrooms, happy_hour, music, open_24_hours, reservations, romantic, smoking, wheelchair_accessible, 
    business_accepts_apple_pay, business_accepts_google_pay
)
VALUES (
    (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 
    TRUE, TRUE, TRUE, TRUE, TRUE, 'free', 
    '{"garage": true, "street": false, "validated": false, "lot": true, "valet": true}', 
    'full_bar', TRUE, TRUE, FALSE, FALSE, 'yes_corkage', TRUE, FALSE, FALSE, FALSE, 
    TRUE, TRUE, '{"dj": false, "background_music": true, "karaoke": false, "live": true, "video": false, "jukebox": false}', 
    FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE
);

-- Insert sample data into business_schema.payment_types
INSERT INTO business_schema.payment_types (business_id, credit_cards, bitcoin, apple_pay, google_pay, cash, paypal)
VALUES
((SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), TRUE, FALSE, TRUE, TRUE, TRUE, TRUE),
((SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), TRUE, FALSE, TRUE, TRUE, TRUE, TRUE);

-- Insert sample data into business_schema.media
INSERT INTO business_schema.media (id, business_id, logo, featured_image, gallery, portfolio, videos)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'https://example.com/logo1.jpg', 'https://example.com/featured1.jpg', ARRAY['https://example.com/gallery1.jpg', 'https://example.com/gallery2.jpg'], '[{"portfolio_id": "1", "title": "Project 1", "description": "Description 1", "images": ["https://example.com/portfolio1-1.jpg", "https://example.com/portfolio1-2.jpg"]}]', '[{"video_id": "1", "title": "Video 1", "url": "https://example.com/video1.mp4", "description": "Description 1"}]');

-- Insert sample data into business_schema.menus
INSERT INTO business_schema.menus (id, business_id, name)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Main Menu');

-- Insert sample data into business_schema.menu_sections
INSERT INTO business_schema.menu_sections (id, menu_id, name)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.menus WHERE name = 'Main Menu'), 'Appetizers');

-- Insert sample data into business_schema.menu_items
INSERT INTO business_schema.menu_items (id, section_id, name, description, price, photos)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.menu_sections WHERE name = 'Appetizers'), 'Spring Rolls', 'Crispy rolls with vegetables and meat', '$5.99', ARRAY['https://example.com/menu_item1.jpg']);

-- Insert sample data into business_schema.deals
INSERT INTO business_schema.deals (id, business_id, title, url, start_date, end_date, is_popular, what_you_get, important_restrictions, additional_restrictions)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), '50% off on all pizzas', 'https://example.com/deal1', '2024-01-01', '2024-01-31', TRUE, 'Half price on all pizzas', 'Only on weekdays', 'Not valid with other offers');

-- Insert sample data into business_schema.events
INSERT INTO business_schema.events (id, business_id, name, category, description, start_time, end_time, cost, is_canceled, is_free, tickets_url)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Live Music Night', 'Music', 'Enjoy live music every Friday night', '2024-07-25T20:00:00Z', '2024-07-25T23:00:00Z', 'Free', FALSE, TRUE, 'https://example.com/event1');

-- Insert sample data into business_schema.services
INSERT INTO business_schema.services (id, business_id, name, description, price)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Plumbing Repair', 'Fix any plumbing issue', '$50 per hour'),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'Construction Management', 'Manage your construction project from start to finish', '$100 per hour');

-- Insert sample data into business_schema.social_media
INSERT INTO business_schema.social_media (business_id, facebook, twitter, instagram, linkedin)
VALUES
((SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'https://facebook.com/business1', 'https://twitter.com/business1', 'https://instagram.com/business1', 'https://linkedin.com/company/business1'),
((SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'https://facebook.com/business2', 'https://twitter.com/business2', 'https://instagram.com/business2', 'https://linkedin.com/company/business2');

-- Insert sample data into business_schema.certifications
INSERT INTO business_schema.certifications (id, business_id, name, issuing_organization, issue_date, expiry_date)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Certified Plumber', 'Plumbing Association', '2020-01-01', '2025-01-01'),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'Certified Builder', 'Construction Association', '2020-01-01', '2025-01-01');

-- Insert sample data into business_schema.products
INSERT INTO business_schema.products (id, business_id, name, description, price, category, image_url)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Product 1', 'Description for product 1', '$19.99', 'Category 1', 'https://example.com/product1.jpg'),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'Product 2', 'Description for product 2', '$29.99', 'Category 2', 'https://example.com/product2.jpg');

-- Insert sample data into business_schema.ai_content
INSERT INTO business_schema.ai_content (business_id, overview, highlights, customer_reviews_summary)
VALUES
((SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'This business is renowned for its exceptional customer service and high-quality products.', ARRAY['Award-winning customer service', 'Eco-friendly products', 'Fast and reliable service'], 'Customers consistently praise the friendly staff and timely service. Many appreciate the attention to detail and the high quality of the products offered.'),
((SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'This business is known for its expert construction management and attention to detail.', ARRAY['Expert construction management', 'High-quality materials', 'Reliable and professional service'], 'Clients consistently commend the expert management and use of high-quality materials. Many value the reliability and professionalism of the staff.');

-- Insert sample data into business_schema.posts
INSERT INTO business_schema.posts (id, business_id, author, title, content, created_at)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Author 1', 'Post Title 1', 'Post content goes here...', NOW()),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'Author 2', 'Post Title 2', 'Another post content goes here...', NOW());

-- Insert sample data into business_schema.post_comments
INSERT INTO business_schema.post_comments (id, post_id, author, content, created_at)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.posts WHERE title = 'Post Title 1'), 'Commenter 1', 'Comment content goes here...', NOW()),
(uuid_generate_v4(), (SELECT id FROM business_schema.posts WHERE title = 'Post Title 2'), 'Commenter 2', 'Another comment content goes here...', NOW());

-- Insert sample data into business_schema.blogs
INSERT INTO business_schema.blogs (id, business_id, author, title, content, created_at)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Author 1', 'Blog Title 1', 'Blog content goes here...', NOW()),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'Author 2', 'Blog Title 2', 'Another blog content goes here...', NOW());

-- Insert sample data into business_schema.blog_comments
INSERT INTO business_schema.blog_comments (id, blog_id, author, content, created_at)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.blogs WHERE title = 'Blog Title 1'), 'Commenter 1', 'Blog comment content goes here...', NOW()),
(uuid_generate_v4(), (SELECT id FROM business_schema.blogs WHERE title = 'Blog Title 2'), 'Commenter 2', 'Another blog comment content goes here...', NOW());

-- Insert sample data into business_schema.reviews
INSERT INTO business_schema.reviews (id, business_id, url, text, rating, time_created, "user")
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'https://example.com/review1', 'Review text goes here...', 5, NOW(), '{"id": "user1", "name": "User 1"}'),
(uuid_generate_v4(), (SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'https://example.com/review2', 'Another review text goes here...', 4, NOW(), '{"id": "user2", "name": "User 2"}');

-- Insert sample data into business_schema.review_comments
INSERT INTO business_schema.review_comments (id, review_id, author, content, created_at)
VALUES
(uuid_generate_v4(), (SELECT id FROM business_schema.reviews WHERE text = 'Review text goes here...'), 'Commenter 1', 'Review comment content goes here...', NOW()),
(uuid_generate_v4(), (SELECT id FROM business_schema.reviews WHERE text = 'Another review text goes here...'), 'Commenter 2', 'Another review comment content goes here...', NOW());

-- Insert sample data into business_schema.restaurants
INSERT INTO business_schema.restaurants (business_id, cuisine_type, average_cost_for_two, reservations)
VALUES
((SELECT id FROM business_schema.businesses WHERE name = 'Business 1'), 'Italian', 40.00, TRUE);

-- Insert sample data into business_schema.construction_companies
INSERT INTO business_schema.construction_companies (business_id, license_number, bonding_information, insurance_information)
VALUES
((SELECT id FROM business_schema.businesses WHERE name = 'Business 2'), 'LIC12345', 'Bonding info', 'Insurance info');
