import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import sys
# Load the dataset


symptom1 = sys.argv[1]
symptom2 = sys.argv[2]
symptom3 = sys.argv[3]
symptom4 = sys.argv[4]
symptom5 = sys.argv[5]

# pd.set_option('future.no_silent_downcasting', True)

df = pd.read_csv("Training.csv")
tr = pd.read_csv("Testing.csv")

# Define the list of symptoms
l1 = ['back_pain','constipation','abdominal_pain','diarrhoea','mild_fever','yellow_urine',
      'yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach',
      'swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm','throat_irritation',
      'redness_of_eyes','sinus_pressure','runny_nose','congestion','chest_pain','weakness_in_limbs',
      'fast_heart_rate','pain_during_bowel_movements','pain_in_anal_region','bloody_stool',
      'irritation_in_anus','neck_pain','dizziness','cramps','bruising','obesity','swollen_legs',
      'swollen_blood_vessels','puffy_face_and_eyes','enlarged_thyroid','brittle_nails',
      'swollen_extremeties','excessive_hunger','extra_marital_contacts','drying_and_tingling_lips',
      'slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck','swelling_joints',
      'movement_stiffness','spinning_movements','loss_of_balance','unsteadiness',
      'weakness_of_one_body_side','loss_of_smell','bladder_discomfort','foul_smell_of urine',
      'continuous_feel_of_urine','passage_of_gases','internal_itching','toxic_look_(typhos)',
      'depression','irritability','muscle_pain','altered_sensorium','red_spots_over_body','belly_pain',
      'abnormal_menstruation','dischromic _patches','watering_from_eyes','increased_appetite','polyuria',
      'family_history','mucoid_sputum','rusty_sputum','lack_of_concentration','visual_disturbances',
      'receiving_blood_transfusion','receiving_unsterile_injections','coma','stomach_bleeding',
      'distention_of_abdomen','history_of_alcohol_consumption','fluid_overload','blood_in_sputum',
      'prominent_veins_on_calf','palpitations','painful_walking','pus_filled_pimples','blackheads',
      'scurring','skin_peeling','silver_like_dusting','small_dents_in_nails','inflammatory_nails',
      'blister','red_sore_around_nose','yellow_crust_ooze']

# Replace disease names with numerical labels
df.replace({'prognosis': {'Fungal infection': 0, 'Allergy': 1, 'GERD': 2, 'Chronic cholestasis': 3, 
                           'Drug Reaction': 4, 'Peptic ulcer diseae': 5, 'AIDS': 6, 'Diabetes ': 7, 
                           'Gastroenteritis': 8, 'Bronchial Asthma': 9, 'Hypertension ': 10, 
                           'Migraine': 11, 'Cervical spondylosis': 12, 'Paralysis (brain hemorrhage)': 13, 
                           'Jaundice': 14, 'Malaria': 15, 'Chicken pox': 16, 'Dengue': 17, 'Typhoid': 18, 
                           'hepatitis A': 19, 'Hepatitis B': 20, 'Hepatitis C': 21, 'Hepatitis D': 22, 
                           'Hepatitis E': 23, 'Alcoholic hepatitis': 24, 'Tuberculosis': 25, 'Common Cold': 26, 
                           'Pneumonia': 27, 'Dimorphic hemmorhoids(piles)': 28, 'Heart attack': 29, 
                           'Varicose veins': 30, 'Hypothyroidism': 31, 'Hyperthyroidism': 32, 'Hypoglycemia': 33, 
                           'Osteoarthristis': 34, 'Arthritis': 35, '(vertigo) Paroymsal  Positional Vertigo': 36, 
                           'Acne': 37, 'Urinary tract infection': 38, 'Psoriasis': 39, 'Impetigo': 40}}, inplace=True)

tr.replace({'prognosis': {'Fungal infection': 0, 'Allergy': 1, 'GERD': 2, 'Chronic cholestasis': 3, 
                           'Drug Reaction': 4, 'Peptic ulcer diseae': 5, 'AIDS': 6, 'Diabetes ': 7, 
                           'Gastroenteritis': 8, 'Bronchial Asthma': 9, 'Hypertension ': 10, 
                           'Migraine': 11, 'Cervical spondylosis': 12, 'Paralysis (brain hemorrhage)': 13, 
                           'Jaundice': 14, 'Malaria': 15, 'Chicken pox': 16, 'Dengue': 17, 'Typhoid': 18, 
                           'hepatitis A': 19, 'Hepatitis B': 20, 'Hepatitis C': 21, 'Hepatitis D': 22, 
                           'Hepatitis E': 23, 'Alcoholic hepatitis': 24, 'Tuberculosis': 25, 'Common Cold': 26, 
                           'Pneumonia': 27, 'Dimorphic hemmorhoids(piles)': 28, 'Heart attack': 29, 
                           'Varicose veins': 30, 'Hypothyroidism': 31, 'Hyperthyroidism': 32, 'Hypoglycemia': 33, 
                           'Osteoarthristis': 34, 'Arthritis': 35, '(vertigo) Paroymsal  Positional Vertigo': 36, 
                           'Acne': 37, 'Urinary tract infection': 38, 'Psoriasis': 39, 'Impetigo': 40}}, inplace=True)

# Split the data into features and target
X_train = df[l1]
y_train = df['prognosis']
X_test = tr[l1]
y_test = tr['prognosis']

# Training the model (Random Forest)
clf = RandomForestClassifier()
clf.fit(X_train, y_train)

# Predicting the disease based on user input
user_symptoms = [symptom1,symptom2,symptom3,symptom4,symptom5]


# Convert user symptoms to input vector
input_vector = [1 if symptom in user_symptoms else 0 for symptom in l1]

# Predict the disease
predicted_label = clf.predict([input_vector])[0]

# Map the predicted label back to the disease name
disease = ['Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction',
           'Peptic ulcer diseae', 'AIDS', 'Diabetes', 'Gastroenteritis', 'Bronchial Asthma', 
           'Hypertension', 'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)', 
           'Jaundice', 'Malaria', 'Chicken pox', 'Dengue', 'Typhoid', 'hepatitis A', 
           'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Alcoholic hepatitis', 
           'Tuberculosis', 'Common Cold', 'Pneumonia', 'Dimorphic hemmorhoids(piles)', 
           'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism', 'Hypoglycemia', 
           'Osteoarthristis', 'Arthritis', '(vertigo) Paroymsal  Positional Vertigo', 'Acne', 
           'Urinary tract infection', 'Psoriasis', 'Impetigo']

predicted_disease_name = disease[predicted_label]
print("<div style='font-size: 18px;'>Please visit a doctor for further evaluation and treatment. There is a slight chance of suffering from <span style='font-weight: bold; color: red;'>{}</span></div>".format(predicted_disease_name))