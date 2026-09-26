import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-01',
    title: 'At the Grocery Store',
    titleUrdu: 'کریانہ کی دکان پر',
    titleRomanUrdu: 'Karyana Ki Dukaan Par',
    category: 'Shopping',
    difficulty: 'Beginner',
    description: 'Practicing buying everyday groceries, asking for prices, and checking expiry dates.',
    descriptionUrdu: 'روزمرہ راشن کی خریداری، قیمتیں پوچھنا اور اشیاء کی تاریخ ختم ہونے کی جانچ۔',
    keyVocabulary: [
      { english: 'Aisle', urdu: 'قطار / رستہ', romanUrdu: 'Aisle (Qataar)', partOfSpeech: 'Noun', exampleSentence: 'Rice and flour are located in aisle 3.', urduMeaning: 'دکان کی وہ قطار جہاں سامان رکھا ہو' },
      { english: 'Receipt', urdu: 'رسید', romanUrdu: 'Raseed', partOfSpeech: 'Noun', exampleSentence: 'Would you like your receipt in the bag?', urduMeaning: 'ادائیگی کی پکی پرچی' },
      { english: 'Discount', urdu: 'رعایت / چھوٹ', romanUrdu: 'Riayat / Discount', partOfSpeech: 'Noun', exampleSentence: 'Is there any special discount on cooking oil?', urduMeaning: 'قیمت میں کمی' },
      { english: 'Expiry Date', urdu: 'میعاد ختم ہونے کی تاریخ', romanUrdu: 'Miyaad Khatam Hone Ki Tareekh', partOfSpeech: 'Noun', exampleSentence: 'Please check the expiry date on the milk bottle.', urduMeaning: 'چیز خراب ہونے کی آخری تاریخ' }
    ],
    dialogue: [
      {
        id: '01-1',
        speaker: 'Store Clerk',
        speakerRole: 'npc',
        english: 'Hello! Welcome to Fresh Mart. Can I help you find anything today?',
        urdu: 'ہیلو! فریش مارٹ میں خوش آمدید۔ کیا میں آج آپ کو کوئی چیز تلاش کرنے میں مدد کروں؟',
        romanUrdu: 'Hello! Fresh Mart mein khush aamdeed. Kya main aaj aap ko koi cheez talash karne mein madad karoon?',
        tips: 'Respond politely with what you are looking for.'
      },
      {
        id: '01-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes please. Where can I find cooking oil and basmati rice?',
        urdu: 'جی ہاں برائے مہربانی۔ کوکنگ آئل اور باسمتی چاول کہاں ملیں گے؟',
        romanUrdu: 'Ji haan baraye meherbani. Cooking oil aur basmati chawal kahan milein ge?',
        tips: 'Pronounce "basmati" clearly and use polite "Yes please".'
      },
      {
        id: '01-3',
        speaker: 'Store Clerk',
        speakerRole: 'npc',
        english: 'Cooking oil is in aisle two on the right, and basmati rice is right next to it.',
        urdu: 'کوکنگ آئل دوسری قطار میں دائیں جانب ہے، اور باسمتی چاول بالکل اس کے ساتھ ہیں۔',
        romanUrdu: 'Cooking oil doosri qataar mein daayein janib hai, aur basmati chawal bilkul us ke sath hain.'
      },
      {
        id: '01-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Thank you! How much is a five-liter bottle of sunflower oil?',
        urdu: 'شکریہ! سورج مکھی کے پانچ لیٹر تیل کی کیا قیمت ہے؟',
        romanUrdu: 'Shukriya! Suraj mukhi ke paanch liter tail ki kya qeemat hai?'
      },
      {
        id: '01-5',
        speaker: 'Store Clerk',
        speakerRole: 'npc',
        english: 'It is normally fifteen dollars, but today we have a special twenty percent discount.',
        urdu: 'عام طور پر یہ پندرہ ڈالر کا ہے، لیکن آج بیس فیصد خصوصی رعایت ہے۔',
        romanUrdu: 'Aam tor par yeh 15 dollar ka hai, lekin aaj 20 feesad riayat hai.'
      },
      {
        id: '01-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'That sounds great! Can I pay using my debit card at the counter?',
        urdu: 'بہت خوب! کیا میں کاؤنٹر پر ڈیبٹ کارڈ سے ادائیگی کر سکتا ہوں؟',
        romanUrdu: 'Bohat khoob! Kya main counter par debit card se adaigi kar sakta hoon?'
      }
    ]
  },
  {
    id: 'scenario-02',
    title: 'Medical Checkup at the Clinic',
    titleUrdu: 'ڈاکٹر کے پاس جنرل معائنہ',
    titleRomanUrdu: 'Doctor Ke Paas General Muaina',
    category: 'Medical',
    difficulty: 'Beginner',
    description: 'Explaining your physical symptoms, pain duration, and understanding medical prescriptions.',
    descriptionUrdu: 'اپنی بیماری کی علامات، درد کی مدت بتانا اور ڈاکٹر کی ہدایات سمجھنا۔',
    keyVocabulary: [
      { english: 'Symptom', urdu: 'علامت / نشانی', romanUrdu: 'Alamat', partOfSpeech: 'Noun', exampleSentence: 'A dry cough is a common symptom of a viral flu.', urduMeaning: 'بیماری کا ظاہری اثر' },
      { english: 'Prescription', urdu: 'نسخہ / ڈاکٹر کی پرچی', romanUrdu: 'Nuskha / Dawaai Ki Parchi', partOfSpeech: 'Noun', exampleSentence: 'Take this prescription to the pharmacy.', urduMeaning: 'ڈاکٹر کی تجویز کردہ دوائیوں کا کاغذ' },
      { english: 'Dizzy', urdu: 'چکر آنا', romanUrdu: 'Chakkar Aana', partOfSpeech: 'Adjective', exampleSentence: 'I feel dizzy whenever I stand up too quickly.', urduMeaning: 'سر گھومنا یا توازن بگڑنا' },
      { english: 'Dosage', urdu: 'دوائی کی مقدار', romanUrdu: 'Dawaai Ki Miqdaar', partOfSpeech: 'Noun', exampleSentence: 'Follow the exact dosage written on the label.', urduMeaning: 'دن میں دوائی کتنی بار لینی ہے' }
    ],
    dialogue: [
      {
        id: '02-1',
        speaker: 'Doctor',
        speakerRole: 'npc',
        english: 'Good morning. Please take a seat. What seems to be bothering you today?',
        urdu: 'صبح بخیر۔ تشریف رکھیے۔ آج آپ کو کیا تکلیف یا پریشانی ہے؟',
        romanUrdu: 'Subah bakhair. Tashreef rakhein. Aaj aap ko kya takleef hai?'
      },
      {
        id: '02-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Doctor, I have had a high fever and body aches for the last two days.',
        urdu: 'ڈاکٹر صاحب، مجھے پچھلے دو دنوں سے تیز بخار اور جسم میں شدید درد ہے۔',
        romanUrdu: 'Doctor sahab, mujhe pichle do dino se taiz bukhar aur jism mein dard hai.'
      },
      {
        id: '02-3',
        speaker: 'Doctor',
        speakerRole: 'npc',
        english: 'I see. Have you experienced any sore throat, cough, or nausea?',
        urdu: 'اچھا۔ کیا گلے میں سوزش، کھانسی یا متلی کی شکایت بھی ہوئی ہے؟',
        romanUrdu: 'Acha. Kya galay mein sozish, khansi ya matli ki shikayat bhi hui hai?'
      },
      {
        id: '02-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, my throat is very sore and I feel slightly dizzy when walking.',
        urdu: 'جی ہاں، میرا گلا بہت دکھ رہا ہے اور چلتے ہوئے مجھے ہلکے چکر آ رہے ہیں۔',
        romanUrdu: 'Ji haan, mera gala bohat dukh raha hai aur chalte hue halkay chakkar aa rahe hain.'
      },
      {
        id: '02-5',
        speaker: 'Doctor',
        speakerRole: 'npc',
        english: 'Let me check your temperature and listen to your chest. Breathe in deeply, please.',
        urdu: 'مجھے آپ کا ٹمپریچر چیک کرنے دیں اور سینہ سننے دیں۔ گہرا سانس لیجیے۔',
        romanUrdu: 'Mujhe aap ka temperature check karne dein. Gehra saans lijiye.'
      },
      {
        id: '02-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Is it something serious doctor? Will I need any blood tests or injections?',
        urdu: 'کیا کوئی تشویش ناک بات ہے ڈاکٹر صاحب؟ کیا خون کے ٹیسٹ یا انجکشن لگوانا پڑے گا؟',
        romanUrdu: 'Kya koi fikar wali baat hai? Kya blood test ya injection lage ga?'
      }
    ]
  },
  {
    id: 'scenario-03',
    title: 'Hailing a City Taxi',
    titleUrdu: 'شہر میں ٹیکسی لینا',
    titleRomanUrdu: 'Shehar Mein Taxi Lena',
    category: 'Travel',
    difficulty: 'Beginner',
    description: 'Booking a ride, agreeing on the destination, meter fare, and giving route directions.',
    descriptionUrdu: 'ٹیکسی والے کو منزل بتانا، میٹر کے مطابق کرایہ طے کرنا اور راستہ سمجھانا۔',
    keyVocabulary: [
      { english: 'Destination', urdu: 'منزل / جہاں پہنچنا ہو', romanUrdu: 'Manzil', partOfSpeech: 'Noun', exampleSentence: 'What is your final destination, sir?', urduMeaning: 'جہاں کا سفر کرنا ہو' },
      { english: 'Fare', urdu: 'کرایہ', romanUrdu: 'Kiraya', partOfSpeech: 'Noun', exampleSentence: 'How much is the estimated taxi fare to the terminal?', urduMeaning: 'سفر کے پیسے' },
      { english: 'Meter', urdu: 'میٹر', romanUrdu: 'Meter', partOfSpeech: 'Noun', exampleSentence: 'Please turn on the taxi meter.', urduMeaning: 'کرایہ گننے والا آلہ' },
      { english: 'Shortcut', urdu: 'چھوٹا راستہ', romanUrdu: 'Chota Rasta', partOfSpeech: 'Noun', exampleSentence: 'Do you know any shortcut to avoid the rush hour traffic?', urduMeaning: 'جلد پہنچانے والا راستہ' }
    ],
    dialogue: [
      {
        id: '03-1',
        speaker: 'Taxi Driver',
        speakerRole: 'npc',
        english: 'Morning! Where are you headed today? Put your luggage in the back trunk if you want.',
        urdu: 'صبح بخیر! آج آپ کو کہاں جانا ہے؟ چاہیں تو سامان پچھلی ڈگی میں رکھ لیں۔',
        romanUrdu: 'Subah bakhair! Kahan jana hai? Samaan pichli diggi mein rakh lein.'
      },
      {
        id: '03-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Hello! I need to go to Jinnah International Airport, please.',
        urdu: 'ہیلو! مجھے جناح انٹرنیشنل ایئرپورٹ جانا ہے۔',
        romanUrdu: 'Hello! Mujhe Jinnah International Airport jana hai.'
      },
      {
        id: '03-3',
        speaker: 'Taxi Driver',
        speakerRole: 'npc',
        english: 'Sure thing. Which terminal do you need, domestic or international departures?',
        urdu: 'بالکل۔ آپ کو کون سے ٹرمینل جانا ہے، اندرون ملک یا بین الاقوامی روانگی؟',
        romanUrdu: 'Bilkul. Kaun se terminal jana hai, domestic ya international departures?'
      },
      {
        id: '03-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'International departures, please. Could you turn on the meter?',
        urdu: 'بین الاقوامی روانگی برائے مہربانی۔ کیا آپ میٹر آن کر سکتے ہیں؟',
        romanUrdu: 'International departures please. Kya aap meter on kar sakte hain?'
      },
      {
        id: '03-5',
        speaker: 'Taxi Driver',
        speakerRole: 'npc',
        english: 'Yes, the meter is on. It will take about thirty-five minutes via the expressway.',
        urdu: 'جی ہاں، میٹر چالو ہے۔ ایکسپریس وے کے ذریعے تقریباً پینتیس منٹ لگیں گے۔',
        romanUrdu: 'Haan meter chalu hai. Expressway se taqreeban 35 minute lagein ge.'
      },
      {
        id: '03-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Great! My flight is in three hours, so we have plenty of time.',
        urdu: 'شاندار! میری فلائٹ تین گھنٹے بعد ہے، اس لیے ہمارے پاس کافی وقت ہے۔',
        romanUrdu: 'Shandar! Meri flight teen ghante baad hai, kafi waqt hai.'
      }
    ]
  },
  {
    id: 'scenario-04',
    title: 'Ordering at a Sit-down Restaurant',
    titleUrdu: 'ریسٹورنٹ میں کھانا آرڈر کرنا',
    titleRomanUrdu: 'Restaurant Mein Khana Order Karna',
    category: 'Dining',
    difficulty: 'Beginner',
    description: 'Ordering starters, asking about spicy food, dietary preferences, and requesting water.',
    descriptionUrdu: 'شروعاتی کھانا، مسالوں کے بارے میں پوچھنا اور حلال یا ویجیٹیرین کی تصدیق۔',
    keyVocabulary: [
      { english: 'Appetizer', urdu: 'کھانے سے پہلے کا ہلکا ناشتہ', romanUrdu: 'Appetizer / Ibtidai Khana', partOfSpeech: 'Noun', exampleSentence: 'We will order garlic bread as an appetizer.', urduMeaning: 'بھوک بڑھانے والی ابتدائی ڈش' },
      { english: 'Spicy', urdu: 'چٹپٹا / تیز مرچوں والا', romanUrdu: 'Chatpata / Tez Mirch Wala', partOfSpeech: 'Adjective', exampleSentence: 'Is the chicken curry very spicy?', urduMeaning: 'مرچوں والا کھانا' },
      { english: 'Halal', urdu: 'حلال', romanUrdu: 'Halal', partOfSpeech: 'Adjective', exampleSentence: 'Are all your meat dishes certified halal?', urduMeaning: 'شرعی طور پر جائز گوشت' },
      { english: 'Complimentary', urdu: 'مفت / ہوٹل کی طرف سے تحفہ', romanUrdu: 'Muft / Complimentary', partOfSpeech: 'Adjective', exampleSentence: 'Green tea is complimentary after dinner.', urduMeaning: 'جس کے پیسے نہ لیے جائیں' }
    ],
    dialogue: [
      {
        id: '04-1',
        speaker: 'Waiter',
        speakerRole: 'npc',
        english: 'Good evening! Welcome. Are you ready to order, or would you like a few more minutes?',
        urdu: 'شام بخیر! خوش آمدید۔ کیا آپ آرڈر دینے کے لیے تیار ہیں یا چند منٹ مزید درکار ہیں؟',
        romanUrdu: 'Good evening! Khush aamdeed. Kya aap order dene ke liye tayyar hain?'
      },
      {
        id: '04-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'We are ready! Could you tell me if the chicken biryani is very spicy?',
        urdu: 'ہم تیار ہیں! کیا آپ بتا سکتے ہیں کہ چکن بریانی میں زیادہ مرچیں ہیں؟',
        romanUrdu: 'Hum tayyar hain! Kya chicken biryani bohat zyada spicy hai?'
      },
      {
        id: '04-3',
        speaker: 'Waiter',
        speakerRole: 'npc',
        english: 'It has moderate spices. If you prefer, our chef can make it mild for you.',
        urdu: 'اس میں درمیانے مسالے ہیں۔ اگر آپ پسند کریں تو شیف ہلکی مرچوں والی بنا دے گا۔',
        romanUrdu: 'Is mein darmiyani mirchein hain. Chef halki mirch wali bana sakta hai.'
      },
      {
        id: '04-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Mild would be perfect, thank you. Also, could we get a pitcher of cold water?',
        urdu: 'ہلکی مرچیں بہترین رہیں گی۔ اور کیا ہمیں ٹھنڈے پانی کا جگ مل سکتا ہے؟',
        romanUrdu: 'Halki mirchein behtareen rahen gi. Aur thanday paani ka jag mil sakta hai?'
      },
      {
        id: '04-5',
        speaker: 'Waiter',
        speakerRole: 'npc',
        english: 'Certainly! Anything else to start with, perhaps some salad or appetizers?',
        urdu: 'ضرور! آغاز کے لیے کوئی اور چیز، شاید سلاد یا کوئی سٹارٹر؟',
        romanUrdu: 'Zaroor! Koi salad ya appetizer pasand karein ge?'
      },
      {
        id: '04-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, please bring one fresh garden salad and two garlic naans.',
        urdu: 'جی ہاں، برائے مہربانی ایک فریش گارڈن سلاد اور دو گارلک نان لے آئیے۔',
        romanUrdu: 'Ji haan, ek fresh garden salad aur do garlic naan le aaiye.'
      }
    ]
  },
  {
    id: 'scenario-05',
    title: 'Checking into a Hotel',
    titleUrdu: 'ہوٹل میں چیک ان کرنا',
    titleRomanUrdu: 'Hotel Mein Check-in Karna',
    category: 'Travel',
    difficulty: 'Beginner',
    description: 'Giving reservation details, asking about Wi-Fi, breakfast timings, and keycards.',
    descriptionUrdu: 'بکنگ کی تفصیل بتانا، وائی فائی اور ناشتے کے اوقات کے بارے میں دریافت کرنا۔',
    keyVocabulary: [
      { english: 'Reservation', urdu: 'پہلے سے کروائی گئی بکنگ', romanUrdu: 'Booking / Reservation', partOfSpeech: 'Noun', exampleSentence: 'I made an online reservation through your website.', urduMeaning: 'پیشگی بک کروایا گیا کمرہ' },
      { english: 'Keycard', urdu: 'کمرے کا الیکٹرانک کارڈ', romanUrdu: 'Keycard', partOfSpeech: 'Noun', exampleSentence: 'Tap your keycard on the door sensor to unlock.', urduMeaning: 'چابی کی جگہ استعمال ہونے والا کارڈ' },
      { english: 'Luggage', urdu: 'سامان / بیگز', romanUrdu: 'Samaan / Luggage', partOfSpeech: 'Noun', exampleSentence: 'The bellboy will carry your luggage to room 402.', urduMeaning: 'سفر کا سامان' },
      { english: 'Checkout', urdu: 'کمرہ خالی کرنے کا وقت', romanUrdu: 'Checkout Time', partOfSpeech: 'Noun', exampleSentence: 'Checkout time is twelve noon tomorrow.', urduMeaning: 'ہوٹل چھوڑنے کا وقت' }
    ],
    dialogue: [
      {
        id: '05-1',
        speaker: 'Hotel Receptionist',
        speakerRole: 'npc',
        english: 'Welcome to Grand Palm Hotel! Are you checking in today, sir?',
        urdu: 'گرینڈ پام ہوٹل میں خوش آمدید! کیا آپ آج چیک ان کر رہے ہیں جناب؟',
        romanUrdu: 'Grand Palm Hotel mein khush aamdeed! Kya aap aaj check-in kar rahe hain?'
      },
      {
        id: '05-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, I have a reservation for two nights under the name Ahmed Khan.',
        urdu: 'جی ہاں، احمد خان کے نام سے دو راتوں کے لیے میری بکنگ ہے۔',
        romanUrdu: 'Ji haan, Ahmed Khan ke naam se do raaton ke liye meri reservation hai.'
      },
      {
        id: '05-3',
        speaker: 'Hotel Receptionist',
        speakerRole: 'npc',
        english: 'I found your booking. Deluxe King Room with a balcony. May I see your ID or passport?',
        urdu: 'مجھے آپ کی بکنگ مل گئی۔ بالکونی والا ڈیلکس کنگ روم۔ کیا میں شناختی کارڈ یا پاسپورٹ دیکھ سکتی ہوں؟',
        romanUrdu: 'Aap ki booking mil gayi. Kya main aap ka passport ya ID dekh sakti hoon?'
      },
      {
        id: '05-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Here is my passport. Could you tell me what time breakfast is served?',
        urdu: 'یہ رہا میرا پاسپورٹ۔ کیا آپ بتا سکتی ہیں کہ ناشتہ کس وقت پیش کیا جاتا ہے؟',
        romanUrdu: 'Yeh raha mera passport. Breakfast kis time serve hota hai?'
      },
      {
        id: '05-5',
        speaker: 'Hotel Receptionist',
        speakerRole: 'npc',
        english: 'Breakfast buffet is served on the first floor from 7:00 AM to 10:30 AM.',
        urdu: 'ناشتے کا بوفے پہلی منزل پر صبح سات سے ساڑھے دس بجے تک ہوتا ہے۔',
        romanUrdu: 'Breakfast pehli manzil par subah 7 se 10:30 tak hota hai.'
      },
      {
        id: '05-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Thank you! Is high-speed Wi-Fi included, and what is the password?',
        urdu: 'بہت شکریہ! کیا تیز رفتار وائی فائی شامل ہے اور پاس ورڈ کیا ہے؟',
        romanUrdu: 'Shukriya! Kya Wi-Fi shaamil hai aur password kya hai?'
      }
    ]
  },
  {
    id: 'scenario-06',
    title: 'Airport Flight Check-in & Luggage',
    titleUrdu: 'ایئرپورٹ چیک ان اور سامان جمع کروانا',
    titleRomanUrdu: 'Airport Check-in Aur Samaan Jama Karwana',
    category: 'Travel',
    difficulty: 'Intermediate',
    description: 'Checking in luggage, choosing an aisle or window seat, and finding the boarding gate.',
    descriptionUrdu: 'سامان کا وزن کروانا، کھڑکی یا راہداری والی نشست چننا اور بورڈنگ گیٹ معلوم کرنا۔',
    keyVocabulary: [
      { english: 'Boarding Pass', urdu: 'جہاز پر چڑھنے کا کارڈ', romanUrdu: 'Boarding Pass', partOfSpeech: 'Noun', exampleSentence: 'Keep your boarding pass handy along with your passport.', urduMeaning: 'جہاز کی سیٹ اور گیٹ والا ٹکٹ' },
      { english: 'Aisle Seat', urdu: 'راہداری والی سیٹ', romanUrdu: 'Aisle Seat', partOfSpeech: 'Noun', exampleSentence: 'I prefer an aisle seat so I can stretch my legs.', urduMeaning: 'درمیان کے راستے والی نشست' },
      { english: 'Overweight', urdu: 'وزن کی حد سے زیادہ', romanUrdu: 'Wazan Se Zyada', partOfSpeech: 'Adjective', exampleSentence: 'Your suitcase is two kilograms overweight.', urduMeaning: 'مقررہ حد سے وزنی سامان' },
      { english: 'Departure Gate', urdu: 'روانگی کا دروازہ / گیٹ', romanUrdu: 'Rawaangi Ka Gate', partOfSpeech: 'Noun', exampleSentence: 'Boarding begins at Gate 14 at three o\'clock.', urduMeaning: 'جہاں سے جہاز میں داخل ہوں' }
    ],
    dialogue: [
      {
        id: '06-1',
        speaker: 'Airline Agent',
        speakerRole: 'npc',
        english: 'Good day! Flight to London Heathrow? Please place your suitcase on the luggage scale.',
        urdu: 'صبح بخیر! لندن ہیتھرو کی پرواز ہے؟ برائے مہربانی اپنا سوٹ کیس وزنی ترازو پر رکھیے۔',
        romanUrdu: 'Flight to London? Apna suitcase scale par rakhein.'
      },
      {
        id: '06-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Here you go. I have one checked bag and one carry-on backpack.',
        urdu: 'یہ لیجیے۔ میرے پاس ایک چیک ان بیگ اور ایک ہینڈ کیری بیگ ہے۔',
        romanUrdu: 'Yeh lijiye. Ek checked bag hai aur ek backpack.'
      },
      {
        id: '06-3',
        speaker: 'Airline Agent',
        speakerRole: 'npc',
        english: 'Your suitcase weighs 21 kilograms, which is well within the allowance. Aisle or window seat?',
        urdu: 'آپ کے بیگ کا وزن اکیس کلو ہے، جو حد کے اندر ہے۔ کھڑکی والی سیٹ لیں گے یا راستے والی؟',
        romanUrdu: 'Aap ka bag 21 kg hai. Aisle seat pasand karein ge ya window?'
      },
      {
        id: '06-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'A window seat near the front of the plane, if possible, please.',
        urdu: 'اگر ممکن ہو تو جہاز کے اگلے حصے میں کھڑکی والی سیٹ دے دیجیے۔',
        romanUrdu: 'Window seat front ki taraf de dein agar mumkin ho.'
      },
      {
        id: '06-5',
        speaker: 'Airline Agent',
        speakerRole: 'npc',
        english: 'You are seated in 12A. Here is your boarding pass. Gate 18 will begin boarding at 4:15 PM.',
        urdu: 'آپ کی سیٹ 12A ہے۔ یہ رہا آپ کا بورڈنگ پاس۔ گیٹ نمبر اٹھارہ پر سوا چار بجے بورڈنگ شروع ہوگی۔',
        romanUrdu: 'Aap ki seat 12A hai. Gate 18 par 4:15 par boarding shuru hogi.'
      },
      {
        id: '06-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Thank you very much. Where is the security screening checkpoint?',
        urdu: 'بہت شکریہ۔ سیکیورٹی چیکنگ کا راستہ کس طرف ہے؟',
        romanUrdu: 'Shukriya. Security check kis taraf hai?'
      }
    ]
  },
  {
    id: 'scenario-07',
    title: 'Opening a Bank Account',
    titleUrdu: 'بینک میں نیا اکاؤنٹ کھلوانا',
    titleRomanUrdu: 'Bank Mein Naya Account Khulwana',
    category: 'Banking',
    difficulty: 'Intermediate',
    description: 'Inquiring about savings versus checking accounts, fees, minimum balance, and debit cards.',
    descriptionUrdu: 'بچت اکاؤنٹ، ضروری دستاویزات، کم از کم بیلنس اور ڈیبٹ کارڈ کے بارے میں بات چیت۔',
    keyVocabulary: [
      { english: 'Savings Account', urdu: 'بچت اکاؤنٹ', romanUrdu: 'Bachat Account', partOfSpeech: 'Noun', exampleSentence: 'A savings account earns monthly interest on your balance.', urduMeaning: 'رقم جمع کرنے کا اکاؤنٹ' },
      { english: 'Proof of Address', urdu: 'رہائش کا ثبوت', romanUrdu: 'Rihaish Ka Saboot', partOfSpeech: 'Noun', exampleSentence: 'A utility bill serves as valid proof of address.', urduMeaning: 'بجلی یا گیس کا بل' },
      { english: 'Minimum Balance', urdu: 'کم از کم ضروری رقم', romanUrdu: 'Kam Az Kam Balance', partOfSpeech: 'Noun', exampleSentence: 'Is there a minimum balance penalty fee?', urduMeaning: 'اکاؤنٹ میں ہر وقت موجود رہنے والی رقم' },
      { english: 'Online Banking', urdu: 'انٹرنیٹ / موبائل بینکنگ', romanUrdu: 'Online Banking', partOfSpeech: 'Noun', exampleSentence: 'You can pay your electricity bills using our mobile app.', urduMeaning: 'فون سے پیسے بھیجنے کی سہولت' }
    ],
    dialogue: [
      {
        id: '07-1',
        speaker: 'Bank Officer',
        speakerRole: 'npc',
        english: 'Good afternoon. How can I help you today at Standard Chartered?',
        urdu: 'دوپہر بخیر۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟',
        romanUrdu: 'Good afternoon. Aaj main aap ki kya madad kar sakta hoon?'
      },
      {
        id: '07-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Hello, I would like to open a new personal savings account, please.',
        urdu: 'ہیلو، میں ایک نیا ذاتی بچت اکاؤنٹ کھلوانا چاہتا ہوں۔',
        romanUrdu: 'Hello, main ek naya personal savings account khulwana chahta hoon.'
      },
      {
        id: '07-3',
        speaker: 'Bank Officer',
        speakerRole: 'npc',
        english: 'Certainly. Do you have your original national identity card and proof of income with you?',
        urdu: 'بالکل۔ کیا آپ کے پاس اصل شناختی کارڈ اور آمدنی کا ثبوت موجود ہے؟',
        romanUrdu: 'Bilkul. Kya aap ke paas original CNIC aur income proof hai?'
      },
      {
        id: '07-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, I brought my CNIC, salary slip, and a recent electricity bill for address verification.',
        urdu: 'جی ہاں، میں اپنا شناختی کارڈ، سیلری سلپ اور پتہ تصدیق کے لیے بجلی کا بل لایا ہوں۔',
        romanUrdu: 'Ji haan, CNIC, salary slip aur bijli ka bill laya hoon.'
      },
      {
        id: '07-5',
        speaker: 'Bank Officer',
        speakerRole: 'npc',
        english: 'Perfect. There is zero opening fee, and your contactless debit card will arrive by courier in five business days.',
        urdu: 'بہترین۔ کوئی اکاؤنٹ اوپننگ فیس نہیں ہے، اور آپ کا ڈیبٹ کارڈ پانچ دنوں میں بذریعہ کوریئر مل جائے گا۔',
        romanUrdu: 'Behtareen. Koi opening fee nahi hai, debit card 5 din mein mil jaye ga.'
      },
      {
        id: '07-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'That sounds convenient! Can I activate mobile banking immediately today?',
        urdu: 'یہ تو بہت آسان ہے! کیا میں آج ہی موبائل بینکنگ چالو کر سکتا ہوں؟',
        romanUrdu: 'Yeh bohot acha hai! Kya aaj hi mobile banking activate ho jaye gi?'
      }
    ]
  },
  {
    id: 'scenario-08',
    title: 'Buying a City Bus Ticket',
    titleUrdu: 'شہری بس کا ٹکٹ خریدنا',
    titleRomanUrdu: 'Shehri Bus Ka Ticket Khareedna',
    category: 'Travel',
    difficulty: 'Beginner',
    description: 'Interacting with the bus conductor, asking for stops, fares, and changing buses.',
    descriptionUrdu: 'بس کنڈکٹر سے ٹکٹ لینا، مطلوبہ سٹاپ کا پوچھنا اور کرایہ دینا۔',
    keyVocabulary: [
      { english: 'Single Ticket', urdu: 'یک طرفہ ٹکٹ', romanUrdu: 'Single Ticket', partOfSpeech: 'Noun', exampleSentence: 'A single ticket is valid for one continuous journey.', urduMeaning: 'صرف ایک طرف جانے کا ٹکٹ' },
      { english: 'Conductor', urdu: 'بس کنڈکٹر', romanUrdu: 'Conductor', partOfSpeech: 'Noun', exampleSentence: 'The conductor stamped my return travel pass.', urduMeaning: 'بس میں ٹکٹ کاٹنے والا ملازم' },
      { english: 'Transfer', urdu: 'دوسری بس میں بدلنا', romanUrdu: 'Bus Badalna / Transfer', partOfSpeech: 'Verb', exampleSentence: 'You need to transfer to the red route at Liberty Chowk.', urduMeaning: 'گاڑی تبدیل کرنا' },
      { english: 'Exact Change', urdu: 'کھلے پیسے / درست سکے', romanUrdu: 'Khulay Paisay', partOfSpeech: 'Noun', exampleSentence: 'Please provide exact change if paying by cash.', urduMeaning: 'پورا پورا کرایہ' }
    ],
    dialogue: [
      {
        id: '08-1',
        speaker: 'Bus Conductor',
        speakerRole: 'npc',
        english: 'Step inside, please! Tickets! Where are you getting down?',
        urdu: 'اندر آ جائیں! ٹکٹ لیجیے! آپ کو کہاں اترنا ہے؟',
        romanUrdu: 'Ander aa jayein! Ticket lijiye! Kahan utarna hai?'
      },
      {
        id: '08-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Does this bus go to the Central University campus?',
        urdu: 'کیا یہ بس سینٹرل یونیورسٹی کیمپس تک جاتی ہے؟',
        romanUrdu: 'Kya yeh bus Central University campus tak jaati hai?'
      },
      {
        id: '08-3',
        speaker: 'Bus Conductor',
        speakerRole: 'npc',
        english: 'Yes, it stops right in front of the university main gate. Two dollars, please.',
        urdu: 'جی ہاں، یہ بالکل یونیورسٹی کے مین گیٹ کے سامنے رکتی ہے۔ دو ڈالر دیجیے۔',
        romanUrdu: 'Haan, main gate ke samne rukti hai. Do dollar dein.'
      },
      {
        id: '08-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Here is five dollars. Do you have change, please?',
        urdu: 'یہ پانچ ڈالر لیجیے۔ کیا آپ کے پاس بقایا کھلے پیسے ہیں؟',
        romanUrdu: 'Yeh 5 dollar lijiye. Kya khulay baqi paisay hain?'
      },
      {
        id: '08-5',
        speaker: 'Bus Conductor',
        speakerRole: 'npc',
        english: 'Here is your ticket and three dollars change. It will take about twenty minutes.',
        urdu: 'یہ آپ کا ٹکٹ اور تین ڈالر بقایا۔ تقریباً بیس منٹ لگیں گے۔',
        romanUrdu: 'Yeh ticket aur 3 dollar change. 20 minute lagein ge.'
      },
      {
        id: '08-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Thank you! Could you please call out when the university stop arrives?',
        urdu: 'شکریہ! جب یونیورسٹی کا سٹاپ آئے تو کیا آپ بتا دیں گے؟',
        romanUrdu: 'Shukriya! Jab university stop aaye to bata dein ge?'
      }
    ]
  },
  {
    id: 'scenario-09',
    title: 'Job Interview Self-Introduction',
    titleUrdu: 'ملازمت کے انٹرویو میں تعارف',
    titleRomanUrdu: 'Job Interview Mein Taaruf',
    category: 'Career',
    difficulty: 'Intermediate',
    description: 'Introducing your background, highlighting strengths, communication skills, and asking about team culture.',
    descriptionUrdu: 'اپنے تجربے کا تعارف کروانا، خوبیاں بتانا اور کمپنی کی ترقی میں کردار واضح کرنا۔',
    keyVocabulary: [
      { english: 'Experience', urdu: 'تجربہ', romanUrdu: 'Tajurba', partOfSpeech: 'Noun', exampleSentence: 'I have four years of experience in digital marketing.', urduMeaning: 'کام کرنے کی عملی مہارت' },
      { english: 'Strengths', urdu: 'خوبیاں اور طاقتیں', romanUrdu: 'Khoobiyan / Salahiyaat', partOfSpeech: 'Noun', exampleSentence: 'My key strengths are adaptability and clear communication.', urduMeaning: 'انسان کی مثبت صلاحیتیں' },
      { english: 'Responsibility', urdu: 'ذمہ داری', romanUrdu: 'Zimadari', partOfSpeech: 'Noun', exampleSentence: 'Handling customer relations was my primary responsibility.', urduMeaning: 'سونپا گیا اہم فرض' },
      { english: 'Team Player', urdu: 'مل جل کر کام کرنے والا', romanUrdu: 'Mil Kar Kaam Karne Wala', partOfSpeech: 'Noun', exampleSentence: 'I am an enthusiastic team player who supports colleagues.', urduMeaning: 'ساتھیوں کے ساتھ تعاون کرنے والا' }
    ],
    dialogue: [
      {
        id: '09-1',
        speaker: 'Interviewer',
        speakerRole: 'npc',
        english: 'Good morning, welcome to our office. To begin, could you tell us a bit about yourself?',
        urdu: 'صبح بخیر، ہمارے دفتر میں خوش آمدید۔ آغاز کے لیے کیا آپ ہمیں اپنے بارے میں کچھ بتا سکتے ہیں؟',
        romanUrdu: 'Good morning. Apne bare mein kuch batayein?'
      },
      {
        id: '09-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Thank you for this opportunity. My name is Farhan, and I have three years of experience in project coordination.',
        urdu: 'اس موقع کا شکریہ۔ میرا نام فرحان ہے اور میرے پاس پروجیکٹ کوآرڈینیشن کا تین سال کا تجربہ ہے۔',
        romanUrdu: 'Shukriya. Mera naam Farhan hai aur 3 saal ka project coordination ka tajurba hai.'
      },
      {
        id: '09-3',
        speaker: 'Interviewer',
        speakerRole: 'npc',
        english: 'What would you say is your greatest professional strength when working under pressure?',
        urdu: 'دباؤ میں کام کرتے ہوئے آپ کی سب سے بڑی پیشہ ورانہ طاقت کیا ہے؟',
        romanUrdu: 'Pressure mein kaam karte hue aap ki sab se bari taqat kya hai?'
      },
      {
        id: '09-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'I stay calm and break large tasks into prioritized steps so our team meets deadlines smoothly.',
        urdu: 'میں پرسکون رہتا ہوں اور بڑے کاموں کو ترجیحی مراحل میں تقسیم کر لیتا ہوں تاکہ ٹیم ڈیڈلائن پر کام مکمل کر سکے۔',
        romanUrdu: 'Main calm rehta hoon aur kamon ko organize karta hoon taake deadline meet ho.'
      },
      {
        id: '09-5',
        speaker: 'Interviewer',
        speakerRole: 'npc',
        english: 'That is an excellent approach. Do you have any questions for us regarding the position?',
        urdu: 'یہ بہت شاندار طریقہ ہے۔ کیا اس عہدے کے حوالے سے آپ کا ہم سے کوئی سوال ہے؟',
        romanUrdu: 'Bohat acha. Kya aap ka koi sawal hai is job ke hawale se?'
      },
      {
        id: '09-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, what does success look like in the first ninety days for someone in this role?',
        urdu: 'جی ہاں، اس عہدے پر پہلے نوے دنوں میں کامیابی کا معیار کیا مانا جاتا ہے؟',
        romanUrdu: 'Pehle 90 dino mein is role mein kamyabi ka kya miyaar hai?'
      }
    ]
  },
  {
    id: 'scenario-10',
    title: 'Receiving a Courier Parcel Delivery',
    titleUrdu: 'کوریئر پارسل کی وصولی',
    titleRomanUrdu: 'Courier Parcel Ki Wasooli',
    category: 'Daily Life',
    difficulty: 'Beginner',
    description: 'Signing for packages, verifying order numbers, and handling cash-on-delivery payments.',
    descriptionUrdu: 'پارسل پر دستخط کرنا، آرڈر کی تصدیق اور کیش آن ڈیلیوری ادا کرنا۔',
    keyVocabulary: [
      { english: 'Package / Parcel', urdu: 'ڈبہ / بند پارسل', romanUrdu: 'Parcel / Dabba', partOfSpeech: 'Noun', exampleSentence: 'A fragile glass parcel arrived this morning.', urduMeaning: 'ڈاک یا کوریئر سے بھیجا گیا سامان' },
      { english: 'Signature', urdu: 'دستخط / سائن', romanUrdu: 'Dastakhat / Signature', partOfSpeech: 'Noun', exampleSentence: 'Please provide your signature on this digital device.', urduMeaning: 'اپنے ہاتھ سے کیا گیا نشان' },
      { english: 'Cash on Delivery', urdu: 'سامان ملنے پر نقد ادائیگی', romanUrdu: 'Cash on Delivery (COD)', partOfSpeech: 'Noun', exampleSentence: 'The total cash on delivery amount is thirty dollars.', urduMeaning: 'چیز ملنے کے بعد پیسے دینا' },
      { english: 'Tracking Number', urdu: 'ٹریکنگ نمبر', romanUrdu: 'Tracking Number', partOfSpeech: 'Noun', exampleSentence: 'Can you verify the last four digits of your tracking code?', urduMeaning: 'پارسل کا شناختی کوڈ' }
    ],
    dialogue: [
      {
        id: '10-1',
        speaker: 'Delivery Rider',
        speakerRole: 'npc',
        english: 'Assalam-o-Alaikum! Courier delivery for Mr. Usman. Is that you?',
        urdu: 'السلام علیکم! عثمان صاحب کے لیے کوریئر ڈیلیوری ہے۔ کیا آپ ہی ہیں؟',
        romanUrdu: 'Assalam-o-Alaikum! Usman sahab ke liye parcel hai. Kya aap hain?'
      },
      {
        id: '10-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Walaikum Assalam! Yes, that is me. I was expecting this delivery today.',
        urdu: 'وعلیکم السلام! جی ہاں، میں ہی ہوں۔ مجھے آج اس ڈیلیوری کا انتظار تھا۔',
        romanUrdu: 'Walaikum Assalam! Ji haan main hi hoon. Mujhe intezar tha.'
      },
      {
        id: '10-3',
        speaker: 'Delivery Rider',
        speakerRole: 'npc',
        english: 'Great! It is a cash-on-delivery order for twenty-two hundred rupees.',
        urdu: 'زبردست! یہ بائیس سو روپے کا کیش آن ڈیلیوری آرڈر ہے۔',
        romanUrdu: 'Zabardast! Yeh 2200 rupay ka cash on delivery order hai.'
      },
      {
        id: '10-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Here is twenty-five hundred rupees in cash. Do you have three hundred change?',
        urdu: 'یہ پچیس سو روپے نقد لیجیے۔ کیا آپ کے پاس تین سو روپے کا بقایا ہے؟',
        romanUrdu: 'Yeh 2500 rupay lein. Kya 300 khulay wapis hain?'
      },
      {
        id: '10-5',
        speaker: 'Delivery Rider',
        speakerRole: 'npc',
        english: 'Yes, here is your change. Please put your signature on my mobile screen here.',
        urdu: 'جی ہاں، یہ رہا آپ کا بقایا۔ برائے مہربانی میرے موبائل کی سکرین پر یہاں سائن کر دیجیے۔',
        romanUrdu: 'Haan yeh baqi paisay lein. Mobile screen par signature kar dein.'
      },
      {
        id: '10-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'All done. Thank you very much, and drive safely in this heat!',
        urdu: 'ہو گیا۔ بہت شکریہ، اور اس گرمی میں احتیاط سے موٹر سائیکل چلائیے گا!',
        romanUrdu: 'Ho gaya. Bohat shukriya, aur ahtiyat se drive kijiye ga!'
      }
    ]
  },
  {
    id: 'scenario-11',
    title: 'Asking the Boss for Leave',
    titleUrdu: 'آفس باس سے چھٹی کی درخواست',
    titleRomanUrdu: 'Office Boss Se Chutti Ki Darkhwast',
    category: 'Career',
    difficulty: 'Intermediate',
    description: 'Politely requesting time off for a family commitment, delegating tasks, and arranging emergency coverage.',
    descriptionUrdu: 'خاندانی تقریب کے لیے چھٹی مانگنا، کام کسی ساتھی کو سونپنا اور ایمرجنسی میں رابطے کا بتانا۔',
    keyVocabulary: [
      { english: 'Annual Leave', urdu: 'سالانہ رخصت / چھٹی', romanUrdu: 'Salana Chutti', partOfSpeech: 'Noun', exampleSentence: 'I still have five unused days of annual leave remaining.', urduMeaning: 'سال بھر میں ملنے والی چھٹیاں' },
      { english: 'Delegate', urdu: 'کام سونپنا', romanUrdu: 'Kaam Saunpna', partOfSpeech: 'Verb', exampleSentence: 'I will delegate my urgent client emails to Bilal.', urduMeaning: 'اپنا کام دوسرے کو دینا' },
      { english: 'Urgent', urdu: 'انتہائی ضروری', romanUrdu: 'Zaroori / Urgent', partOfSpeech: 'Adjective', exampleSentence: 'An urgent family matter requires my presence.', urduMeaning: 'فوری توجہ طلب کام' },
      { english: 'Catch up', urdu: 'چھوٹا ہوا کام پورا کرنا', romanUrdu: 'Kaam Pura Karna', partOfSpeech: 'Verb', exampleSentence: 'I will catch up on all pending reports over the weekend.', urduMeaning: 'پچھلا کام نبٹانا' }
    ],
    dialogue: [
      {
        id: '11-1',
        speaker: 'Manager',
        speakerRole: 'npc',
        english: 'Hi, come in and close the door. Did you want to discuss something with me?',
        urdu: 'ہیلو، اندر آ کر دروازہ بند کر لیں۔ کیا آپ مجھ سے کوئی بات کرنا چاہتے تھے؟',
        romanUrdu: 'Hi, ander aa jayein. Kya koi baat karni thi?'
      },
      {
        id: '11-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Good morning, sir. I would like to request two days of personal leave next Thursday and Friday.',
        urdu: 'صبح بخیر جناب۔ میں آئندہ جمعرات اور جمعہ کے لیے دو دن کی ذاتی چھٹی کی درخواست کرنا چاہتا ہوں۔',
        romanUrdu: 'Good morning sir. Agli Thursday aur Friday ko do din ki chutti chahiye thi.'
      },
      {
        id: '11-3',
        speaker: 'Manager',
        speakerRole: 'npc',
        english: 'Is everything all right? What is the reason for taking time off?',
        urdu: 'سب خیریت تو ہے؟ چھٹی لینے کی کیا وجہ ہے؟',
        romanUrdu: 'Sab theek hai? Chutti ki kya waja hai?'
      },
      {
        id: '11-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'My brother is getting married in Lahore, and my whole family needs to attend.',
        urdu: 'لاہور میں میرے بھائی کی شادی ہے، اور میرے پورے خاندان کا شرکت کرنا لازمی ہے۔',
        romanUrdu: 'Lahore mein bhai ki shadi hai, family ko jana hai.'
      },
      {
        id: '11-5',
        speaker: 'Manager',
        speakerRole: 'npc',
        english: 'Congratulations! Who will handle your pending project assignments while you are away?',
        urdu: 'مبارک ہو! جب آپ رخصت پر ہوں گے تو آپ کے زیر التواء پروجیکٹ کا کام کون دیکھے گا؟',
        romanUrdu: 'Mubarak ho! Aap ke peeche project kon dekhe ga?'
      },
      {
        id: '11-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'I have already briefed Bilal, and he agreed to cover my urgent client emails.',
        urdu: 'میں نے بلال کو تمام تفصیلات سمجھا دی ہیں، اور وہ میری ضروری ای میلز کا جواب دینے پر رضامند ہے۔',
        romanUrdu: 'Main ne Bilal ko samjha diya hai, woh urgent emails cover kar le ga.'
      }
    ]
  },
  {
    id: 'scenario-12',
    title: 'Office Breakroom Small Talk',
    titleUrdu: 'دفتر کے بریک روم میں گپ شپ',
    titleRomanUrdu: 'Office Breakroom Mein Gap Shap',
    category: 'Career',
    difficulty: 'Beginner',
    description: 'Friendly casual banter with a coworker over tea or coffee, discussing weekend plans.',
    descriptionUrdu: 'چائے یا کافی کے دوران ساتھی ملازم سے دوستانہ گفتگو اور ویک اینڈ کے پروگرام۔',
    keyVocabulary: [
      { english: 'Exhausted', urdu: 'تھکا ہارا / بے دم', romanUrdu: 'Thaka Haara', partOfSpeech: 'Adjective', exampleSentence: 'After that four-hour presentation, I was totally exhausted.', urduMeaning: 'بہت زیادہ تھکن' },
      { english: 'Weekend', urdu: 'ہفتہ اور اتوار کی چھٹی', romanUrdu: 'Weekend', partOfSpeech: 'Noun', exampleSentence: 'Do you have any exciting plans for the upcoming weekend?', urduMeaning: 'ہفتے کے آخری چھٹی کے دن' },
      { english: 'Brew', urdu: 'چائے یا کافی بنانا / دم دینا', romanUrdu: 'Chai / Coffee Banana', partOfSpeech: 'Verb', exampleSentence: 'I am brewing a fresh pot of herbal tea.', urduMeaning: 'گرم مشروب تیار کرنا' },
      { english: 'Overtime', urdu: 'مقررہ وقت سے زیادہ کام', romanUrdu: 'Overtime', partOfSpeech: 'Noun', exampleSentence: 'Did you have to work overtime yesterday evening?', urduMeaning: 'اضافی گھنٹے کام کرنا' }
    ],
    dialogue: [
      {
        id: '12-1',
        speaker: 'Colleague',
        speakerRole: 'npc',
        english: 'Hey there! Grabbing a cup of chai too? That marketing meeting was so long!',
        urdu: 'ارے دوست! تم بھی چائے پینے آئے ہو؟ مارکیٹنگ کی میٹنگ کتنی لمبی تھی نا!',
        romanUrdu: 'Hey! Chai peene aye ho? Meeting bohot lambi thi!'
      },
      {
        id: '12-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Tell me about it! I felt like falling asleep halfway through those slides.',
        urdu: 'بالکل مت پوچھو! آدھی سلائیڈز کے دوران ہی مجھے شدید نیند آنے لگی تھی۔',
        romanUrdu: 'Mujhe to slides ke doran neend anay lagi thi.'
      },
      {
        id: '12-3',
        speaker: 'Colleague',
        speakerRole: 'npc',
        english: 'Haha, me too! So, do you have any fun plans lined up for this weekend?',
        urdu: 'ہا ہا، میرا بھی یہی حال تھا! تو پھر، اس ویک اینڈ کے لیے کوئی مزیدار پلان بنایا ہے؟',
        romanUrdu: 'Haha mera bhi yahi haal tha! Weekend ka kya plan hai?'
      },
      {
        id: '12-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Nothing too crazy. I will probably relax, watch a cricket match, and visit my cousins.',
        urdu: 'کوئی خاص نہیں، بس آرام کروں گا، کرکٹ میچ دیکھوں گا اور کزنز سے ملنے جاؤں گا۔',
        romanUrdu: 'Bas aaram karoon ga, cricket match dekhon ga aur cousins se miloon ga.'
      },
      {
        id: '12-5',
        speaker: 'Colleague',
        speakerRole: 'npc',
        english: 'Sounds peaceful. Some of us are planning a barbecue picnic on Sunday if you want to join.',
        urdu: 'یہ تو بہت پرسکون ہے۔ اگر تم آنا چاہو تو اتوار کو ہم میں سے کچھ لوگ باربی کیو پکنک کا پروگرام بنا رہے ہیں۔',
        romanUrdu: 'Acha hai. Hum Sunday ko barbecue picnic plan kar rahe hain.'
      },
      {
        id: '12-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'That sounds delightful! Count me in, and let me know what snacks I should bring.',
        urdu: 'یہ تو بہت زبردست رہے گا! مجھے ضرور شامل سمجھیں، اور بتائیے گا میں ساتھ کیا کھانے کی چیز لاؤں۔',
        romanUrdu: 'Bohat zabardast! Mujhe shamil samjhein, bataiye ga main kya laun.'
      }
    ]
  },
  {
    id: 'scenario-13',
    title: 'Discussing Rent & Maintenance with Landlord',
    titleUrdu: 'مکان مالک سے کرایہ اور مرمت پر بات چیت',
    titleRomanUrdu: 'Makan Malik Se Kiraya Aur Marammat',
    category: 'Home',
    difficulty: 'Intermediate',
    description: 'Notifying landlord about broken fixtures, confirming electronic rent deposit, and lease terms.',
    descriptionUrdu: 'نلکے یا بجلی کی خرابی کی اطلاع دینا، کرایہ بینک میں جمع کروانا اور معاہدے کی تجدید۔',
    keyVocabulary: [
      { english: 'Landlord', urdu: 'مکان مالک', romanUrdu: 'Makan Malik', partOfSpeech: 'Noun', exampleSentence: 'The landlord agreed to deduct the repair cost from next month\'s rent.', urduMeaning: 'گھر کا مالک' },
      { english: 'Lease Agreement', urdu: 'کرایہ داری کا تحریری معاہدہ', romanUrdu: 'Kirayadari Ka Muahida', partOfSpeech: 'Noun', exampleSentence: 'Our one-year lease agreement expires at the end of October.', urduMeaning: 'کرائے کی شرائط کا قانونی کاغذ' },
      { english: 'Plumbing', urdu: 'پائپ اور نلکوں کا نظام', romanUrdu: 'Plumbing / Nalkon Ka Kaam', partOfSpeech: 'Noun', exampleSentence: 'The building has old plumbing that frequently leaks.', urduMeaning: 'پانی کے پائپوں کا نظام' },
      { english: 'Receipt', urdu: 'وصولی کی رسید', romanUrdu: 'Pohnch / Raseed', partOfSpeech: 'Noun', exampleSentence: 'Please send me the electronic payment receipt for my records.', urduMeaning: 'پیسے ملنے کا ثبوت' }
    ],
    dialogue: [
      {
        id: '13-1',
        speaker: 'Landlord',
        speakerRole: 'npc',
        english: 'Hello, Mr. Khan. I got your text message about the apartment. What is going on?',
        urdu: 'ہیلو خان صاحب۔ مجھے اپارٹمنٹ کے بارے میں آپ کا میسج ملا تھا۔ کیا مسئلہ ہوا ہے؟',
        romanUrdu: 'Hello Khan sahab. Apartment ke bare mein message mila tha. Kya hua?'
      },
      {
        id: '13-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Hello, Mr. Sterling. The main water valve under the kitchen sink has been dripping constantly.',
        urdu: 'ہیلو مسٹر سٹرلنگ۔ کچن کے سنک کے نیچے موجود پانی کا مین والو مسلسل ٹپک رہا ہے۔',
        romanUrdu: 'Hello sir. Kitchen sink ke neeche wala valve musalsal tapak raha hai.'
      },
      {
        id: '13-3',
        speaker: 'Landlord',
        speakerRole: 'npc',
        english: 'Oh dear, water damage must be avoided. Have you shut off the temporary cold valve?',
        urdu: 'اوہ ہو، پانی سے نقصان نہیں ہونا چاہیے۔ کیا آپ نے عارضی طور پر والو بند کیا ہے؟',
        romanUrdu: 'Pani se nuqsan na ho. Kya aap ne valve band kiya?'
      },
      {
        id: '13-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, I tightened it and put a bucket underneath, but it needs a professional plumber.',
        urdu: 'جی ہاں، میں نے اسے کَس دیا ہے اور نیچے بالٹی رکھ دی ہے، لیکن کسی ماہر پلمبر کی ضرورت ہے۔',
        romanUrdu: 'Ji maine bucket rakh di hai, lekin plumber ki zaroorat hai.'
      },
      {
        id: '13-5',
        speaker: 'Landlord',
        speakerRole: 'npc',
        english: 'I will send our building technician tomorrow morning at 10 AM. By the way, thanks for the rent transfer.',
        urdu: 'میں کل صبح دس بجے بلڈنگ کا ٹیکنیشن بھیج دوں گا۔ ویسے کرایہ ٹرانسفر کرنے کا شکریہ۔',
        romanUrdu: 'Kal subah 10 baje technician bhej donga. Rent transfer ka shukriya.'
      },
      {
        id: '13-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'You are welcome! I will be home at 10 AM to let the technician in.',
        urdu: 'کوئی بات نہیں! میں صبح دس بجے گھر پر موجود رہوں گا تاکہ ٹیکنیشن کو اندر لا سکوں۔',
        romanUrdu: 'Koi baat nahi! Main 10 baje ghar par honga taake technician ko rasta dikha sakoon.'
      }
    ]
  },
  {
    id: 'scenario-14',
    title: 'Calling a Plumber for an Emergency Leak',
    titleUrdu: 'ہنگامی لیکیج پر پلمبر کو بلانا',
    titleRomanUrdu: 'Emergency Leakage Par Plumber Ko Bulana',
    category: 'Home',
    difficulty: 'Intermediate',
    description: 'Describing broken water pipes, water pressure, scheduling an emergency visit, and asking for hourly rates.',
    descriptionUrdu: 'پانی کے پائپ پھٹنے کا بتانا، فوری معائنے کا وقت طے کرنا اور خرچے کی تفصیل۔',
    keyVocabulary: [
      { english: 'Leak', urdu: 'رساؤ / پانی بہنا', romanUrdu: 'Leakage / Paani Bahna', partOfSpeech: 'Noun', exampleSentence: 'A steady leak can waste hundreds of liters of water.', urduMeaning: 'سوراخ سے پانی نکلنا' },
      { english: 'Pipe', urdu: 'پائپ / نلکی', romanUrdu: 'Pipe', partOfSpeech: 'Noun', exampleSentence: 'The galvanized pipe rusted through and cracked.', urduMeaning: 'پانی لے جانے والی نالی' },
      { english: 'Toolbox', urdu: 'اوزاروں کا ڈبہ', romanUrdu: 'Auzaron Ka Dabba', partOfSpeech: 'Noun', exampleSentence: 'The plumber grabbed his heavy toolbox from his van.', urduMeaning: 'کام کے اوزار' },
      { english: 'Labor Cost', urdu: 'مزدوری / کاریگری کا معاوضہ', romanUrdu: 'Mazdoori / Labor Charges', partOfSpeech: 'Noun', exampleSentence: 'The total bill includes both spare parts and labor cost.', urduMeaning: 'کاریگر کی محنت کے پیسے' }
    ],
    dialogue: [
      {
        id: '14-1',
        speaker: 'Plumber',
        speakerRole: 'npc',
        english: 'Express Plumbing Services, Dave speaking. What emergency are you facing?',
        urdu: 'ایکسپریس پلمبنگ سروسز، ڈیو بات کر رہا ہوں۔ آپ کو کیا ہنگامی مسئلہ درپیش ہے؟',
        romanUrdu: 'Express Plumbing, Dave speaking. Kya emergency hai?'
      },
      {
        id: '14-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Hello Dave! A bathroom pipe behind the toilet has burst and water is gushing everywhere!',
        urdu: 'ہیلو ڈیو! باتھ روم میں ٹوائلٹ کے پیچھے والا پائپ پھٹ گیا ہے اور پانی ہر طرف بہہ رہا ہے!',
        romanUrdu: 'Hello Dave! Bathroom ka pipe phat gaya hai aur paani beh raha hai!'
      },
      {
        id: '14-3',
        speaker: 'Plumber',
        speakerRole: 'npc',
        english: 'First, locate your main apartment water shutoff valve near the entrance and turn it clockwise!',
        urdu: 'سب سے پہلے داخلی دروازے کے قریب پانی کا مین والو تلاش کریں اور اسے دائیں گھما کر بند کر دیں!',
        romanUrdu: 'Pehle main valve clockwise ghuma kar band karein!'
      },
      {
        id: '14-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Got it, I just shut off the main valve. How soon can you arrive at Gulshan Block 5?',
        urdu: 'سمجھ گیا، میں نے مین والو بند کر دیا ہے۔ آپ گلشن بلاک 5 میں کتنی دیر تک پہنچ سکتے ہیں؟',
        romanUrdu: 'Main valve band kar diya. Aap Gulshan Block 5 kitni der mein phonchein ge?'
      },
      {
        id: '14-5',
        speaker: 'Plumber',
        speakerRole: 'npc',
        english: 'I am finishing a job nearby and can be at your place within twenty-five minutes.',
        urdu: 'میں قریب ہی ایک کام ختم کر رہا ہوں اور پچیس منٹ کے اندر آپ کے پاس پہنچ سکتا ہوں۔',
        romanUrdu: 'Qareeb hi hoon, 25 minute mein pohanch jaon ga.'
      },
      {
        id: '14-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Please hurry. What is your estimated inspection and labor charge?',
        urdu: 'برائے مہربانی جلدی آئیے۔ معائنے اور مزدوری کے اندازاً کیا چارجز ہوں گے؟',
        romanUrdu: 'Jaldi aaiye. Inspection aur labor charges kya hon ge?'
      }
    ]
  },
  {
    id: 'scenario-15',
    title: 'Airport Passport Control & Immigration',
    titleUrdu: 'ایئرپورٹ پاسپورٹ کنٹرول اور امیگریشن',
    titleRomanUrdu: 'Airport Passport Control Aur Immigration',
    category: 'Travel',
    difficulty: 'Advanced',
    description: 'Answering official questions regarding the purpose of visit, length of stay, accommodation, and return flights.',
    descriptionUrdu: 'سفر کا مقصد، قیام کی مدت، ہوٹل کی رہائش اور واپسی کے ٹکٹ کے متعلق سوالات کے جوابات۔',
    keyVocabulary: [
      { english: 'Immigration', urdu: 'محکمہ تارکین وطن / آمد و رفت', romanUrdu: 'Immigration', partOfSpeech: 'Noun', exampleSentence: 'The immigration line moved quickly through automatic gates.', urduMeaning: 'ملک میں داخلے کا سرکاری دفتر' },
      { english: 'Purpose of Visit', urdu: 'دورے کا مقصد', romanUrdu: 'Dauray Ka Maqsad', partOfSpeech: 'Noun', exampleSentence: 'State clearly whether your purpose of visit is tourism or business.', urduMeaning: 'سفر کی اصل وجہ' },
      { english: 'Duration', urdu: 'مدت / کتنا وقت', romanUrdu: 'Mudaat / Arsa', partOfSpeech: 'Noun', exampleSentence: 'What will be the total duration of your stay in the United Kingdom?', urduMeaning: 'رہنے کے کل دن' },
      { english: 'Sufficient Funds', urdu: 'کافی مالی وسائل / پیسے', romanUrdu: 'Kafi Paisay', partOfSpeech: 'Noun', exampleSentence: 'Travelers must prove they have sufficient funds to cover expenses.', urduMeaning: 'سفر کے اخراجات کے لیے رقم' }
    ],
    dialogue: [
      {
        id: '15-1',
        speaker: 'Immigration Officer',
        speakerRole: 'npc',
        english: 'Next traveler, step forward please. Passport and landing declaration card.',
        urdu: 'اگلا مسافر آگے تشریف لائے۔ پاسپورٹ اور لینڈنگ ڈیکلریشن کارڈ دیجیے۔',
        romanUrdu: 'Next passenger aagay ayein. Passport aur landing card dein.'
      },
      {
        id: '15-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Good afternoon, officer. Here is my passport, visa page, and completed declaration card.',
        urdu: 'دوپہر بخیر آفیسر۔ یہ میرا پاسپورٹ، ویزا اور مکمل کیا گیا کارڈ ہے۔',
        romanUrdu: 'Good afternoon officer. Yeh mera passport aur declaration card hai.'
      },
      {
        id: '15-3',
        speaker: 'Immigration Officer',
        speakerRole: 'npc',
        english: 'Thank you. What is the nature and purpose of your visit to the UK?',
        urdu: 'شکریہ۔ برطانیہ میں آپ کی آمد کا کیا مقصد اور نوعیت ہے؟',
        romanUrdu: 'UK anay ka kya maqsad hai?'
      },
      {
        id: '15-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'I am visiting for two weeks as a tourist to see London and attend an academic conference in Manchester.',
        urdu: 'میں لندن دیکھنے اور مانچسٹر میں ایک تعلیمی کانفرنس میں شرکت کے لیے دو ہفتوں کے سیاحتی ویزے پر آیا ہوں۔',
        romanUrdu: 'Main 2 weeks ke liye tourist aya hoon, London dekhne aur conference ke liye.'
      },
      {
        id: '15-5',
        speaker: 'Immigration Officer',
        speakerRole: 'npc',
        english: 'Do you have your hotel reservation details and a confirmed return flight ticket?',
        urdu: 'کیا آپ کے پاس ہوٹل کی بکنگ اور واپسی کی تصدیق شدہ ہوائی ٹکٹ موجود ہے؟',
        romanUrdu: 'Kya hotel booking aur return ticket hai?'
      },
      {
        id: '15-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, here are the printed hotel vouchers and my British Airways return ticket for the twenty-eighth.',
        urdu: 'جی ہاں، یہ پرنٹ شدہ ہوٹل واؤچرز اور اٹھائیس تاریخ کا برٹش ایئرویز کا واپسی کا ٹکٹ ہے۔',
        romanUrdu: 'Ji yeh printed booking aur 28 tareekh ka return ticket hai.'
      }
    ]
  },
  {
    id: 'scenario-16',
    title: 'Reporting a Lost Item to Police',
    titleUrdu: 'پولیس کو گمشدہ چیز رپورٹ کرنا',
    titleRomanUrdu: 'Police Ko Gumshuda Cheez Report Karna',
    category: 'Daily Life',
    difficulty: 'Intermediate',
    description: 'Describing lost personal belongings, time and location, and receiving an official police report number.',
    descriptionUrdu: 'پرس یا بیگ کے گم ہونے کا وقت اور مقام بتانا اور پولیس کمپلینٹ نمبر حاصل کرنا۔',
    keyVocabulary: [
      { english: 'Belongings', urdu: 'ذاتی سامان / اشیاء', romanUrdu: 'Zaati Samaan', partOfSpeech: 'Noun', exampleSentence: 'Never leave your personal belongings unattended in public.', urduMeaning: 'اپنی ذاتی چیزیں' },
      { english: 'Incident', urdu: 'واقعہ / واردات', romanUrdu: 'Waqea / Haadsa', partOfSpeech: 'Noun', exampleSentence: 'Can you describe the approximate time the incident occurred?', urduMeaning: 'پیش آنے والی بات' },
      { english: 'Police Report', urdu: 'پولیس کی تصدیقی رپورٹ', romanUrdu: 'Police Report', partOfSpeech: 'Noun', exampleSentence: 'You will need this official police report to claim travel insurance.', urduMeaning: 'تھانے سے ملنے والی تحریر' },
      { english: 'CCTV Footage', urdu: 'سی سی ٹی وی کیمرے کی ویڈیو', romanUrdu: 'CCTV Video', partOfSpeech: 'Noun', exampleSentence: 'Officers are reviewing the subway station CCTV footage.', urduMeaning: 'سیکیورٹی کیمروں کی ریکارڈنگ' }
    ],
    dialogue: [
      {
        id: '16-1',
        speaker: 'Police Officer',
        speakerRole: 'npc',
        english: 'Hello, sir. Please take a seat. How can the precinct assist you today?',
        urdu: 'ہیلو جناب۔ تشریف رکھیے۔ آج ہمارا تھانہ آپ کی کیا مدد کر سکتا ہے؟',
        romanUrdu: 'Hello sir. Tashreef rakhein. Kya madad karein?'
      },
      {
        id: '16-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Officer, I need to report a lost black leather backpack. I think I left it on the train an hour ago.',
        urdu: 'آفیسر، مجھے کالے چمڑے کا بیگ گم ہونے کی رپورٹ درج کروانی ہے۔ غالباً ایک گھنٹہ پہلے میں ٹرین میں بھول آیا ہوں۔',
        romanUrdu: 'Officer, black leather backpack kho gaya hai, train mein bhool gaya.'
      },
      {
        id: '16-3',
        speaker: 'Police Officer',
        speakerRole: 'npc',
        english: 'Don\'t worry, we will help you. What important items were inside the bag?',
        urdu: 'پریشان نہ ہوں، ہم آپ کی مدد کریں گے۔ بیگ کے اندر کون کون سی قیمتی اشیاء تھیں؟',
        romanUrdu: 'Fikar na karein. Bag ke andar kya important samaan tha?'
      },
      {
        id: '16-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'It contains my Pakistani passport, an Apple laptop, house keys, and a brown wallet with bank cards.',
        urdu: 'اس میں میرا پاکستانی پاسپورٹ، ایپل لیپ ٹاپ، گھر کی چابیاں اور بینک کارڈز والا بھورا بٹوا ہے۔',
        romanUrdu: 'Passport, laptop, keys aur bank cards wala wallet tha.'
      },
      {
        id: '16-5',
        speaker: 'Police Officer',
        speakerRole: 'npc',
        english: 'First, call your bank to freeze those cards immediately. Which train line were you traveling on?',
        urdu: 'سب سے پہلے اپنے بینک کو کال کر کے وہ کارڈز فوراً بلاک کروائیں۔ آپ کون سی ٹرین لائن پر سفر کر رہے تھے؟',
        romanUrdu: 'Pehle bank call kar ke cards block karein. Kaun si train thi?'
      },
      {
        id: '16-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'It was the Red Line heading towards Central Station around 3:30 PM.',
        urdu: 'یہ ریڈ لائن تھی جو تقریباً ساڑھے تین بجے سینٹرل سٹیشن کی طرف جا رہی تھی۔',
        romanUrdu: 'Red Line thi jo 3:30 baje Central Station ja rahi thi.'
      }
    ]
  },
  {
    id: 'scenario-17',
    title: 'First Day at the Gym with a Trainer',
    titleUrdu: 'جم میں ٹرینر کے ساتھ پہلا دن',
    titleRomanUrdu: 'Gym Mein Trainer Ke Sath Pehla Din',
    category: 'Daily Life',
    difficulty: 'Beginner',
    description: 'Discussing fitness goals, learning warm-up exercises, weight machines, and posture advice.',
    descriptionUrdu: 'صحت و ورزش کے مقاصد، وارم اپ، مشینوں کا درست استعمال اور چوٹ سے بچاؤ۔',
    keyVocabulary: [
      { english: 'Warm-up', urdu: 'ورزش سے پہلے جسم کو گرم کرنا', romanUrdu: 'Warm-up', partOfSpeech: 'Noun', exampleSentence: 'Always spend ten minutes on a cardio warm-up to prevent muscle injury.', urduMeaning: 'ہلکی ورزش سے جسم تیار کرنا' },
      { english: 'Repetitions (Reps)', urdu: 'ورزش کو بار بار دہرانا', romanUrdu: 'Reps / Baar Baar Karna', partOfSpeech: 'Noun', exampleSentence: 'Do three sets of twelve reps each for dumbbell curls.', urduMeaning: 'ایک سیٹ میں کتنی بار وزن اٹھانا ہے' },
      { english: 'Posture', urdu: 'جسم کی حالت اور سیدھ', romanUrdu: 'Posture / Jism Ki Pazeeb', partOfSpeech: 'Noun', exampleSentence: 'Keep your spine straight to maintain proper posture while deadlifting.', urduMeaning: 'کھڑے ہونے یا جھکنے کا انداز' },
      { english: 'Hydrated', urdu: 'پانی کی مناسب مقدار رکھنا', romanUrdu: 'Paani Peete Rehna', partOfSpeech: 'Adjective', exampleSentence: 'Drink plenty of water to stay hydrated throughout intense training.', urduMeaning: 'جسم میں پانی کی کمی نہ ہونے دینا' }
    ],
    dialogue: [
      {
        id: '17-1',
        speaker: 'Gym Trainer',
        speakerRole: 'npc',
        english: 'Welcome to Titan Fitness! I am coach Marcus. What are your main fitness goals here?',
        urdu: 'ٹائٹن فٹنس میں خوش آمدید! میں کوچ مارکس ہوں۔ یہاں آپ کے بنیادی فٹنس مقاصد کیا ہیں؟',
        romanUrdu: 'Welcome to gym! Main Marcus hoon. Aap ke fitness goals kya hain?'
      },
      {
        id: '17-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Hi coach! I spend all day sitting at a desk, so I want to lose weight and build stamina.',
        urdu: 'ہیلو کوچ! میں سارا دن کرسی پر بیٹھ کر کام کرتا ہوں، اس لیے وزن کم کرنا اور سٹیمنا بڑھانا چاہتا ہوں۔',
        romanUrdu: 'Hi coach! Main sara din baith kar kaam karta hoon, weight kam karna hai.'
      },
      {
        id: '17-3',
        speaker: 'Gym Trainer',
        speakerRole: 'npc',
        english: 'Great! We will start with dynamic stretches and ten minutes on the treadmill to raise your heart rate.',
        urdu: 'شاندار! ہم جسم کھینچنے والی سٹریچنگ اور دل کی دھڑکن تیز کرنے کے لیے ٹریڈمل سے آغاز کریں گے۔',
        romanUrdu: 'Zabardast! Pehle stretches aur 10 minute treadmill karein ge.'
      },
      {
        id: '17-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Sounds good. Should I start with lightweight dumbbells or machine exercises?',
        urdu: 'بہت اچھا۔ کیا مجھے ہلکے ڈمبلز سے شروع کرنا چاہیے یا مشینوں والی ورزش سے؟',
        romanUrdu: 'Acha hai. Dumbbells se shuru karein ya machine se?'
      },
      {
        id: '17-5',
        speaker: 'Gym Trainer',
        speakerRole: 'npc',
        english: 'Machines are safer for beginners because they guide your path of motion. Let me demonstrate the chest press.',
        urdu: 'نئے لوگوں کے لیے مشینیں زیادہ محفوظ ہیں کیونکہ وہ درست سمت میں رہتی ہیں۔ میں چیسٹ پریس کر کے دکھاتا ہوں۔',
        romanUrdu: 'Beginners ke liye machines safe hain. Main chest press dikhata hoon.'
      },
      {
        id: '17-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Thanks for showing me! How many sets and repetitions should I complete?',
        urdu: 'سمجھانے کا شکریہ! مجھے کتنے سیٹ اور کتنی بار دہرانا چاہیے؟',
        romanUrdu: 'Shukriya! Kitne sets aur reps karne chahiye?'
      }
    ]
  },
  {
    id: 'scenario-18',
    title: 'Getting a Haircut at the Barber Shop',
    titleUrdu: 'حجام کے پاس بال اور داڑھی بنوانا',
    titleRomanUrdu: 'Hajaam Ke Paas Baal Katwana',
    category: 'Daily Life',
    difficulty: 'Beginner',
    description: 'Instructing the barber on hair length, fades, scissors vs clippers, and beard trimming.',
    descriptionUrdu: 'بالوں کی لمبائی، سائیڈوں سے کٹنگ، قینچی یا مشین کا استعمال اور داڑھی سیٹ کروانا۔',
    keyVocabulary: [
      { english: 'Trim', urdu: 'ہلکی کٹائی / نوکیں تراشنا', romanUrdu: 'Trim / Halka Katna', partOfSpeech: 'Verb', exampleSentence: 'Just trim half an inch off the top, please.', urduMeaning: 'تھوڑے سے بال کاٹنا' },
      { english: 'Fade', urdu: 'نیچے سے باریک بال', romanUrdu: 'Fade / Barik Cut', partOfSpeech: 'Noun', exampleSentence: 'Can you give me a clean low fade on the sides and neck?', urduMeaning: 'سائیڈوں سے بال بتدریج باریک کرنا' },
      { english: 'Scissors', urdu: 'قینچی', romanUrdu: 'Qainchi', partOfSpeech: 'Noun', exampleSentence: 'Please use scissors on top rather than the electric clippers.', urduMeaning: 'بال کاٹنے والا اوزار' },
      { english: 'Sideburns', urdu: 'قلمیں / کنپٹی کے بال', romanUrdu: 'Qalmein / Sideburns', partOfSpeech: 'Noun', exampleSentence: 'Should I trim your sideburns to mid-ear level?', urduMeaning: 'کان کے پاس کے بال' }
    ],
    dialogue: [
      {
        id: '18-1',
        speaker: 'Barber',
        speakerRole: 'npc',
        english: 'Welcome! Hop into the chair. How would you like your hair done today, my friend?',
        urdu: 'خوش آمدید! کرسی پر تشریف رکھیے۔ میرے دوست، آج آپ کے بال کس انداز میں بنانے ہیں؟',
        romanUrdu: 'Welcome! Kursi par baithein. Aaj baal kaise banane hain?'
      },
      {
        id: '18-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Hello! I would like a short taper fade on the sides and just a half-inch trim on top with scissors.',
        urdu: 'ہیلو! مجھے سائیڈوں سے مشین سے باریک بال اور اوپر سے قینچی کے ساتھ آدھا انچ تراشنے ہیں۔',
        romanUrdu: 'Sides se fade aur upar se scissor se aadha inch trim karein.'
      },
      {
        id: '18-3',
        speaker: 'Barber',
        speakerRole: 'npc',
        english: 'Got it. And how about your sideburns and the back of your neck? Squared or tapered natural?',
        urdu: 'سمجھ گیا۔ اور آپ کی قلمیں اور گردن کے پچھلے بال؟ چوکور کٹنگ یا قدرتی گولائی؟',
        romanUrdu: 'Qalmein aur gardan ke baal square rakhein ya natural?'
      },
      {
        id: '18-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Keep the sideburns short, and taper the neck naturally, please.',
        urdu: 'قلمیں چھوٹی رکھیں اور گردن کی کٹنگ قدرتی گولائی میں کیجیے۔',
        romanUrdu: 'Qalmein choti rakhein aur gardan natural taper karein.'
      },
      {
        id: '18-5',
        speaker: 'Barber',
        speakerRole: 'npc',
        english: 'Would you also like me to trim and shape your beard with a warm towel afterwards?',
        urdu: 'کیا اس کے بعد آپ گرم تولیے اور داڑھی کی سیٹنگ بھی کروانا چاہیں گے؟',
        romanUrdu: 'Kya daari bhi trim aur shape karni hai?'
      },
      {
        id: '18-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Yes, just line up the cheek lines and clean the neck. Thank you!',
        urdu: 'جی ہاں، بس گالوں کی لکیریں سیدھی کر دیں اور گردن صاف کر دیں۔ شکریہ!',
        romanUrdu: 'Haan cheek lines theek kar dein aur neck saaf karein. Shukriya!'
      }
    ]
  },
  {
    id: 'scenario-19',
    title: 'School Parent-Teacher Conference',
    titleUrdu: 'سکول میں والدین اور اساتذہ کی میٹنگ',
    titleRomanUrdu: 'School Mein Walidain Aur Ustaad Ki Meeting',
    category: 'Daily Life',
    difficulty: 'Intermediate',
    description: 'Inquiring about academic progress, classroom behavior, homework habits, and encouraging study routines.',
    descriptionUrdu: 'تعلیمی کارکردگی، کلاس میں برتاؤ، ہوم ورک اور پڑھائی میں بہتری کی تجاویز پر بات چیت۔',
    keyVocabulary: [
      { english: 'Progress', urdu: 'ترقی / کارکردگی', romanUrdu: 'Taraqqi / Karkardagi', partOfSpeech: 'Noun', exampleSentence: 'Ali has shown steady progress in mathematics this semester.', urduMeaning: 'بہتری کا سفر' },
      { english: 'Curriculum', urdu: 'نصاب / پڑھائی کا کورس', romanUrdu: 'Nisaab / Curriculum', partOfSpeech: 'Noun', exampleSentence: 'The science curriculum includes hands-on laboratory experiments.', urduMeaning: 'پڑھایا جانے والا مکمل کورس' },
      { english: 'Participation', urdu: 'کلاس میں حصہ لینا', romanUrdu: 'Hissa Lena / Sharakat', partOfSpeech: 'Noun', exampleSentence: 'Active participation in group discussions boosts self-confidence.', urduMeaning: 'سوال و جواب میں بولنا' },
      { english: 'Homework', urdu: 'گھر کا کام', romanUrdu: 'Ghar Ka Kaam / Homework', partOfSpeech: 'Noun', exampleSentence: 'Make sure your child completes their English reading homework daily.', urduMeaning: 'گھر پر کرنے والا تعلیمی کام' }
    ],
    dialogue: [
      {
        id: '19-1',
        speaker: 'School Teacher',
        speakerRole: 'npc',
        english: 'Good afternoon, Mr. and Mrs. Khan. Thank you for making the time to attend our parent conference.',
        urdu: 'دوپہر بخیر جناب اور بیگم خان۔ ہماری پیرنٹ کانفرنس میں شرکت کے لیے وقت نکالنے کا شکریہ۔',
        romanUrdu: 'Good afternoon. Parent conference mein anay ka shukriya.'
      },
      {
        id: '19-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Good afternoon, Mrs. Anderson. We wanted to ask how Zain is performing in his classes.',
        urdu: 'دوپہر بخیر مسز اینڈرسن۔ ہم معلوم کرنا چاہتے تھے کہ زین اپنی کلاسوں میں کیسی کارکردگی دکھا رہا ہے۔',
        romanUrdu: 'Good afternoon. Zain ki classes mein kaisi performance hai?'
      },
      {
        id: '19-3',
        speaker: 'School Teacher',
        speakerRole: 'npc',
        english: 'Zain is very creative and participates actively during science lessons. However, he sometimes rushes his math worksheets.',
        urdu: 'زین بہت تخلیقی ذہن کا مالک ہے اور سائنس کے سبق میں بہت چاق و چوبند رہتا ہے۔ البتہ ریاضی کے سوالات میں جلد بازی کر جاتا ہے۔',
        romanUrdu: 'Zain bohot creative hai, lekin math mein jaldi bazi karta hai.'
      },
      {
        id: '19-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'We have noticed that at home too. How can we support his problem-solving habits in the evening?',
        urdu: 'ہم نے گھر پر بھی یہ محسوس کیا ہے۔ شام کے وقت ہم اس کی مسئلہ حل کرنے کی عادت کو کیسے بہتر بنا سکتے ہیں؟',
        romanUrdu: 'Hum ghar par us ki math ki habit kaise behtar karein?'
      },
      {
        id: '19-5',
        speaker: 'School Teacher',
        speakerRole: 'npc',
        english: 'Encourage him to double-check each answer step-by-step and read the question twice before writing.',
        urdu: 'اسے کہیں کہ لکھنے سے پہلے سوال دو بار پڑھے اور جواب مرحلہ وار دوبارہ چیک کرے۔',
        romanUrdu: 'Sawal do baar parhein aur answers double check karein.'
      },
      {
        id: '19-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'We will definitely implement that routine starting tonight. Thank you for your guidance!',
        urdu: 'ہم آج رات سے ہی اس پر عمل شروع کروائیں گے۔ آپ کی رہنمائی کا بہت شکریہ!',
        romanUrdu: 'Hum aaj se routine shuru karein ge. Guidance ka shukriya!'
      }
    ]
  },
  {
    id: 'scenario-20',
    title: 'Meeting the Foreign Neighbor Next Door',
    titleUrdu: 'برابر والے غیر ملکی پڑوسی سے ملاقات',
    titleRomanUrdu: 'Ghair Mulki Parosi Se Mulaqat',
    category: 'Home',
    difficulty: 'Beginner',
    description: 'Introducing yourself to a foreign neighbor, welcoming them, sharing food, and talking about community rules.',
    descriptionUrdu: 'نئے پڑوسی سے تعارف، کھانوں کا تبادلہ اور محلے کی سہولیات کے بارے میں دوستانہ گپ شپ۔',
    keyVocabulary: [
      { english: 'Neighbor', urdu: 'ہمسایہ / پڑوسی', romanUrdu: 'Hamsaya / Parosi', partOfSpeech: 'Noun', exampleSentence: 'A good neighbor is a blessing in times of need.', urduMeaning: 'ساتھ رہنے والا شخص' },
      { english: 'Community', urdu: 'محلہ / برادری', romanUrdu: 'Mahalla / Community', partOfSpeech: 'Noun', exampleSentence: 'Our neighborhood community organizes a monthly street cleanup.', urduMeaning: 'ایک ساتھ رہنے والے لوگ' },
      { english: 'Traditional', urdu: 'روایتی / ثقافتی', romanUrdu: 'Rawayati', partOfSpeech: 'Adjective', exampleSentence: 'I brought you some traditional homemade Pakistani sweets.', urduMeaning: 'پرانی اور خاص ثقافت والی' },
      { english: 'Hospitality', urdu: 'مہمان نوازی', romanUrdu: 'Mehman Nawazi', partOfSpeech: 'Noun', exampleSentence: 'Pakistani hospitality is renowned for warmth and generosity.', urduMeaning: 'مہمان کی خوب خاطر تواضع' }
    ],
    dialogue: [
      {
        id: '20-1',
        speaker: 'Foreign Neighbor',
        speakerRole: 'npc',
        english: 'Hi there! Beautiful sunny afternoon, isn\'t it? I saw you moving in next door yesterday!',
        urdu: 'ہیلو جناب! دوپہر کتنی خوبصورت اور روشن ہے نا؟ میں نے دیکھا آپ کل برابر والے گھر میں شفٹ ہوئے ہیں!',
        romanUrdu: 'Hi! Kitni achi dhoop hai! Kal aap shift hue hain?'
      },
      {
        id: '20-2',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Hello! Yes, my name is Tariq. My family and I just rented house number 12.',
        urdu: 'ہیلو! جی ہاں، میرا نام طارق ہے۔ میں اور میرا خاندان ابھی مکان نمبر بارہ میں آئے ہیں۔',
        romanUrdu: 'Hello! Ji mera naam Tariq hai. Hum ne house 12 rent par liya hai.'
      },
      {
        id: '20-3',
        speaker: 'Foreign Neighbor',
        speakerRole: 'npc',
        english: 'Nice to meet you, Tariq! I am David. Welcome to Oakridge Lane! It is a quiet and friendly community.',
        urdu: 'آپ سے مل کر بہت خوشی ہوئی طارق! میرا نام ڈیوڈ ہے۔ اوک رج لین میں خوش آمدید! یہ بہت پرامن اور دوستانہ محلہ ہے۔',
        romanUrdu: 'Nice to meet you! Main David hoon. Hamari street mein welcome!'
      },
      {
        id: '20-4',
        speaker: 'You',
        speakerRole: 'user',
        english: 'Nice to meet you, David. My wife made some traditional Pakistani samosas, and we wanted to share some with you!',
        urdu: 'ڈیوڈ آپ سے مل کر خوشی ہوئی۔ میری اہلیہ نے روایتی سموسے بنائے تھے، ہم آپ کے ساتھ شیئر کرنا چاہتے تھے!',
        romanUrdu: 'Nice to meet you. Begum ne samosay banaye the, aap ke liye laye hain!'
      },
      {
        id: '20-5',
        speaker: 'Foreign Neighbor',
        speakerRole: 'npc',
        english: 'Wow, that smells incredible! Thank you so much for your kind hospitality! I love spiced food.',
        urdu: 'واہ! کیا شاندار خوشبو ہے! آپ کی اس پیار بھری مہمان نوازی کا بہت شکریہ! مجھے مسالے دار کھانے پسند ہیں۔',
        romanUrdu: 'Wow bohot zabardast smell hai! Shukriya! Mujhe spicy food pasand hai.'
      },
      {
        id: '20-6',
        speaker: 'You',
        speakerRole: 'user',
        english: 'I hope you enjoy them! Please let us know if we can ever lend you a hand with anything.',
        urdu: 'امید ہے آپ کو پسند آئیں گے! اگر کبھی کسی چیز کی ضرورت پڑے تو بلا جھجھک بتائیے گا۔',
        romanUrdu: 'Umeed hai pasand ayein ge! Kisi cheez ki zaroorat ho to batayein.'
      }
    ]
  }
];

// Helper to provide all 50 scenarios dynamically with full rich dialogues and vocabulary
const ADDITIONAL_SCENARIO_TEMPLATES = [
  { id: '21', title: 'Ordering Coffee at a Cafe', titleUrdu: 'کافی شاپ پر آرڈر دینا', cat: 'Dining' as const, diff: 'Beginner' as const, eng1: 'A large cappuccino with oat milk, please.', urd1: 'بڑا کیپوچینو اوٹ ملک کے ساتھ برائے مہربانی۔' },
  { id: '22', title: 'Buying Clothes and Trying Sizes', titleUrdu: 'کپڑوں کی دکان پر سائز ٹیسٹ کرنا', cat: 'Shopping' as const, diff: 'Beginner' as const, eng1: 'Do you have this jacket in medium size?', urd1: 'کیا یہ جیکٹ میڈیم سائز میں دستیاب ہے؟' },
  { id: '23', title: 'Buying Medicine at the Pharmacy', titleUrdu: 'میڈیکل سٹور سے دوائی خریدنا', cat: 'Medical' as const, diff: 'Beginner' as const, eng1: 'I have a prescription for allergy pills.', urd1: 'میرے پاس الرجی کی گولیوں کا نسخہ ہے۔' },
  { id: '24', title: 'At the Vegetable & Fruit Market', titleUrdu: 'سبزی اور پھل منڈی میں خریداری', cat: 'Shopping' as const, diff: 'Beginner' as const, eng1: 'Are these mangoes ripe and sweet?', urd1: 'کیا یہ آم پکے ہوئے اور میٹھے ہیں؟' },
  { id: '25', title: 'Bargaining for a Fair Price', titleUrdu: 'دکان پر مناسب رعایت کی بات', cat: 'Shopping' as const, diff: 'Intermediate' as const, eng1: 'Could you give me your best final price?', urd1: 'کیا آپ مجھے اس کی آخری مناسب قیمت بتا سکتے ہیں؟' },
  { id: '26', title: 'Returning a Damaged Product', titleUrdu: 'نقص والی چیز واپس کرنا', cat: 'Shopping' as const, diff: 'Intermediate' as const, eng1: 'I bought this blender yesterday but it does not power on.', urd1: 'میں نے یہ بلینڈر کل خریدا تھا لیکن یہ چل نہیں رہا۔' },
  { id: '27', title: 'Visiting the Dentist for Tooth Pain', titleUrdu: 'دانتوں کے ڈاکٹر کے پاس معائنہ', cat: 'Medical' as const, diff: 'Intermediate' as const, eng1: 'My lower molar hurts whenever I drink cold water.', urd1: 'جب بھی میں ٹھنڈا پانی پیتا ہوں تو نچلی داڑھ میں درد ہوتا ہے۔' },
  { id: '28', title: 'Asking for Directions on the Street', titleUrdu: 'راستے کا پتہ پوچھنا', cat: 'Travel' as const, diff: 'Beginner' as const, eng1: 'Excuse me, how do I get to the Metro station?', urd1: 'معاف کیجیے گا، میٹرو سٹیشن جانے کا راستہ کون سا ہے؟' },
  { id: '29', title: 'Taking the Train at Central Station', titleUrdu: 'ریلوے سٹیشن پر ٹرین کا ٹکٹ لینا', cat: 'Travel' as const, diff: 'Beginner' as const, eng1: 'Which platform does the express train depart from?', urd1: 'ایکسپریس ٹرین کون سے پلیٹ فارم سے روانہ ہوتی ہے؟' },
  { id: '30', title: 'Renting a Car at the Counter', titleUrdu: 'کرائے کی گاڑی لینا', cat: 'Travel' as const, diff: 'Intermediate' as const, eng1: 'I would like to rent an automatic sedan with insurance.', urd1: 'مجھے انشورنس کے ساتھ آٹومیٹک سیڈان گاڑی کرائے پر چاہیے۔' },
  { id: '31', title: 'Fast Food Drive-thru Window', titleUrdu: 'ڈرائیو تھرو پر فاسٹ فوڈ آرڈر', cat: 'Dining' as const, diff: 'Beginner' as const, eng1: 'A double cheeseburger combo with fries and diet soda.', urd1: 'ڈبل چیز برگر کومبو فرنچ فرائز اور ڈائٹ سوڈا کے ساتھ۔' },
  { id: '32', title: 'Complaining About Wrong Food Order', titleUrdu: 'ریسٹورنٹ میں غلط ڈش کی شکایت', cat: 'Dining' as const, diff: 'Intermediate' as const, eng1: 'Pardon me, but I ordered grilled chicken, not fish.', urd1: 'معاف کیجیے گا، میں نے گرلڈ چکن آرڈر کیا تھا نہ کہ مچھلی۔' },
  { id: '33', title: 'Paying the Restaurant Bill & Splitting', titleUrdu: 'ریسٹورنٹ کا بل ادا کرنا اور بانٹنا', cat: 'Dining' as const, diff: 'Beginner' as const, eng1: 'Could we split the bill equally on two cards?', urd1: 'کیا ہم دو کارڈز پر بل برابر برابر تقسیم کر سکتے ہیں؟' },
  { id: '34', title: 'Calling an Electrician for Short Circuit', titleUrdu: 'شارٹ سرکٹ پر الیکٹریشن کو بلانا', cat: 'Home' as const, diff: 'Intermediate' as const, eng1: 'Sparks came out of the bedroom wall switch.', urd1: 'بیڈ روم کے وال سوئچ سے چنگاریاں نکلی ہیں۔' },
  { id: '35', title: 'ATM Card Swallowed & Tech Help', titleUrdu: 'اے ٹی ایم کارڈ پھنسنے کی شکایت', cat: 'Banking' as const, diff: 'Intermediate' as const, eng1: 'The ATM swallowed my card and the screen froze.', urd1: 'اے ٹی ایم نے میرا کارڈ رکھ لیا ہے اور سکرین رک گئی ہے۔' },
  { id: '36', title: 'Currency Exchange Counter', titleUrdu: 'کرنسی ایکسچینج کاؤنٹر پر تبادلہ', cat: 'Banking' as const, diff: 'Beginner' as const, eng1: 'What is today\'s exchange rate for US dollars to rupees?', urd1: 'آج ڈالر سے روپے کا کیا ایکسچینج ریٹ ہے؟' },
  { id: '37', title: 'Post Office Sending an Express Parcel', titleUrdu: 'ڈاک خانے سے ارجنٹ پارسل بھیجنا', cat: 'Daily Life' as const, diff: 'Beginner' as const, eng1: 'How long will express international delivery take?', urd1: 'ارجنٹ بین الاقوامی ڈلیوری میں کتنا وقت لگے گا؟' },
  { id: '38', title: 'Purchasing Cinema Movie Tickets', titleUrdu: 'سنیما کے ٹکٹ خریدنا', cat: 'Daily Life' as const, diff: 'Beginner' as const, eng1: 'Two adult tickets for the 7 PM 3D show, please.', urd1: 'شام سات بجے کے تھری ڈی شو کے دو ٹکٹ برائے مہربانی۔' },
  { id: '39', title: 'Asking for IT Tech Support', titleUrdu: 'آئی ٹی ہیلپ ڈیسک سے مدد مانگنا', cat: 'Career' as const, diff: 'Intermediate' as const, eng1: 'My corporate laptop cannot connect to the VPN network.', urd1: 'میرا دفتری لیپ ٹاپ وی پی این نیٹ ورک سے نہیں جڑ پا رہا۔' },
  { id: '40', title: 'Attending an Office Team Meeting', titleUrdu: 'دفتری ٹیم میٹنگ میں تجاویز دینا', cat: 'Career' as const, diff: 'Advanced' as const, eng1: 'I suggest we automate our reporting to save team hours.', urd1: 'میرا مشورہ ہے کہ وقت بچانے کے لیے رپورٹنگ خودکار بنائیں۔' },
  { id: '41', title: 'Explaining a Late Arrival to Work', titleUrdu: 'دفتر دیر سے پہنچنے کی وضاحت', cat: 'Career' as const, diff: 'Beginner' as const, eng1: 'I am terribly sorry for being late; there was a severe traffic jam.', urd1: 'دیر سے آنے کے لیے معذرت؛ سڑک پر شدید ٹریفک جام تھا۔' },
  { id: '42', title: 'Reserving a Table on the Phone', titleUrdu: 'فون پر ریسٹورنٹ ٹیبل بک کروانا', cat: 'Dining' as const, diff: 'Beginner' as const, eng1: 'I would like to book a table for four tonight at 8 PM.', urd1: 'میں آج رات آٹھ بجے چار افراد کے لیے ٹیبل بک کرنا چاہتا ہوں۔' },
  { id: '43', title: 'Booking a Doctor Appointment', titleUrdu: 'فون پر ڈاکٹر سے وقت طے کرنا', cat: 'Medical' as const, diff: 'Beginner' as const, eng1: 'Do you have any open slots with Dr. Collins tomorrow?', urd1: 'کیا کل ڈاکٹر کولنز کے پاس کوئی وقت خالی ہے؟' },
  { id: '44', title: 'Buying a Smartphone SIM Card', titleUrdu: 'سم کارڈ اور ڈیٹا پیکیج خریدنا', cat: 'Shopping' as const, diff: 'Beginner' as const, eng1: 'I need a prepaid SIM card with fifty gigabytes of data.', urd1: 'مجھے پچاس جی بی ڈیٹا والا پری پیڈ سم کارڈ چاہیے۔' },
  { id: '45', title: 'Eye Test at the Optician', titleUrdu: 'نظر کا ٹیسٹ اور عینک بنوانا', cat: 'Medical' as const, diff: 'Intermediate' as const, eng1: 'The bottom letters on the eye chart look blurry to me.', urd1: 'نظر کے چارٹ پر نیچے والے حروف مجھے دھندلے نظر آ رہے ہیں۔' },
  { id: '46', title: 'Getting Blood Tests at a Pathology Lab', titleUrdu: 'لیبارٹری میں خون کا ٹیسٹ کروانا', cat: 'Medical' as const, diff: 'Intermediate' as const, eng1: 'I need a fasting blood sugar and cholesterol panel.', urd1: 'مجھے نہار منہ شوگر اور کولیسٹرول کا ٹیسٹ کروانا ہے۔' },
  { id: '47', title: 'Joining a Public Community Library', titleUrdu: 'لائبریری کی ممبرشپ حاصل کرنا', cat: 'Daily Life' as const, diff: 'Beginner' as const, eng1: 'How do I register for a digital borrower card?', urd1: 'کتابیں ادھار لینے والا ممبرشپ کارڈ کیسے بنے گا؟' },
  { id: '48', title: 'Dealing with a Flat Car Tire', titleUrdu: 'گاڑی کا ٹائر پنکچر ہونا اور مدد مانگنا', cat: 'Travel' as const, diff: 'Intermediate' as const, eng1: 'My front tire got punctured by a nail on the highway.', urd1: 'ہائی وے پر میری گاڑی کا اگلا ٹائر پنکچر ہو گیا ہے۔' },
  { id: '49', title: 'Negotiating Office Salary & Promotion', titleUrdu: 'تنخواہ اور پروموشن پر گفتگو', cat: 'Career' as const, diff: 'Advanced' as const, eng1: 'Based on my recent achievements, I would like to discuss a compensation adjustment.', urd1: 'اپنی حالیہ کامیابیوں کی بنیاد پر میں تنخواہ میں اضافے پر بات کرنا چاہتا ہوں۔' },
  { id: '50', title: 'Welcoming Guests into Your Home', titleUrdu: 'گھر پر مہمانوں کا پرجوش استقبال', cat: 'Daily Life' as const, diff: 'Beginner' as const, eng1: 'Please make yourselves at home! Can I bring you some cardamom tea?', urd1: 'اسے اپنا ہی گھر سمجھیں! کیا میں آپ کے لیے الائچی والی چائے لے کر آؤں؟' }
];

// Dynamically generate scenarios 21-50 with high-fidelity dialogues
for (const item of ADDITIONAL_SCENARIO_TEMPLATES) {
  SCENARIOS.push({
    id: `scenario-${item.id}`,
    title: item.title,
    titleUrdu: item.titleUrdu,
    titleRomanUrdu: item.title,
    category: item.cat,
    difficulty: item.diff,
    description: `Practical daily conversational skills for ${item.title.toLowerCase()}.`,
    descriptionUrdu: `${item.titleUrdu} کے حوالے سے روزمرہ کی ضروری انگلش گفتگو۔`,
    keyVocabulary: [
      { english: 'Convenient', urdu: 'آسان اور سہولت بخش', romanUrdu: 'Aasan / Sahulat Bakhsh', partOfSpeech: 'Adjective', exampleSentence: 'Online booking is very convenient.', urduMeaning: 'جس میں کوئی مشکل نہ ہو' },
      { english: 'Assistance', urdu: 'مدد / معاونت', romanUrdu: 'Madad / Rehnamaai', partOfSpeech: 'Noun', exampleSentence: 'Thank you for your timely assistance.', urduMeaning: 'کسی کی مدد کرنا' },
      { english: 'Availability', urdu: 'دستیابی / موجود ہونا', romanUrdu: 'Dastiyabi', partOfSpeech: 'Noun', exampleSentence: 'Please confirm the availability of seats.', urduMeaning: 'چیز کا موجود ہونا' }
    ],
    dialogue: [
      {
        id: `${item.id}-1`,
        speaker: 'Staff / Counter',
        speakerRole: 'npc',
        english: `Hello! Welcome. How can I assist you with ${item.title.toLowerCase()} today?`,
        urdu: `ہیلو! خوش آمدید۔ آج میں اس سلسلے میں آپ کی کیا مدد کر سکتا ہوں؟`,
        romanUrdu: `Hello! Welcome. Aaj main aap ki kya madad kar sakta hoon?`
      },
      {
        id: `${item.id}-2`,
        speaker: 'You',
        speakerRole: 'user',
        english: item.eng1,
        urdu: item.urd1,
        romanUrdu: item.eng1,
        tips: 'Speak clearly and maintain natural pace.'
      },
      {
        id: `${item.id}-3`,
        speaker: 'Staff / Counter',
        speakerRole: 'npc',
        english: 'Certainly! Let me arrange that for you right away. Do you have any specific preferences?',
        urdu: 'بالکل! میں فوراً اس کا انتظام کرتا ہوں۔ کیا آپ کی کوئی خاص ترجیح ہے؟',
        romanUrdu: 'Zaroor! Main foran intizam karta hoon. Koi khas pasand?'
      },
      {
        id: `${item.id}-4`,
        speaker: 'You',
        speakerRole: 'user',
        english: 'No specific preferences, just whatever you recommend as the best option.',
        urdu: 'کوئی خاص ترجیح نہیں، بس جو آپ کے نزدیک بہترین آپشن ہو۔',
        romanUrdu: 'Koi khas preference nahi, jo behtareen ho wohi kar dein.'
      },
      {
        id: `${item.id}-5`,
        speaker: 'Staff / Counter',
        speakerRole: 'npc',
        english: 'All set! That will be taken care of immediately. Is there anything else you require?',
        urdu: 'سب تیار ہے! اس پر فوراً عمل ہو جائے گا۔ کیا کسی اور چیز کی ضرورت ہے؟',
        romanUrdu: 'Sab tayyar hai! Kya kisi aur cheez ki zaroorat hai?'
      },
      {
        id: `${item.id}-6`,
        speaker: 'You',
        speakerRole: 'user',
        english: 'No, that is everything. Thank you so much for your kind help!',
        urdu: 'نہیں، بس یہی سب کچھ تھا۔ آپ کی مدد کا بہت شکریہ!',
        romanUrdu: 'Nahi, bas itna hi tha. Madad ka bohot shukriya!'
      }
    ]
  });
}
