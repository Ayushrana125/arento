-- Insert Client Data
INSERT INTO clients (
  company_name,
  mobile_number,
  gst_number,
  billing_headline,
  office_address,
  company_logo
) VALUES (
  'Shree Ram Auto Parts',
  '9324641323',
  '27AABCU9603R1ZM',
  '|| श्री गणेशाय नमः ||',
  'Shop No. 3, Vishnu Niwas, Haridas Nagar, R.M. Bhattad Road, Opp. Pulse Hospital, Borivali (W), Mumbai - 400092',
  '/client_logo.png'
);

-- Insert User Data (replace 'YOUR_CLIENT_ID' with the actual client_id from above query)
INSERT INTO users (
  client_id,
  user_fullname,
  user_email,
  user_password,
  role
) VALUES (
  'YOUR_CLIENT_ID',
  'ayush_rana',
  'ayush@arentoapp.com',
  'password123',
  'Owner'
);
