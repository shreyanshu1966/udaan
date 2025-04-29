// List of Indian States and Union Territories
export const indianStates = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DN', label: 'Dadra and Nagar Haveli' },
  { value: 'DD', label: 'Daman and Diu' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'LA', label: 'Ladakh' },
  { value: 'LD', label: 'Lakshadweep' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OD', label: 'Odisha' },
  { value: 'PY', label: 'Puducherry' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UK', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' }
];

// Sample district data - in a real app, this would be more comprehensive
// and possibly fetched from an API based on state selection
export const districtsByState = {
  'AP': [
    'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 
    'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 
    'Vizianagaram', 'West Godavari', 'YSR Kadapa', 'Sri Potti Sriramulu Nellore', 'Dr. B.R. Ambedkar Konaseema'
  ],
  'TN': [
    'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 
    'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Madurai', 
    'Nagapattinam', 'Nilgiris', 'Namakkal', 'Perambalur', 'Pudukkottai', 
    'Ramanathapuram', 'Salem', 'Sivaganga', 'Tiruchirapalli', 'Tirunelveli', 
    'Tiruvallur', 'Tiruvannamalai', 'Tuticorin', 'Thanjavur', 'Theni', 
    'Thoothukudi', 'Tiruvallur', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Ariyalur', 'Krishnagiri'
  ],
  'MH': [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 
    'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 
    'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 
    'Thane', 'Wardha', 'Washim', 'Yavatmal', 'Dharashiv', 'Amravati Rural'
  ],
  'KA': [
    'Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum', 'Bellary', 
    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Gulbarga', 'Hassan',
    'Haveri', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur',
    'Ramanagara', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Vijayapura',
    'Yadgir', 'Chikodi', 'Sirsi'
  ],
  'GJ': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
    'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
    'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
    'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
    'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
    'Tapi', 'Vadodara', 'Valsad', 'Dholka', 'Viramgam'
  ],
  'KL': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
    'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
    'Thiruvananthapuram', 'Thrissur', 'Wayanad', 'Muvattupuzha'
  ],
  'DL': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi',
    'South West Delhi', 'West Delhi'
  ],
  'UP': [
    'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha',
    'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur',
    'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bijnor', 'Budaun',
    'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah',
    'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar',
    'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur',
    'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
    'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar',
    'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba',
    'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad',
    'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur',
    'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli',
    'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur',
    'Unnao', 'Varanasi', 'Ayodhya', 'Noida'
  ],
  // Added missing states/UTs with at least one sample district each
  'AN': ['South Andaman', 'Nicobar'],
  'AR': ['Papum Pare', 'Tawang'],
  'AS': ['Kamrup', 'Dibrugarh'],
  'BR': ['Patna', 'Gaya'],
  'CH': ['Chandigarh'],
  'CT': ['Raipur', 'Bilaspur'],
  'DN': ['Dadra'],
  'DD': ['Diu'],
  'GA': ['North Goa', 'South Goa'],
  'HR': ['Gurugram', 'Faridabad'],
  'HP': ['Shimla', 'Kangra'],
  'JK': ['Srinagar', 'Jammu'],
  'JH': ['Ranchi', 'Dhanbad'],
  'LA': ['Leh'],
  'LD': ['Kavaratti'],
  'MP': ['Bhopal', 'Indore'],
  'MN': ['Imphal East', 'Imphal West'],
  'ML': ['East Khasi Hills'],
  'MZ': ['Aizawl'],
  'NL': ['Kohima'],
  'OD': ['Khordha', 'Cuttack'],
  'PY': ['Puducherry'],
  'PB': ['Ludhiana', 'Amritsar'],
  'RJ': ['Jaipur', 'Jodhpur'],
  'SK': ['East Sikkim'],
  'TG': ['Hyderabad', 'Warangal'],
  'TR': ['West Tripura'],
  'UK': ['Dehradun', 'Haridwar'],
  'WB': ['Kolkata', 'Howrah']
};

// Sample data for urban areas - would be fetched from API in a real app
export const urbanAreasByDistrict = {
  'Pune': ['Pune', 'Aundh', 'Baner', 'Hadapsar', 'Kharadi', 'Koregaon Park', 'Kothrud', 'Shivaji Nagar', 'Viman Nagar', 'Wakad', 'Yerawada', 'Katraj', 'Sinhagad Road'],
  'Mumbai Suburban': ['Andheri', 'Bandra', 'Borivali', 'Chembur', 'Ghatkopar', 'Goregaon', 'Kandivali', 'Kurla', 'Malad', 'Mulund', 'Powai', 'Vikhroli'],
  'Chennai': ['Adyar', 'Anna Nagar', 'Chromepet', 'Guindy', 'Mylapore', 'Nungambakkam', 'Porur', 'T. Nagar', 'Velachery', 'Tambaram'],
  'Bengaluru': ['Whitefield', 'Koramangala', 'Indiranagar', 'Jayanagar', 'Malleshwaram'],
  'Hyderabad': ['Banjara Hills', 'Gachibowli', 'Madhapur', 'Secunderabad'],
  'Delhi': ['Connaught Place', 'Karol Bagh', 'Dwarka', 'Saket'],
  'Kolkata': ['Salt Lake', 'Park Street', 'Behala'],
  'Patna': ['Kankarbagh', 'Patliputra'],
  'Jaipur': ['Malviya Nagar', 'Vaishali Nagar'],
  'Lucknow': ['Hazratganj', 'Gomti Nagar'],
  'Gurugram': ['DLF Phase 1', 'Sohna Road'],
  'Noida': ['Sector 18', 'Sector 62']
};

// Sample data for rural areas
export const tehsilsByDistrict = {
  'Pune': ['Ambegaon', 'Baramati', 'Bhor', 'Daund', 'Haveli', 'Indapur', 'Junnar', 'Khed', 'Maval', 'Mulshi', 'Purandhar', 'Shirur', 'Velhe'],
  'Nagpur': ['Hingna', 'Kamptee', 'Katol', 'Narkhed', 'Parseoni', 'Ramtek', 'Savner', 'Umred'],
  'Kurnool': ['Adoni', 'Alur', 'Atmakur', 'Banaganapalle', 'Dhone', 'Kodumur', 'Kurnool', 'Mantralayam', 'Nandyal', 'Pattikonda', 'Yemmiganur'],
  'Patna': ['Barh', 'Daniyawan'],
  'Jaipur': ['Amber', 'Sanganer'],
  'Bhopal': ['Berasia', 'Huzur'],
  'Gurugram': ['Sohna', 'Pataudi'],
  'Kolkata': ['Alipore'],
  'Chennai': ['Ambattur', 'Madhavaram']
};

export const villagesByTehsil = {
  'Baramati': ['Baramati', 'Bhigwan', 'Gulunche', 'Katewadi', 'Malad', 'Malegaon', 'Moregaon', 'Supa', 'Vaghapur'],
  'Khed': ['Chakan', 'Khed', 'Rajgurunagar', 'Wada', 'Warale'],
  'Mulshi': ['Lavasa', 'Paud', 'Pirangut', 'Tamhini', 'Wakad'],
  'Berasia': ['Berasia', 'Bhojpur'],
  'Amber': ['Amber', 'Amer'],
  'Barh': ['Barh', 'Bakhtiyarpur'],
  'Sohna': ['Sohna', 'Ghamroj'],
  'Alipore': ['Alipore', 'Budge Budge'],
  'Ambattur': ['Ambattur', 'Padi']
};

// Sample data for property identifier types
export const identifierTypes = [
  'Khasra Number',
  'Khata Number',
  'Survey Number',
  'Patta Number',
  'Municipal Property ID',
  'Plot Number (Urban)',
  'Flat Number (Urban)',
  'CERSAI Asset ID',
  'Mutation Number',
  'Other Unique ID'
];

// Property types for filtering
export const propertyTypes = [
  'Any', 
  'Agricultural Land', 
  'Residential Plot', 
  'Residential Building/Flat', 
  'Commercial Property', 
  'Industrial Property', 
  'Other'
];
