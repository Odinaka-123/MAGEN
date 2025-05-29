import random
import csv
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

sources = [
    "Dark Web Monitor", "BreachWatch", "HaveIBeenPwned", "Internal Audit", "Phishing Report", "Credential Stuffing Attack"
]
affected_data = [
    "Credit Card", "Email", "Password", "Phone", "Bank Account", "Social Security Number"
]
scenarios = [
    "was found in a breach of a popular social media platform.",
    "was leaked due to a phishing attack targeting employees.",
    "was exposed in a ransomware incident at a major retailer.",
    "was compromised in a credential stuffing attack.",
    "was included in a public data dump on a hacker forum.",
    "was accessed during an unauthorized intrusion into a cloud service.",
    "was discovered in a breach of a healthcare provider.",
    "was found in a breach of an e-commerce website.",
    "was leaked in a government data exposure incident."
]

def random_date():
    start = datetime(2024, 5, 1)
    end = datetime.now()
    return (start + timedelta(days=random.randint(0, (end-start).days))).strftime("%Y-%m-%d %H:%M:%S")

with open('fake_breach_data_v1.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['id', 'email', 'phone', 'password', 'breach_status', 'breach_source', 'breach_timestamp', 'description']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for i in range(500):
        email = fake.email()
        phone = fake.phone_number()
        password = fake.password()
        status = random.choice(["COMPROMISED", "SAFE", "RESOLVED"])
        source = random.choice(sources)
        timestamp = random_date()
        data = random.choice(affected_data)
        scenario = random.choice(scenarios)
        description = (
            f"Your {data.lower()} information {scenario} "
            f"Detected by {source} on {timestamp}."
        )
        writer.writerow({
            'id': i+1,
            'email': email,
            'phone': phone,
            'password': password,
            'breach_status': status,
            'breach_source': source,
            'breach_timestamp': timestamp,
            'description': description
        })