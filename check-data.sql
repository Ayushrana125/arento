-- Check actual data in users table
SELECT user_id, client_id, user_fullname, user_password, user_email, role 
FROM users;

-- Check actual data in clients table
SELECT client_id, company_name, mobile_number, gst_number 
FROM clients;
