"""
data_generator.py — TransactionGuard
Generates synthetic labeled transaction data with controllable fraud injection.

Primary fraud type: Card-testing / velocity-abuse fraud
  - Rapid sequential small-value transactions
  - Sequential / clustered card numbers
  - High failure-then-success ratios
  - Mismatched IP/billing geography
  - Odd-hour bursts
  - New-device + high-value combos
"""

import random
import uuid
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()
random.seed(42)
np.random.seed(42)

# ── Constants ──────────────────────────────────────────────────────────────────
TOTAL_ROWS = 1_200
FRAUD_RATE = 0.20          # 20 % fraud
MERCHANT_CATEGORIES = [
    "e-commerce", "gaming", "travel", "food_delivery",
    "electronics", "fashion", "groceries", "streaming",
]
MERCHANT_RISK_TIER = {
    "gaming": 3, "travel": 2, "electronics": 3,
    "e-commerce": 2, "food_delivery": 1, "fashion": 1,
    "groceries": 1, "streaming": 1,
}
COUNTRIES = ["IN", "US", "GB", "SG", "AE", "NG", "PK", "BD", "RU", "CN"]
HIGH_RISK_COUNTRIES = {"NG", "PK", "BD", "RU", "CN"}

# ── Helper functions ───────────────────────────────────────────────────────────

def _random_ip(high_risk: bool = False) -> str:
    if high_risk and random.random() < 0.6:
        prefix = random.choice(["41.", "196.", "37.", "91."])
        return prefix + ".".join(str(random.randint(1, 254)) for _ in range(2))
    return ".".join(str(random.randint(1, 254)) for _ in range(4))


def _card_bin(sequential: bool = False, base_bin: str = None) -> str:
    """Return a 6-digit BIN. Sequential fraud = bins increment by 1."""
    if sequential and base_bin:
        return str(int(base_bin) + random.randint(0, 3)).zfill(6)
    prefixes = ["4111", "5200", "3714", "6011", "3056"]
    return random.choice(prefixes) + str(random.randint(10, 99))


def _amount(fraud: bool, fraud_type: str) -> float:
    if not fraud:
        return round(random.lognormvariate(4.5, 1.2), 2)   # ~$90 median legit
    if fraud_type == "card_testing":
        return round(random.uniform(0.50, 9.99), 2)         # tiny amounts
    elif fraud_type == "high_value_new_device":
        return round(random.uniform(800, 4999), 2)
    else:
        return round(random.lognormvariate(5.5, 0.8), 2)


def _hour(fraud: bool) -> int:
    if fraud and random.random() < 0.55:
        return random.choice([1, 2, 3, 4, 23, 0])   # odd hours
    return random.randint(6, 22)


# ── Legitimate transaction builder ────────────────────────────────────────────

def _legit_row(ts: datetime, device_pool: list, account_pool: list) -> dict:
    account_id = random.choice(account_pool)
    device_id = random.choice(device_pool)
    country = random.choice(COUNTRIES)
    merchant_cat = random.choice(MERCHANT_CATEGORIES)
    amount = _amount(False, None)
    hour = _hour(False)
    ip = _random_ip(False)
    card_bin = _card_bin()
    account_age_days = random.randint(30, 2000)
    device_age_days = random.randint(1, 730)

    return {
        "transaction_id": str(uuid.uuid4()),
        "timestamp": ts.replace(hour=hour, minute=random.randint(0, 59)),
        "account_id": account_id,
        "device_id": device_id,
        "card_bin": card_bin,
        "amount": amount,
        "currency": "USD",
        "merchant_category": merchant_cat,
        "merchant_risk_tier": MERCHANT_RISK_TIER[merchant_cat],
        "billing_country": country,
        "ip_country": country if random.random() < 0.92 else random.choice(COUNTRIES),
        "ip_address": ip,
        "account_age_days": account_age_days,
        "device_age_days": device_age_days,
        "prior_declines_1h": random.choices([0, 1, 2], weights=[0.85, 0.12, 0.03])[0],
        "txn_count_1h": random.randint(1, 4),
        "txn_count_24h": random.randint(1, 12),
        "cards_on_device_7d": random.randint(1, 3),
        "accounts_on_ip_24h": random.randint(1, 2),
        "is_vpn_or_proxy": int(random.random() < 0.04),
        "failed_then_success": int(random.random() < 0.05),
        "is_new_device": int(device_age_days < 2),
        "hour_of_day": hour,
        "is_fraud": 0,
        "fraud_type": "legit",
    }


# ── Fraud transaction builders ─────────────────────────────────────────────────

def _card_testing_burst(ts: datetime, n: int = 6) -> list[dict]:
    """A burst of rapid small-value card-testing transactions from one device/IP."""
    device_id = "dev_" + fake.md5()[:8]
    ip = _random_ip(high_risk=True)
    ip_country = random.choice(list(HIGH_RISK_COUNTRIES))
    base_bin = str(random.randint(411100, 520099))
    rows = []
    for i in range(n):
        offset = timedelta(seconds=random.randint(5, 40) * (i + 1))
        txn_ts = ts + offset
        rows.append({
            "transaction_id": str(uuid.uuid4()),
            "timestamp": txn_ts,
            "account_id": "acc_" + fake.md5()[:8],
            "device_id": device_id,
            "card_bin": _card_bin(sequential=True, base_bin=base_bin),
            "amount": _amount(True, "card_testing"),
            "currency": "USD",
            "merchant_category": random.choice(["gaming", "streaming"]),
            "merchant_risk_tier": 3,
            "billing_country": "US",
            "ip_country": ip_country,
            "ip_address": ip,
            "account_age_days": random.randint(0, 3),
            "device_age_days": random.randint(0, 1),
            "prior_declines_1h": random.randint(3, 9),
            "txn_count_1h": i + 2,
            "txn_count_24h": i + 3,
            "cards_on_device_7d": i + 2,
            "accounts_on_ip_24h": random.randint(3, 10),
            "is_vpn_or_proxy": int(random.random() < 0.7),
            "failed_then_success": int(i > 1),
            "is_new_device": 1,
            "hour_of_day": _hour(True),
            "is_fraud": 1,
            "fraud_type": "card_testing",
        })
    return rows


def _high_value_new_device(ts: datetime) -> dict:
    country = random.choice(COUNTRIES)
    ip_country = random.choice(list(HIGH_RISK_COUNTRIES))
    return {
        "transaction_id": str(uuid.uuid4()),
        "timestamp": ts,
        "account_id": "acc_" + fake.md5()[:8],
        "device_id": "dev_" + fake.md5()[:8],
        "card_bin": _card_bin(),
        "amount": _amount(True, "high_value_new_device"),
        "currency": "USD",
        "merchant_category": random.choice(["electronics", "travel"]),
        "merchant_risk_tier": 3,
        "billing_country": country,
        "ip_country": ip_country,
        "ip_address": _random_ip(high_risk=True),
        "account_age_days": random.randint(0, 7),
        "device_age_days": 0,
        "prior_declines_1h": random.randint(0, 2),
        "txn_count_1h": random.randint(1, 3),
        "txn_count_24h": random.randint(1, 5),
        "cards_on_device_7d": random.randint(2, 5),
        "accounts_on_ip_24h": random.randint(2, 6),
        "is_vpn_or_proxy": int(random.random() < 0.6),
        "failed_then_success": int(random.random() < 0.4),
        "is_new_device": 1,
        "hour_of_day": _hour(True),
        "is_fraud": 1,
        "fraud_type": "high_value_new_device",
    }


def _geo_mismatch_fraud(ts: datetime) -> dict:
    billing = random.choice(list(set(COUNTRIES) - HIGH_RISK_COUNTRIES))
    ip_country = random.choice(list(HIGH_RISK_COUNTRIES))
    return {
        "transaction_id": str(uuid.uuid4()),
        "timestamp": ts,
        "account_id": "acc_" + fake.md5()[:8],
        "device_id": "dev_" + fake.md5()[:8],
        "card_bin": _card_bin(),
        "amount": round(random.lognormvariate(5.5, 0.8), 2),
        "currency": "USD",
        "merchant_category": random.choice(MERCHANT_CATEGORIES),
        "merchant_risk_tier": random.randint(1, 3),
        "billing_country": billing,
        "ip_country": ip_country,
        "ip_address": _random_ip(high_risk=True),
        "account_age_days": random.randint(0, 30),
        "device_age_days": random.randint(0, 5),
        "prior_declines_1h": random.randint(0, 3),
        "txn_count_1h": random.randint(1, 5),
        "txn_count_24h": random.randint(1, 8),
        "cards_on_device_7d": random.randint(1, 4),
        "accounts_on_ip_24h": random.randint(2, 8),
        "is_vpn_or_proxy": int(random.random() < 0.8),
        "failed_then_success": int(random.random() < 0.3),
        "is_new_device": int(random.random() < 0.7),
        "hour_of_day": _hour(True),
        "is_fraud": 1,
        "fraud_type": "geo_mismatch",
    }


# ── Borderline / ambiguous fraud (makes test set harder) ──────────────────────

def _borderline_fraud(ts: datetime, device_pool: list) -> dict:
    """Fraud that looks almost legit — important for honest evaluation."""
    base = _legit_row(ts, device_pool, ["acc_borderline_" + fake.md5()[:6]])
    base["is_fraud"] = 1
    base["fraud_type"] = "borderline"
    base["prior_declines_1h"] = random.randint(2, 4)
    base["txn_count_1h"] = random.randint(4, 7)
    base["cards_on_device_7d"] = random.randint(2, 4)
    base["is_vpn_or_proxy"] = int(random.random() < 0.5)
    return base


# ── Main generator ─────────────────────────────────────────────────────────────

def generate_dataset(n_rows: int = TOTAL_ROWS, fraud_rate: float = FRAUD_RATE,
                     save_path: str = "transactions.csv") -> pd.DataFrame:
    n_fraud = int(n_rows * fraud_rate)
    n_legit = n_rows - n_fraud

    # pools for legit traffic
    device_pool = ["dev_" + fake.md5()[:8] for _ in range(120)]
    account_pool = ["acc_" + fake.md5()[:8] for _ in range(200)]

    base_ts = datetime(2025, 1, 1)
    rows = []

    # ── Legit rows ─────────────────────────────────────────────────
    for i in range(n_legit):
        ts = base_ts + timedelta(hours=random.randint(0, 8760))
        rows.append(_legit_row(ts, device_pool, account_pool))

    # ── Fraud rows ─────────────────────────────────────────────────
    n_card_testing   = int(n_fraud * 0.45)
    n_high_value     = int(n_fraud * 0.25)
    n_geo            = int(n_fraud * 0.20)
    n_borderline     = n_fraud - n_card_testing - n_high_value - n_geo

    # card-testing bursts
    added = 0
    while added < n_card_testing:
        burst_size = min(random.randint(4, 8), n_card_testing - added)
        ts = base_ts + timedelta(hours=random.randint(0, 8760))
        rows.extend(_card_testing_burst(ts, burst_size))
        added += burst_size

    # high-value new-device
    for _ in range(n_high_value):
        ts = base_ts + timedelta(hours=random.randint(0, 8760))
        rows.append(_high_value_new_device(ts))

    # geo-mismatch
    for _ in range(n_geo):
        ts = base_ts + timedelta(hours=random.randint(0, 8760))
        rows.append(_geo_mismatch_fraud(ts))

    # borderline
    for _ in range(n_borderline):
        ts = base_ts + timedelta(hours=random.randint(0, 8760))
        rows.append(_borderline_fraud(ts, device_pool))

    df = pd.DataFrame(rows)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    df.to_csv(save_path, index=False)
    print(f"[OK] Generated {len(df)} rows  |  fraud={df['is_fraud'].sum()}  |  saved -> {save_path}")
    return df


if __name__ == "__main__":
    df = generate_dataset()
    print(df["fraud_type"].value_counts())
    print(df[["amount", "prior_declines_1h", "txn_count_1h"]].describe())
